# Malerweg Webseite – Implementierungsplan

## Kontext

Statische Informationswebseite für die Malerweg-Wanderung 2026 (04.05.–09.05.2026, Liebethal → Pirna, 6 Etappen, ~110 km). Kein Framework, kein Backend, kein Build-Tool. Vanilla HTML + CSS + JavaScript. Hosting via GitHub Pages oder einfachem Webserver.

---

## 1. Projektstruktur

```
malerweg/
├── site/
│   ├── index.html
│   ├── etappen.html
│   ├── etappe-1.html          # Liebethal → Stadt Wehlen
│   ├── etappe-2.html          # Stadt Wehlen → Brand-Baude
│   ├── etappe-3.html          # Brand-Baude → Lichtenhain
│   ├── etappe-4.html          # Lichtenhain → Reinhardtsdorf
│   ├── etappe-5.html          # Reinhardtsdorf → Königstein
│   ├── etappe-6.html          # Königstein → Pirna
│   ├── unterkuenfte.html
│   ├── organisation.html
│   ├── navigation.html
│   ├── anreise.html
│   ├── downloads.html
│   ├── assets/
│   │   ├── css/
│   │   │   ├── tokens.css         # Design-Tokens (CSS Custom Properties)
│   │   │   ├── base.css           # Reset, Typografie, globale Stile
│   │   │   ├── layout.css         # Header, Footer, Grid, Seitenlayout
│   │   │   ├── components.css     # Wiederverwendbare UI-Komponenten
│   │   │   └── pages.css          # Seitenspezifische Stile
│   │   ├── js/
│   │   │   ├── nav.js             # Mobile Navigation, aktiver Link
│   │   │   ├── map.js             # Leaflet-Initialisierung & GPX-Anzeige
│   │   │   └── stage-map.js       # Etappen-spezifische Karte
│   │   ├── images/
│   │   │   └── hero.jpg           # Hero-Bild (Sächsische Schweiz)
│   │   └── gpx/
│   │       ├── etappe-1.gpx
│   │       ├── etappe-2.gpx
│   │       ├── etappe-3.gpx
│   │       ├── etappe-4.gpx
│   │       ├── etappe-5.gpx
│   │       └── etappe-6.gpx
├── docs/
├── gpx/
└── mockup/
```

> Die GPX-Dateien aus `gpx/` werden nach `site/assets/gpx/` kopiert (oder per relativen Pfad referenziert).

---

## 2. Seitenstruktur

| Datei               | Inhalt                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| `index.html`        | Startseite: Hero, Eckdaten, Tourplan-Tabelle, Quick-Links, Übersichtskarte |
| `etappen.html`      | Etappenübersicht: Karte der Gesamtroute, Liste aller 6 Etappen             |
| `etappe-[1-6].html` | Einzelne Etappenseite (siehe Template unten)                               |
| `unterkuenfte.html` | Unterkunftskarten für alle 5 Übernachtungen                                |
| `organisation.html` | Tagesplan, Teilnehmerliste, Treffpunkte                                    |
| `navigation.html`   | GPX-Downloads, empfohlene Apps, QR-Codes                                   |
| `anreise.html`      | Anreise, Parken, ÖPNV (Kirnitzschtalbahn, Bus)                             |
| `downloads.html`    | Zentrale Download-Sammlung (GPX, Packliste, Zeitplan)                      |

### Etappen-Template-Struktur

Jede `etappe-[n].html` folgt diesem Schema:

```
1. Hero-Banner (Etappenname, Basisdaten als Stats-Bar)
2. Interaktive Karte (Leaflet + GPX-Track)
3. Highlights (Aufzählung mit Icons)
4. Pausenmöglichkeiten / Einkehr
5. Schwierige Stellen / Hinweise
6. Alternativen & Abkürzungen
7. Navigation: Vor/Zurück-Links zu benachbarten Etappen
```

---

## 3. Komponentenstruktur

Alle Komponenten werden als wiederverwendbare HTML-Fragmente per `<template>`-Tag oder direkt als HTML-Schnipsel eingebaut. Kein JS-Framework.

