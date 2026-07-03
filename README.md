# Jatin Lilani — Portfolio

A designed-from-scratch interactive portfolio for an AI/ML Engineer, Data Scientist and Researcher. Dark, editorial, scroll-choreographed — built to feel like a product launch, not a resume page.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — scroll-linked animation, reveals, springs
- **Lenis** — smooth scrolling
- **Hand-rolled canvas** — hero particle field and the skills constellation (no Three.js; keeps the bundle small and Lighthouse happy)

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Make it yours

**All content lives in [`lib/data.ts`](lib/data.ts).** Edit that one file to change:

- `site` — name, roles, email, location, GitHub/LinkedIn URLs
- `manifesto` — the About section story, facts, and principles
- `skillNodes` — the constellation nodes, their positions and connections
- `experience` — the timeline entries
- `projects` — case studies (problem / solution / impact / tech). Each project's visual is generated from its `hue` + `pattern`, so no images are needed — but swap in real screenshots any time
- `publications` — research papers, abstracts, metrics, BibTeX

**Replace `public/resume.pdf`** with your real resume (the current file is a generated placeholder).

## Features

- Cinematic preloader (once per session), custom morphing cursor with contextual labels, magnetic buttons
- Mouse-reactive hero particle field with connection lines
- Scroll-read About statement (words brighten as you read)
- Interactive neural-constellation skills graph with traveling signal pulses
- Keynote-style depth timeline, perspective-tilting project panels with scroll mask reveals
- Journal-style research section with copy-to-clipboard BibTeX citations
- Scroll-progress favicon, glass floating nav that hides on scroll down
- Full `prefers-reduced-motion` support, keyboard accessible, semantic HTML, JSON-LD

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config needed.
