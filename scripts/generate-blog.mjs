// ─── Daily blog generator ─────────────────────────────────────────────────────
// Generates N brand-new blog posts with the Claude API, matching the existing
// posts' voice, structure, length, and on-page SEO, then writes them into the
// single source of truth (src/data/blog-posts.ts, English) and every locale
// translation file (src/data/blog/<locale>.json). A push of those changes to
// `main` triggers the production deploy.
//
// Usage:
//   node scripts/generate-blog.mjs              # generate 2 posts, write files
//   node scripts/generate-blog.mjs --count 1    # generate 1 post
//   node scripts/generate-blog.mjs --no-write   # generate + print, write nothing
//
// Env:
//   ANTHROPIC_API_KEY   required — the Claude API key
//   ANTHROPIC_MODEL     optional — defaults to "claude-opus-4-8"
//
// Dependency-free: Node 20+ global fetch, no npm packages.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Keep in sync with src/i18n/routing.ts (non-default locales — English lives in
// src/data/blog-posts.ts and is keyed by slug in src/data/blog/<locale>.json).
const LOCALES = ["pl", "el", "es", "pt", "de", "fr", "se", "it", "ua", "cz"];
const LOCALE_NAMES = {
    pl: "Polish", el: "Greek", es: "Spanish", pt: "Portuguese", de: "German",
    fr: "French", se: "Swedish", it: "Italian", ua: "Ukrainian", cz: "Czech",
};

const SITE = "https://flipmyfiles.com";
const BRAND = "FlipMyFiles";
const COVER_IMAGE = "/og-image.png";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
const API_KEY = process.env.ANTHROPIC_API_KEY;

const args = process.argv.slice(2);
const COUNT = Number(args[args.indexOf("--count") + 1]) > 0 ? Number(args[args.indexOf("--count") + 1]) : 2;
const NO_WRITE = args.includes("--no-write");

const BLOG_TS = path.join(ROOT, "src/data/blog-posts.ts");
const localeFile = (l) => path.join(ROOT, `src/data/blog/${l}.json`);

// JSON Schema for a single generated post object (English source generation).
const GEN_POST_SCHEMA = {
    type: "object",
    properties: {
        slug: { type: "string" },
        title: { type: "string" },
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
        excerpt: { type: "string" },
        readTime: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        coverImageAlt: { type: "string" },
        content: { type: "string" },
    },
    required: ["slug", "title", "metaTitle", "metaDescription", "excerpt", "readTime", "keywords", "coverImageAlt", "content"],
};

// JSON Schema for a single translated post object (translatable fields only).
const TR_POST_SCHEMA = {
    type: "object",
    properties: {
        slug: { type: "string" },
        title: { type: "string" },
        excerpt: { type: "string" },
        content: { type: "string" },
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
    },
    required: ["slug", "title", "excerpt", "content", "metaTitle", "metaDescription"],
};

function postsTool(itemSchema) {
    return {
        name: "submit_posts",
        description: "Submit the finished blog post objects.",
        input_schema: {
            type: "object",
            properties: { posts: { type: "array", items: itemSchema } },
            required: ["posts"],
        },
    };
}