| Komponente             | Beschreibung                                                               |
| ---------------------- | -------------------------------------------------------------------------- |
| **Header/Nav**         | Sticky Top-Bar mit Logo, Desktop-Nav, Hamburger-Menü (Mobile)              |
| **Footer**             | Links, Downloads-Übersicht, Notfallinfo (Bergwacht 112)                    |
| **Hero-Section**       | Vollbild-Hintergrundbild + Stats-Bar (Distanz, Etappen, Höhenmeter, Dauer) |
| **Stats-Bar**          | Raster mit 4 Eckdaten, transparent/blur über Bild                          |
| **Stage-Card**         | Karte pro Etappe: Icon, Name, km, hm, Gehzeit, Link                        |
| **Map-Container**      | Leaflet-Karte, responsive Höhe, GPX-Layer                                  |
| **Accommodation-Card** | Unterkunft: Name, Datum, Preis, Check-in, Status-Badge                     |
| **Quick-Links**        | 2×2 Icon-Link-Raster für Schnellzugriffe                                   |
| **Download-List**      | Liste mit Datei-Icon, Name, Dateityp und Download-Button                   |
| **Participant-List**   | Avatar-Initialen + Name, 2-spaltig                                         |

---

## 4. JavaScript-Konzept

JavaScript wird minimal und progressiv eingesetzt. Keine Abhängigkeiten außer Leaflet und dem GPX-Plugin.

### `nav.js`

- Hamburger-Menü: Toggle-Klasse `.nav-open` auf `<body>`
- Active-Link-Highlighting: Vergleich `window.location.pathname` mit `href`
- Keine weiteren Abhängigkeiten

### `map.js` (Übersichtskarte)

- Initialisiert eine Leaflet-Karte auf `etappen.html` und `index.html`
- Lädt alle 6 GPX-Tracks sequentiell via `leaflet-gpx`-Plugin
- Fittet die Karte automatisch auf den Bounding-Box der Gesamtroute
- Jede Etappe bekommt eine eigene Farbe (Array von Hex-Werten)

### `stage-map.js` (Etappenkarte)

- Initialisiert Leaflet auf der jeweiligen Etappenseite
- Lädt den etappenspezifischen GPX-Track
- Zeigt Start- und Zielmarker
- GPX-Dateiname wird aus `data-gpx`-Attribut des Map-Containers gelesen

### Datenfluss GPX

```
Datei: site/assets/gpx/etappe-N.gpx
  → fetch() via leaflet-gpx Plugin (kein eigenes fetch nötig)
  → Leaflet rendert Polyline + Waypoints
  → Optional: Höhenprofil aus Track-Punkten berechnen
```

### Keine weiteren JS-Abhängigkeiten

Alle anderen Inhalte (Tabellen, Karten, Listen) sind statisches HTML. Kein Datenladen aus APIs.

---

## 5. CSS-Struktur

### `tokens.css` – Design-Tokens

```css
:root {
    /* Tier 1: Farb-Palette */
    --color-forest-900: #1a2e24;
    --color-forest-700: #2d4c3b;
    --color-forest-500: #3e624d;
    --color-forest-100: #e8f0eb;
    --color-sand-50: #fcfaf7;
    --color-slate-900: #121412;

    /* Tier 2: Semantische Farben */
    --color-brand-primary: var(--color-forest-700);
    --color-brand-hover: var(--color-forest-500);
    --color-surface-page: var(--color-sand-50);
    --color-surface-card: #ffffff;
    --color-surface-dark: var(--color-slate-900);
    --color-text-primary: #1a1a1a;
    --color-text-muted: #64748b;
    --color-text-inverse: #ffffff;
    --color-border-subtle: rgba(45, 76, 59, 0.12);
    --color-status-paid: #16a34a;
    --color-status-pending: #d97706;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;

    /* Typografie */
    --font-family-base: "Inter", system-ui, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;
    --font-size-hero: clamp(2.5rem, 8vw, 5rem);

    /* Border-Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-full: 9999px;

    /* Schatten */
    --shadow-card:
        0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.06);
    --shadow-map: 0 4px 20px rgba(0, 0, 0, 0.12);
}
```

### `base.css`

- CSS-Reset (box-sizing, margins)
- Typografie: `Inter` von Google Fonts (300–800)
- `body`: Hintergrund, Farbe, Schrift
- Links, Headings, Listen-Reset

### `layout.css`

