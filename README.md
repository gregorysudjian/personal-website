# Gregory Sutjian — personal site

Next.js + TypeScript + Tailwind, animated with GSAP (ScrollTrigger, SplitText) and Lenis.

## Run it on your computer

```
npm install      # first time only
npm run dev      # then open http://localhost:3000
```

The boot animation plays once per browser tab. Open a private window to see it again.

## Change the text

Everything written on the site lives in **`content/site.ts`**, English and French side by side.

- Edit the words between the quotes, save, and the page updates.
- Wrap a word in `*stars*` to make it copper italic: `"Let's build *something*."`
- Don't delete the commas, quotes or brackets around the text.

## Edit or add projects

In `content/site.ts`, find `projects` → `items`. Each project is one `{ ... }` block:

| Field | What it is |
|---|---|
| `kicker`, `title`, `summary` | Small line above the title, the name, and a short description |
| `highlights` | 2–3 short points shown on the card |
| `status` | `"in-progress"`, `"ready"` (deploy-ready) or `"live"` |
| `year`, `role`, `stack` | Shown in the details list |
| `problem`, `solution`, `how` | The "How it's built" panel (use `null` to hide) |
| `preview` | `"chat"` or `"leads"` for the built-in animated demos, otherwise `null` |
| `media` | A picture in `public/projects/`: `{ type: "image", src: "/projects/my-file.webp", alt: { en: "...", fr: "..." } }`. Use `type: "scroll"` for a tall full-page screenshot that scrolls on hover. `src` can be one file, or `{ en: "...", fr: "..." }`. Add `mobile: "/projects/my-file-m.webp"` with a phone-width capture and phones show that one instead (a laptop screenshot is unreadable at phone size). Capture at 2x: laptop versions at an 880px-wide window, phone versions at 390px |
| `links` | `[{ label: { en: "View code", fr: "Voir le code" }, href: "https://github.com/..." }]` |
| `privateRepo` | `true` shows "Private repository" instead of a code link |

## Add your photo

Put it in `public/images/` (e.g. `gregory.jpg`), then in `content/site.ts` set:

```ts
photo: { src: "/images/gregory.jpg", alt: { en: "Portrait of Gregory", fr: "Portrait de Gregory" } },
```

It appears inside the datasheet card in the About section.

## Replace the CV

Overwrite `public/cv/Gregory_Sutjian_CV.pdf` with the new file (same name).

## Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. On vercel.com, sign in with GitHub → **Add New → Project** → pick the repo → **Deploy**.
3. Every time you push a change to GitHub, Vercel updates the site automatically.
4. Domain: Vercel → Project → **Settings → Domains** → add it and follow the DNS instructions.
   Then add an environment variable `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com` and redeploy.
