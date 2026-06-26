#!/usr/bin/env node
/**
 * Submit ONLY changed URLs to IndexNow (Bing, Yandex, Seznam, Naver — NOT Google),
 * one request per URL. This is the incremental, real-time pattern IndexNow is
 * designed for.
 *
 * Use this after editing or adding specific pages, INSTEAD of re-dumping the whole
 * sitemap with indexnow-submit.mjs — Bing Webmaster flags repeated full-sitemap
 * pushes as "IndexNow is in batch mode". Submitting just the URLs that actually
 * changed keeps submissions incremental.
 *
 * Usage:
 *   # explicit URLs or site-absolute paths:
 *   node scripts/indexnow-urls.mjs https://flipmyfiles.com/en/blog/what-is-zip
 *   node scripts/indexnow-urls.mjs /en/convert/gz-to-zip /en/convert/tar-to-zip
 *
 *   # expand each locale-less path across all locales:
 *   node scripts/indexnow-urls.mjs --all-locales /convert/gz-to-zip /blog/what-is-zip
 *
 * The IndexNow key is public by design (hosted at KEY_LOCATION).
 */

const KEY = 'e73cb6489af34a4097fe0c15286f9956';
const HOST = 'flipmyfiles.com';
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const LOCALES = ['en', 'pl', 'el', 'es', 'pt', 'de', 'fr', 'se', 'it', 'ua', 'cz'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toUrl = (a) => (/^https?:\/\//.test(a) ? a : ORIGIN + (a.startsWith('/') ? a : '/' + a));

const args = process.argv.slice(2);
const allLocales = args.includes('--all-locales');
const rest = args.filter((a) => a !== '--all-locales');
if (rest.length === 0) {
  console.error('Usage: node scripts/indexnow-urls.mjs [--all-locales] <url|/path> ...');
  process.exit(1);
}

const raw = allLocales
  ? rest.flatMap((p) => {
      const path = p.startsWith('/') ? p : '/' + p;
      return LOCALES.map((l) => `${ORIGIN}/${l}${path}`);
    })
  : rest.map(toUrl);
const urls = [...new Set(raw)];

let ok = 0;
for (const url of urls) {
  const endpoint = `${ENDPOINT}?url=${encodeURIComponent(url)}&key=${KEY}&keyLocation=${encodeURIComponent(KEY_LOCATION)}`;
  let status = 0;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(endpoint, { method: 'GET' });
      status = res.status;
      if (status === 200 || status === 202) break;
    } catch {
      /* network blip — retry */
    }
    await sleep(2500);
  }
  const good = status === 200 || status === 202;
  if (good) ok++;
  console.log(`${good ? 'OK ' : 'ERR'} ${status || '---'}  ${url}`);
}
console.log(`\nSubmitted ${ok}/${urls.length} URLs individually to IndexNow.`);
if (ok === 0) process.exit(1);