- `.container`: `max-width: 1280px; margin-inline: auto; padding-inline: 1rem`
- `.container--narrow`: `max-width: 900px`
- Header: `position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px)`
- Footer: Dunkler Hintergrund, 4-spaltig (Desktop), 1-spaltig (Mobile)
- `.page-hero`: Vollbild-Section mit Overlay
- `.stats-bar`: 4er-Grid, transparent, blur
- `.page-content`: Abstand oben/unten, max-width

### `components.css`

- `.card`: Weiße Karte, Schatten, Border, Border-Radius
- `.stage-card`: Etappen-Karte mit farbigem Icon
- `.btn`, `.btn--primary`, `.btn--ghost`: Button-Varianten
- `.badge`: Status-Badges (bezahlt, ausstehend)
- `.map-container`: Feste Höhe, border-radius, overflow hidden
- `.nav__menu`: Desktop horizontal / Mobile vertikal + off-canvas
- `.quick-links`: 2×2 Icon-Link-Grid
- `.download-item`: Flex-Zeile mit Icon, Name, Button
- `.participant-item`: Avatar + Name

### `pages.css`

- Seitenspezifische Überschreibungen und Layout-Anpassungen
- z.B. Hero-Varianten per Klasse `.hero--stage-1` (Hintergrundbild je Etappe)

---

## 6. Kartenlösung

### Empfehlung: Leaflet + leaflet-gpx

**Bibliotheken (CDN, kein Build-Tool):**

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js"></script>
```

**Begründung:**

- Leaflet ist die bewährteste Open-Source-Kartenbibliothek für statische Sites
- Keine API-Keys erforderlich (OpenStreetMap-Tiles sind gratis nutzbar)
- `leaflet-gpx` lädt GPX-Dateien direkt und rendert sie als Polylines
- Sehr gutes Mobile-Verhalten (Touch-Gesten, Pinch-Zoom)
- Kleine Bundle-Größe (~42 KB gzip)

**Tile-Layer:**

```js
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
}).addTo(map);
```

**Alternativ für schönere Karten:** OpenTopoMap (`https://{s}.tile.opentopomap.org/...`) – besonders geeignet für Wanderwege wegen Höhenlinien.

**GPX-Integration:**

```js
new L.GPX("assets/gpx/etappe-1.gpx", {
    async: true,
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null },
})
    .on("loaded", (e) => map.fitBounds(e.target.getBounds()))
    .addTo(map);
```

---

## 7. Responsive Design

### Breakpoints

| Breakpoint       | Breite   | Zielgerät                           |
| ---------------- | -------- | ----------------------------------- |
| Mobile (default) | < 640px  | Smartphone (Hauptnutzung unterwegs) |
| Tablet           | ≥ 640px  | Tablet, großes Smartphone           |
| Desktop          | ≥ 1024px | Laptop, Desktop                     |

Implementiert via CSS Media Queries (kein Framework):

```css
@media (min-width: 640px) {
    /* tablet */
}
@media (min-width: 1024px) {
    /* desktop */
}
```

### Layoutstrategie

- **Mobile First**: Alle Layouts starten als einspaltiger Stack
- Navigation: Hamburger auf Mobile, horizontale Leiste ab 640px
- Karten: `height: 300px` auf Mobile, `height: 500px` ab 640px
- Stats-Bar: 2×2-Grid auf Mobile, 4×1 ab 640px
- Quick-Links: 1-spaltig auf Mobile, 2-spaltig ab 640px
- Etappen-Liste: Cards als Stack (Mobile), Side-by-Side (Desktop)
- Footer: 1-spaltig (Mobile), 4-spaltig (Desktop)
- Schriften: `font-size: clamp()` für responsive Überschriften
- Touch-friendly: Mindest-Klickbereich 44×44px für alle interaktiven Elemente

---

## 8. Deployment

### Option A (empfohlen): GitHub Pages

1. Repository auf GitHub anlegen oder vorhandenes nutzen
2. `site/`-Ordner als Wurzel für GitHub Pages konfigurieren (Branch `main`, Ordner `/site`)
3. Oder: Root des Repos als Quelle, dann `site/` umbenennen nach `/docs` oder alles in Root legen
4. Automatisches Deployment bei jedem Push auf `main`

**Vorteil:** Gratis, HTTPS, Custom-Domain möglich, keine Serverkonfiguration

### Option B: Einfacher Webserver

Jeder statische Webserver (Apache, Nginx, Caddy) kann das `site/`-Verzeichnis direkt ausliefern. Keine serverseitige Konfiguration notwendig – reine Dateiauslieferung.

