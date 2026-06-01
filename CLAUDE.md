# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`mandarin-cargo` — SEO-first marketing landing page for an air-cargo service shipping China → Uzbekistan. Statically-exported Next.js 16 App Router site. Default locale Uzbek (`uz`); also `ru`, `cn`, `en`.

A detailed agent reference lives at the repo root: `../AGENTS.md`. Read it for the full directory map and task-to-file table. Notes below cover what matters most and corrects stale info.

## Commands

All commands run from this `app/` directory (the Next project root; repo root is one level up).

```bash
npm run dev      # dev server
npm run build    # static export → app/out/
npm run start    # serve production build (after build)
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

No test suite exists — no `*.test.*` / `*.spec.*` files, no test runner.

## Architecture

- **Static export.** `next.config.ts` sets `output: "export"`, `images.unoptimized: true`, `trailingSlash: true`. Build emits plain HTML to `out/`. Anything requiring a server (dynamic routes, image optimization, runtime API) will not work.
- **i18n via next-intl v4, no middleware.** All i18n lives under `src/i18n/`: `routing.ts` (locales + default), `request.ts` (per-request message loader — the plugin entry pointed to by `next.config.ts`; dynamically imports `src/content/{locale}.ts`), `navigation.ts` (typed `Link`/`usePathname`/`useRouter`). All UI copy lives in the four content files — never hardcode strings in components. For locale-aware links use `Link`/`usePathname` from `@/i18n/navigation`, not Next.js built-ins.
- **Content vs config split.** `src/content/{uz,ru,cn,en}.ts` = translatable copy. `src/config/site.ts` = business constants (phone, URLs, rates, exchange rate). `src/lib/calculator.ts` reads from `site.ts`.
- **Page assembly.** `src/app/[locale]/page.tsx` imports and orders all section components from `src/components/sections/`. Adding a section = new file there + import in this page. `generateMetadata` + `generateStaticParams` here drive per-locale SEO and the static export of each locale.
- **Calculator.** `calculateShipping` is pure client-side math; `calculateShippingApi` POSTs to an external API and falls back to local on error. UI (`Calculator.tsx`, a Client Component) uses the local path.
- **SEO.** JSON-LD builders in `src/lib/structuredData.ts` injected via `dangerouslySetInnerHTML` (self-controlled static data only). `robots.ts` / `sitemap.ts` generate at build time.

## Conventions

- Server Components by default; add `"use client"` only for state/effects/browser APIs (calculator, language switcher, mobile menu).
- Pages taking `params` declare `export const dynamic = "force-static"`.
- Icons: lucide-react only, no emoji icons.
- Color tokens: defined once as CSS vars in `src/app/globals.css`; `tailwind.config.ts` maps them to utility classes (`bg-brand`, `text-muted`, `border-border`, etc.) via `var(--…)`. Add/change a color in `globals.css` only.
- Framer Motion entrance/scroll animations; standard ease `[0.25, 0.46, 0.45, 0.94]`, scroll elements use `whileInView` + `viewport={{ once: true }}`. `prefers-reduced-motion` not yet handled.

## Gotchas

- This is Tailwind **v3** (`tailwind.config.ts`, `3.4.17`). `plan.md` claims v4 — ignore that; it is outdated.
- The Next project is in `app/`, not the repo root. `out/`, `.next/`, build txt artifacts here are generated.
