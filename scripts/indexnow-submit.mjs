#!/usr/bin/env node
/**
 * Submit ALL site URLs to IndexNow (Bing, Yandex, Seznam, Naver — NOT Google).
 *
 * Reads the live sitemap.xml and pushes every <loc> URL in one bulk request.
 *
 * USE SPARINGLY — only for the initial submission or a full re-index (e.g. a
 * sitewide template change). Repeatedly re-dumping the whole sitemap is what Bing
 * Webmaster flags as "IndexNow is in batch mode". For routine content changes,
 * submit only the URLs that changed with the incremental script instead:
 *
 *   node scripts/indexnow-urls.mjs --all-locales /blog/my-new-post
 *
 * The IndexNow key is public by design (it is hosted at KEY_LOCATION), so it is
 * fine to keep it in the repo. The key file lives at public/<KEY>.txt.
 */

const KEY = 'e73cb6489af34a4097fe0c15286f9956';
const HOST = 'flipmyfiles.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000; // IndexNow max URLs per request

async function main() {
  const xml = await (await fetch(SITEMAP)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    console.error('No <loc> URLs found in sitemap — aborting.');
    process.exit(1);
  }
  console.log(`Found ${urls.length} URLs in ${SITEMAP}`);

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    const body = await res.text();
    console.log(`Batch ${i / BATCH + 1}: submitted ${urlList.length} URLs -> HTTP ${res.status} ${body || '(empty body = accepted)'}`);
    if (res.status !== 200 && res.status !== 202) {
      console.error('Non-success response — check the key file is live at', KEY_LOCATION);
      process.exit(1);
    }
  }
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
