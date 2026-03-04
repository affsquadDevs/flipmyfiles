# FlipMyFiles

A free, browser-based online file converter supporting 100+ formats across images, video, audio, documents, and archives. No signup required. Files are processed securely and never stored.

**Live:** [flipmyfiles.com](https://flipmyfiles.com)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Font:** Inter (Google Fonts)
- **Icons:** Lucide React
- **Video/Audio conversion:** FFmpeg (WebAssembly, runs in-browser)
- **Image conversion:** Sharp (server-side)

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

---

## Page Structure

| Route | Description |
|---|---|
| `/` | Homepage with file upload, popular conversions, and FAQ |
| `/tools` | Full grid of all available conversion tools |
| `/tools/[category]` | Filtered tools by category (image, video, audio, document, archive) |
| `/convert/[slug]` | Individual converter page (e.g. `/convert/png-to-jpg`) |
| `/about` | About page — mission and privacy commitment |
| `/contact` | Contact page with support email |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

---

## Key File Locations

| File | Path |
|---|---|
| Favicon (ICO) | `public/favicon.ico` |
| Favicon 16×16 | `public/favicon-16x16.png` |
| Favicon 32×32 | `public/favicon-32x32.png` |
| Apple Touch Icon | `public/apple-touch-icon.png` |
| OG Image | `public/og-image.png` |
| Logo | `public/logo.png` |
| robots.txt | `public/robots.txt` |
| sitemap.xml | Generated at `src/app/sitemap.ts` |
| ads.txt | `public/ads.txt` |
| Manifest | `public/manifest.json` |

---

## Conversion Support

| Category | Formats |
|---|---|
| Images | JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, SVG, ICO, HEIC |
| Video | MP4, AVI, MOV, MKV, WebM, FLV, WMV |
| Audio | MP3, WAV, OGG, FLAC, AAC, WMA, M4A |
| Documents | PDF, DOCX, TXT, CSV, XLSX |
| Archives | ZIP, TAR, GZ |

---

## Notes

- Video and audio conversions run entirely in the browser via WebAssembly — files are never uploaded to the server
- Image and document conversions are processed server-side in memory and discarded immediately after download
- AdSense publisher ID: `ca-pub-2980943706375055`
- GTM container: `GTM-WPM68V79`
