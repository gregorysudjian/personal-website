# Section inventory

A single-page portfolio (Next.js 16 App Router), rendered statically in two locales.
It has no auth, no forms, no light theme and no data fetching, so the "logged in",
"light theme", "loading/empty/50 items" axes don't apply. The substitute stress axes:
**FR locale** (the longest real strings), **prefers-reduced-motion** (a fully different
static layout for Focus/Hero/Statement), **touch vs fine pointer**, and **short screens**.

## Routes
| Route | What |
|---|---|
| `/` | 307 → `/en` or `/fr` from Accept-Language (proxy.ts) |
| `/en`, `/fr` | The page |
| `/<anything else>` | Next 404 (dynamicParams = false) |
| `/en/opengraph-image`, `/fr/opengraph-image` | Generated share image |
| `/robots.txt`, `/sitemap.xml` | Metadata |
| `/cv/Gregory_Sutjian_CV.pdf` | CV download |

## Sections (in page order) — id used in shots/ and issues.json
| id | Selector | Parts / states |
|---|---|---|
| `global` | html/body | skip link (focus), boot overlay (first visit), custom cursor (fine pointer), scroll progress meter (lg+), grain, 404 page |
| `nav` | `header` + `#mobile-menu` | desktop links, EN/FR switch, hide-on-scroll-down, mobile Menu button, **mobile menu drawer** (open, focus, Esc) |
| `hero` | `#top` | intro animation, name gate scroll, CTAs (View projects, Download CV), status, scroll hint, short/landscape variant |
| `statement` | `main > section:nth-of-type(2)` | pinned sentence lighting word by word |
| `about` | `#about` | datasheet card (photo, tilt), paragraphs, facts list |
| `focus` | `#focus` | horizontal pinned panels (big screens) **or** stacked list (phones, short windows, reduced motion); compact mode |
| `projects` | `#projects` | 4 cards: Lead Finder (slides ×3, scroll slide), WhatsApp (chat demo), Clarté (slides ×2), This website (image); **"How it's built" accordion**; slide tabs; links; private-repo note |
| `experience` | `#experience` | Work (4 rows), Education (2 rows), power-on rows |
| `skills` | `#skills` | marquee band, 3 chip groups |
| `contact` | `#contact` | board, chip box, email link, **Copy** (idle/copied), CV + socials buttons |
| `footer` | `footer` | ©, made in, live clock, back to top, big outline name |

## Viewports
375×667, 390×844, 768×1024 (touch), 1440×900, 1920×1080 (+ 844×390 landscape phone and 1280×620 short laptop as stress checks).
