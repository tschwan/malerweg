# Malerweg 2026

A static information website for the Malerweg hiking tour 2026 (04.05.-09.05.2026, Liebethal → Pirna, 6 stages, ~110 km).

## Features

- **Stage Overviews:** Detailed information for each of the 6 stages including distance, elevation, and duration.
- **Interactive Maps:** Route visualization using Leaflet and GPX tracks.
- **Accommodation Info:** Details on overnight stays.
- **Responsive Design:** Mobile-first layout for easy access on the go.
- **Offline Capable Assets:** All essential assets and GPX files can be downloaded directly.

## Tech Stack

This project is built using vanilla web technologies without any build tools or frameworks, ensuring maximum simplicity and longevity:

- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (tokens), CSS Grid/Flexbox, responsive design.
- **JavaScript (Vanilla):** Minimal progressive enhancement for navigation and maps.
- **Leaflet & leaflet-gpx:** For interactive map rendering.

## Project Structure

The source code is primarily located in the `site/` directory:

```text
malerweg/
├── site/                 # Main website directory (serves as web root)
│   ├── index.html        # Landing page
│   ├── etappen.html      # Stage overview
│   ├── etappe-[1-6].html # Individual stage details
│   ├── unterkuenfte.html # Accommodation details
│   ├── ...               # Other informational pages
│   └── assets/           # CSS, JS, Images, and GPX files
├── gpx/                  # Raw GPX tracks
├── mockup/               # Design mockups
└── docs/                 # Project documentation
```

## Local Development

Since the website uses JavaScript `fetch` to load GPX files for the maps, it needs to be served via a local HTTP server (due to CORS restrictions on the `file://` protocol).

You can use any local web server. Here are two easy options:

**Option 1: Python (Recommended, usually pre-installed)**
```bash
python -m http.server 8080 --directory site
```
Then open `http://localhost:8080` in your browser.

**Option 2: Node.js / npx**
```bash
npx serve site
```

## Deployment

The website is fully static and can be hosted on any simple web server or static hosting provider (e.g., GitHub Pages).

**To deploy to GitHub Pages:**
1. Configure your repository settings to use GitHub Pages.
2. Set the source branch to `main`.
3. Set the root folder to `/site` (if supported) or deploy the entire repository root.

For detailed architecture and implementation decisions, please refer to the `IMPLEMENTATION_PLAN.md`.