// ─── Anthropic Messages API (tool use → structured, valid JSON) ───────────────
// Forces the model to call submit_posts; the API returns input already parsed as
// an object, so there is no manual JSON.parse (and no "bad control character"
// failures from raw newlines in the content).
async function claudePosts(prompt, tool, maxTokens = 16000) {
    if (!API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            tools: [tool],
            tool_choice: { type: "tool", name: "submit_posts" },
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Anthropic API ${res.status}: ${text.slice(0, 500)}`);
    }
    const data = await res.json();
    const t = (data.content || []).find((b) => b.type === "tool_use");
    if (!t || !Array.isArray(t.input?.posts)) {
        throw new Error(`Model did not return posts (stop_reason: ${data.stop_reason})`);
    }
    return t.input.posts;
}

// ─── Read the existing posts out of blog-posts.ts ─────────────────────────────
// blog-posts.ts is hand-authored TypeScript (template-literal `content`,
// trailing commas, unquoted keys) and is NOT valid JSON, so rather than parse
// the whole array we extract the slim signals we need with targeted regexes and
// locate the array-close so we can splice new entries in.
function readBlogTs(src) {
    const anchor = src.indexOf("blogPosts: BlogPost[] = ");
    if (anchor < 0) throw new Error("Could not locate blogPosts array in blog-posts.ts");
    // The array closes at the first "\n];" after the anchor.
    const insertAt = src.indexOf("\n];", anchor);
    if (insertAt < 0) throw new Error("Could not locate blogPosts array close in blog-posts.ts");
    const arrText = src.slice(anchor, insertAt);
    // Existing slugs and categories from the literal source.
    const slugs = [...arrText.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    const categories = [...arrText.matchAll(/^\s*category:\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    return { insertAt, slugs, categories };
}

// Two recent posts as a style reference. We slice the raw text of the last two
// objects out of the source so the model sees a faithful example (content,
// headings, FAQ block, schemas) without us having to JSON-parse the TS.
function recentSamples(src, n = 2) {
    const anchor = src.indexOf("blogPosts: BlogPost[] = ");
    const close = src.indexOf("\n];", anchor);
    const body = src.slice(anchor, close);
    // Split on top-level object boundaries: each post starts with "  {\n" at
    // 2-space indent. Find the indices of "\n  {\n".
    const starts = [];
    const re = /\n  \{\n/g;
    let m;
    while ((m = re.exec(body)) !== null) starts.push(m.index + 1);
    const last = starts.slice(-n);
    return last.map((s, i) => {
        const end = i + 1 < last.length ? last[i + 1] : body.length;
        return body.slice(s, end).trim().replace(/,\s*$/, "");
    });
}

// ─── Prompts ──────────────────────────────────────────────────────────────────
function generationPrompt(samples, existingSlugs, categories) {
    return `You are a senior writer for ${BRAND}, a free online file-conversion tool (image, video, document and archive formats). Write ${COUNT} brand-new English blog post(s) for the blog.

Match the EXISTING posts exactly in voice, depth, structure, length, and on-page SEO. Here are ${samples.length} real example post objects from the source file (study their tone, body length ~1300-1800 words, practical explanatory voice, lightweight markdown, in-content links to converter pages, and the FAQ section format):

${samples.join("\n\n---\n\n")}

STRICT REQUIREMENTS for each new post object you submit:
- "slug": short, kebab-case, unique. MUST NOT be any of these existing slugs: ${JSON.stringify(existingSlugs)}
- "title": specific and useful (not clickbait), like the samples.
- "metaTitle": <= 60 chars, ends with " | ${BRAND}".
- "metaDescription": 150-160 chars, includes the primary keyword.
- "excerpt": 1-2 sentences for the blog index card.
- "readTime": like "6 min read", proportional to the body length.
- "keywords": array of 6-12 target keyword phrases.
- "coverImageAlt": a concise descriptive alt text for the cover image.
- "content": the FULL article in the SAME lightweight markdown subset the samples use — blocks separated by a blank line, "## H2" and "### H3" headings, "- " bullet lists, inline **bold**, [text](url) links, and optional "| col | col |" markdown tables. Do NOT include a top-level H1 (the title renders separately). Where natural, link to relevant converter pages like [JPG to PNG converter](${SITE}/convert/jpg-to-png) using real ${SITE} URLs. 1300-1800 words.
  IMPORTANT: end the content with a "## Frequently Asked Questions" section containing 4-6 Q&A pairs, each formatted as a line "**Question text?**" immediately followed on the NEXT line by the answer paragraph (3-5 sentences). The renderer extracts FAQs from exactly this format.

The blog category for every post is "Formats". Pick fresh, non-overlapping topics that are NOT already covered by the existing slugs. Each post must be on a distinct topic.

Call the submit_posts tool with exactly ${COUNT} post object(s).`;
}

function translationPrompt(localeName, posts) {
    const slim = posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        content: p.content,
    }));
    return `Translate the following ${posts.length} blog post object(s) from English into ${localeName} for ${BRAND}.

RULES:
- Translate these fields naturally and idiomatically: "title", "excerpt", "metaTitle", "metaDescription", and "content".
- Keep "metaTitle" ending with " | ${BRAND}" (do NOT translate the brand name).
- Preserve ALL markdown structure in "content" exactly: the same "##"/"###" headings, "- " bullets, **bold**, blank-line block separation, any "| | |" tables, and every [text](url) link (translate the visible text, keep the URL identical). Keep the "## Frequently Asked Questions" section and its "**Question?**" + answer-on-next-line format intact (translate the text). Keep any file-format names and hex codes unchanged.
- Keep the "slug" field EXACTLY as given in English (do not translate it).

English posts:
${JSON.stringify(slim, null, 2)}

Call the submit_posts tool with exactly ${posts.length} translated post object(s).`;
}

// ─── Serialize an English post as a blog-posts.ts array element ───────────────
// Field order matches the existing entries for clean diffs. 4-space indent for
// the object body + 2-space base indent (the array items sit at 2 spaces).
function buildSchemas(post) {
    const url = `${SITE}/blog/${post.slug}`;
    return [
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            // Rebuilt from the translated content at render time; placeholder here.
            "mainEntity": [],
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE}/blog` },
                { "@type": "ListItem", "position": 3, "name": post.title, "item": url },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            "headline": post.title,
            "description": post.metaDescription,
            "image": { "@type": "ImageObject", "url": `${SITE}${COVER_IMAGE}` },
            "author": { "@type": "Organization", "name": BRAND, "url": `${SITE}/` },
            "publisher": {
                "@type": "Organization",
                "name": BRAND,
                "logo": { "@type": "ImageObject", "url": `${SITE}/logo.png` },
            },
            "datePublished": post.date,
            "dateModified": post.dateModified ?? post.date,
            "mainEntityOfPage": { "@type": "WebPage", "@id": url },
            "inLanguage": "en",
            "articleSection": post.category,
            "keywords": post.keywords,
        },
    ];
}

