# Denzel Otto — Website Design & Build Brief

A minimalist, cultural-sector personal website for **Denzel Otto**, showing the latest of his work in two areas: an **art collection** and **essays**. Domain: **denzelotto.com**.

---

## How to use this brief

- **To build the real site → Claude Code** (recommended). Use the whole document. Claude Code can scaffold the Jekyll repo, write the templates and the essay figure-rail logic, set up the image pipeline, generate the Pages CMS config, and deploy to GitHub Pages.
- **To prototype the look first → Claude Design** (optional). Paste only the **Art direction** and **Pages** sections. Claude Design is for locking the visual language (typography, spacing, the reading experience). It does **not** handle the tech stack, build, CMS, or image pipeline — those are Claude Code's job.

---

## Who it's for

Denzel is a student in Kunstwetenschappen at KU Leuven, a beginning art collector, and an essay writer. The site is a calm, gallery-like showcase — restrained, typography-led, and comfortable to read long-form on.

**Day-to-day editor:** Denzel. He is Gen Z, figures out modern interfaces easily, knows basic Markdown, but is *not* a GitHub user. He should never have to touch Git — he edits through the Pages CMS interface.

---

## Art direction

The register of an art-criticism platform: **white background, near-black text, few elements per screen, generous whitespace, thin lines.** Let the artwork provide the only color. References to match the feel: **e-flux.com, smak.be, newyorker.com, vitra.com**.

Two moods coexist:
- **Browsing** (home, collection, essay list) → clean, sparse, gallery-wall.
- **Reading** (essay page) → feels like reading on paper, but on a 100% white background.

### Color & interaction
- Background: **`#FFFFFF`** (pure white).
- Primary text / interactive default: **near-black `#111111`**.
- Hover / active / current state: **mid-gray `#8A8A8A`** — "when you click or hover something, it turns gray." The current/selected nav item stays gray.
- Lines / rules: **1px thin, near-black** hairlines (as in the sketches). Softer light-gray hairlines are an acceptable alternative if pure-black feels too hard.
- No accent colors. Black / white / gray only.

### Typography (hybrid — confirmed)
- **Headings, navigation, UI:** a neutral grotesque. Free options: **Inter** or a Helvetica-style system stack (`"Helvetica Neue", Arial, sans-serif`).
- **Essay body:** a readable serif that feels like paper. Free options: **Newsreader** or **Source Serif 4** (system fallback: Georgia).
- **Self-host** the font files in the repo (faster, no third-party calls, fits the low-dependency ethos).
- Reading settings for essays: comfortable measure (~66 characters), line-height ~1.6, large but calm titles, plenty of margin.

---

## Screen policy — IMPORTANT

The site is **desktop / tablet only**. Below roughly **iPad width (~768px, tunable)** the site must **not render at all**. Instead, show a single full-screen, on-brand message:

- Headline, verbatim: **"This website needs a bigger screen."**
- A subtle secondary line, e.g.: *"Please visit denzelotto.com on a tablet or desktop."*
- Same styling: pure-white background, near-black minimal type, maybe one thin rule. Nothing else. No navigation, no partial site.

---

## Pages

### Home  *(sketch 5)*
Deliberately bare. The name **Denzel Otto** and three links: **Collection**, **Essays**, **About me**. Nothing else. Full-screen, lots of space.

### Collection — overview  *(sketch 2)*
A minimal grid of works (the boxes in the sketch are image placeholders). Newest first. Generous gutters, sparse. Each cell links to that work's detail page. Small scale — no filters, no search.

### Work — detail
The work's image plus metadata: **artist, title, year, medium, dimensions**, and an optional short **personal note** (why he collected it). Caption-style, minimal.

### Essays — overview  *(sketch 4)*
A flat, reverse-chronological list of essays (title + date; optional short dek). No filters, tags, or search. Minimal. Dutch and English essays sit side by side — there is **no language switcher**; each piece is simply in the language it was written in.

### Essay — reading page  *(sketch 3 — the signature layout)*
- **Big title** at the top, with a **thin rule** beneath it.
- **Two-column reading layout:** essay **text on the left**, a **figure rail on the right**.
- **Figures anchor to the paragraph they follow.** The authoring convention: *an image placed after a paragraph in the Markdown is a figure belonging to that paragraph.* It renders in the right rail, **top-aligned with that paragraph**. Paragraphs with no image leave the rail empty at that height.
- Because images are unevenly spaced, the rail is naturally sparse where there are no figures. This produces the intended effect of **figures tracking their text as you scroll** — achieved with **one normal page scroll**, *not* two independently scrolling panes.
- **Figures are auto-numbered** — "fig. 1", "fig. 2", … (matching the sketch labels) — with the image's alt text shown as the caption.
- Body reads like paper: serif, comfortable measure, generous leading.
- *Optional upgrade:* a figure can "stick" in the rail until the next figure scrolls into view (magazine-style). Add only if wanted; the simple version above is the default.

### About me  *(sketch 1)*
Title, body text, and one photo. Minimal.

---

## Content model  *(for Pages CMS + Jekyll collections)*

**Essays** (one Markdown file per essay)
| Field | Type | Notes |
|---|---|---|
| title | text | |
| date | date | drives reverse-chronological order |
| dek | text | optional short standfirst |
| language | select (nl/en) | optional; not shown unless wanted |
| body | markdown | essay text + inline figure images |

**Collection works** (one file per work)
| Field | Type | Notes |
|---|---|---|
| image | image | the work |
| artist | text | |
| title | text | |
| year | text/number | |
| medium | text | |
| dimensions | text | |
| date | date | drives ordering (e.g. acquisition) |
| note | markdown | optional personal note |

**About** — single file: `body` (markdown) + one `photo` (image).

**Home** — static (name + three links); no CMS entry needed.

---

## Tech stack & build  *(Claude Code)*

- **SSG:** Jekyll. **Host:** GitHub Pages.
- **CMS:** **Pages CMS, hosted** (app.pagescms.org). Add a single `.pages.yml` config to the repo defining the collections above; invite Denzel by email so he edits through the web interface without a GitHub account or Git. Every save is a commit; content stays as plain Markdown + front matter in the repo (no lock-in). Images upload through the CMS media manager into an assets folder.
- **Images:** large source files are committed to the repo, but the site must serve **resized, modern-format (`.webp`) versions** (responsive sizes ideal) so pages load fast.
  - **Gotcha:** GitHub Pages' *native* Jekyll build only allows whitelisted plugins and will not run image-processing plugins. So build via a **GitHub Actions workflow** (`bundle exec jekyll build` with the image plugin, then `deploy-pages`) — still free, but it is a CI step. Image optimization can live in that same workflow.
  - **Figure transform** (turning inline Markdown images into numbered right-rail figures): do it **at build time** for no layout flash (a Jekyll plugin/hook), or **client-side JS** is acceptable here since the site is desktop-only.
- **Output style:** clean **semantic HTML + vanilla CSS + minimal JS**; reusable header/footer partials; separate templates for essay / work / about; self-hosted fonts. No heavy framework — keep it portable and low-maintenance.

---

## Notes & open decisions

- The min-screen breakpoint (~768px) is tunable — "smaller than an iPad."
- **UI chrome stays in English** (matches the sketches: "Collection", "Essays", "About me"); essay/work *content* is whatever language each piece was written in.
- The `.webp`/resize requirement means even Jekyll needs a GitHub Actions build (so it isn't truly "zero pipeline"). If that pipeline becomes annoying, **Astro** has image optimization built in (webp/responsive, no plugin-whitelist issue) and also works with Pages CMS — worth reconsidering later, but not a blocker now.