### Lokale Entwicklung

Da Leaflet die GPX-Dateien via fetch lädt, wird ein lokaler HTTP-Server benötigt (CORS-Restriktionen bei `file://`-Protocol).

```bash
# Empfohlen (Python, überall verfügbar):
python -m http.server 8080 --directory site

# Oder mit npx (falls Node vorhanden):
npx serve site
```

---

## 9. Inhaltsübertragung (Markdown → HTML)

| Quelle                                               | Ziel                            |
| ---------------------------------------------------- | ------------------------------- |
| `docs/malerweg_wanderung_2026.md` → Tourplan-Tabelle | `index.html` + `etappen.html`   |
| Jede Etappe aus dem Markdown                         | `etappe-[n].html`               |
| Unterkunfts-Abschnitt                                | `unterkuenfte.html`             |
| ÖPNV-Abschnitt                                       | `anreise.html`                  |
| Downloads-Abschnitt                                  | `downloads.html`                |
| Navigation-Abschnitt                                 | `navigation.html`               |
| `docs/Seitenstruktur.md`                             | Strukturvorlage für alle Seiten |

Die Inhalte werden **manuell** (Copy & Paste + HTML-Markup) überführt. Kein Markdown-Parser, kein Static-Site-Generator – das ist bewusst einfach gehalten.

---

## 10. Etappen-Datenübersicht

| #   | Strecke                      | km  | hm   | Gehzeit | GPX-Datei      |
| --- | ---------------------------- | --- | ---- | ------- | -------------- |
| 1   | Liebethal → Stadt Wehlen     | 12  | 200  | 3:00    | `etappe-1.gpx` |
| 2   | Stadt Wehlen → Brand-Baude   | 16  | 760  | 5:00    | `etappe-2.gpx` |
| 3   | Brand-Baude → Lichtenhain    | 22  | 850  | 6:30    | `etappe-3.gpx` |
| 4   | Lichtenhain → Reinhardtsdorf | 24  | 1200 | 7:30    | `etappe-4.gpx` |
| 5   | Reinhardtsdorf → Königstein  | 18  | 740  | 5:30    | `etappe-5.gpx` |
| 6   | Königstein → Pirna           | 19  | 600  | 5:30    | `etappe-6.gpx` |

---

## 11. Design-Referenz (Mockup)

Das Mockup (`mockup/code.html`) definiert folgende Designsprache:

- **Primärfarbe:** `#2d4c3b` (Dunkelwald-Grün)
- **Akzentfarbe:** `#3e624d` (Mittelgrün)
- **Hintergrund:** `#fcfaf7` (Warmes Off-White)
- **Schrift:** Inter (Google Fonts, Weights 300–900)
- **Icons:** Google Material Symbols Outlined
- **Stil:** Minimalistisch, viel Weißraum, subtile Borders, Glassmorphism-Header
- **Hero:** Vollbild-Foto mit halbtransparentem Overlay und Stats-Bar am unteren Rand
- **Karten (UI):** Abgerundete Ecken (`border-radius: 0.5rem`), leichter Schatten, Border `primary/10`
- **Buttons:** Primär grün ausgefüllt, Ghost-Variante mit weißem Hintergrund/transparentem Hintergrund

---

## Zusammenfassung: Implementierungsreihenfolge

1. **Projektstruktur anlegen** (`site/`-Ordner, alle Unterordner)
2. **GPX-Dateien kopieren** von `gpx/` nach `site/assets/gpx/`
3. **CSS-Dateien erstellen** (`tokens.css` → `base.css` → `layout.css` → `components.css` → `pages.css`)
4. **Header/Footer HTML-Fragment** definieren (wird in alle Seiten kopiert)
5. **`index.html`** bauen: Hero, Stats, Quick-Links, Tourplan, Übersichtskarte
6. **`etappen.html`** bauen: Gesamtkarte + Etappenliste
7. **6× `etappe-N.html`** aus dem Template befüllen
8. **`unterkuenfte.html`** bauen
9. **Restliche Seiten**: `organisation.html`, `navigation.html`, `anreise.html`, `downloads.html`
10. **JavaScript** einbinden und testen: `nav.js`, `map.js`, `stage-map.js`
11. **Responsive Testing** auf Mobile-Viewports
12. **Deployment** auf GitHub Pages konfigurieren