function toTsElement(post) {
    const ordered = {
        slug: post.slug,
        title: post.title,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        excerpt: post.excerpt,
        date: post.date,
        dateModified: post.dateModified ?? post.date,
        readTime: post.readTime,
        category: post.category,
        keywords: post.keywords,
        coverImage: post.coverImage,
        coverImageAlt: post.coverImageAlt,
        schemas: post.schemas,
        content: post.content,
    };
    return JSON.stringify(ordered, null, 4)
        .split("\n")
        .map((line) => "  " + line) // base 2-space indent for array items
        .join("\n");
}

// Translation entry: only the locale-overridable fields the loader reads.
function toLocaleEntry(post) {
    return {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
    };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const src = await readFile(BLOG_TS, "utf8");
    const { slugs: existingSlugs, categories } = readBlogTs(src);
    const samples = recentSamples(src, 2);

    console.log(`→ Generating ${COUNT} new English post(s) with ${MODEL}…`);
    const generated = await claudePosts(generationPrompt(samples, existingSlugs, categories), postsTool(GEN_POST_SCHEMA));

    const today = new Date().toISOString().slice(0, 10);
    const seen = new Set(existingSlugs);
    const newPosts = [];
    for (const p of Array.isArray(generated) ? generated : [generated]) {
        if (!p || !p.slug || !p.content) { console.warn("  ⚠ skipping malformed post", p?.slug); continue; }
        if (seen.has(p.slug)) { console.warn(`  ⚠ duplicate slug "${p.slug}" — skipping`); continue; }
        seen.add(p.slug);
        const post = {
            ...p,
            date: today,
            dateModified: today,
            category: "Formats",
            coverImage: COVER_IMAGE,
        };
        post.schemas = buildSchemas(post);
        newPosts.push(post);
    }
    if (!newPosts.length) throw new Error("Model returned no usable new posts");
    console.log(`  ✓ ${newPosts.length} post(s): ${newPosts.map((p) => p.slug).join(", ")}`);

    // Translate into every locale (one call per locale → array of translated posts).
    const translations = {}; // locale -> { slug -> entry }
    for (const loc of LOCALES) {
        console.log(`→ Translating to ${LOCALE_NAMES[loc]} (${loc})…`);
        const arr = await claudePosts(translationPrompt(LOCALE_NAMES[loc], newPosts), postsTool(TR_POST_SCHEMA));
        const bySlug = {};
        newPosts.forEach((en, i) => {
            const tr = arr.find((t) => t && t.slug === en.slug) || arr[i] || {};
            bySlug[en.slug] = toLocaleEntry({ ...en, ...tr });
        });
        translations[loc] = bySlug;
    }

    if (NO_WRITE) {
        console.log("\n--no-write: nothing written. Generated English posts:\n");
        console.log(JSON.stringify(newPosts, null, 2));
        return;
    }

    // Write English into blog-posts.ts (append before the array close "\n];").
    const freshSrc = await readFile(BLOG_TS, "utf8");
    const { insertAt } = readBlogTs(freshSrc);
    const tsBlock = newPosts.map(toTsElement).join(",\n");
    const newSrc = freshSrc.slice(0, insertAt) + ",\n" + tsBlock + freshSrc.slice(insertAt);
    await writeFile(BLOG_TS, newSrc);
    console.log(`  ✓ wrote ${newPosts.length} post(s) to src/data/blog-posts.ts`);

    // Write translations into each src/data/blog/<locale>.json (slug-keyed map).
    for (const loc of LOCALES) {
        const file = localeFile(loc);
        const map = JSON.parse(await readFile(file, "utf8"));
        Object.assign(map, translations[loc]);
        await writeFile(file, JSON.stringify(map, null, 2) + "\n");
        console.log(`  ✓ ${loc}.json now has ${Object.keys(map).length} posts`);
    }

    console.log("\n✅ Done.");
}

main().catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
});
