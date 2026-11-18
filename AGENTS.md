# AGENTS.md

PizzaHub — Next.js 16 App Router storefront + account dashboard, originally ported from a single Tailwind-CDN HTML page. Styling now comes from Tailwind v4 theme tokens in CSS.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build; also runs the TypeScript check
- `npm run start -- --port 3123` — serve an existing build
- `npm run lint` — ESLint 9 flat config (the script is bare `eslint`, not `next lint`)
- `npx tsc --noEmit` — needs generated route types first. Layouts use the global `LayoutProps<...>` helper, so on a fresh clone this fails with `Cannot find name 'LayoutProps'`. Run `npx next typegen` (or one dev/build pass) before it.
- Verification order that works here: `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

There is no test runner, no CI workflow, and no formatter config. `README.md` is the untouched create-next-app template (points at `app/page.tsx` and Geist fonts) — trust the code, not it.

## Routes are split by route group

`src/app/layout.tsx` owns only `<html>`/`<body>`, fonts and metadata. Each area adds its own chrome:

- `src/app/(site)/` — storefront. `layout.tsx` adds `SiteHeader` + `SiteFooter`; `page.tsx` composes the marketing sections and owns `/`.
- `src/app/(auth)/` — `/sign-in`, `/sign-up`. Standalone dark shell, no site header/footer.
- `src/app/(dashboard)/` — `/dashboard`. Sidebar + topbar shell (`dashboard-sidebar.tsx`, `dashboard-topbar.tsx`).
- `src/app/api/auth/[...all]/route.ts` — better-auth handler.

Put new pages inside one of these groups (e.g. `(site)/menu/page.tsx`). Do **not** create `src/app/page.tsx` — `/` is owned by `(site)` and a second root page is a route conflict.

## Styling

- Tailwind v4, CSS-first: there is no `tailwind.config.*`. All tokens live in the `@theme` block of `src/app/globals.css` — add or change tokens there.
- Brand tokens are deliberately non-standard: `dough-canvas`, `dough-surface`, `charcoal-dark`, `crust-gold`, `basil-fresh`, `primary-container`, `surface-container-*`, `on-surface-variant`. Don't swap them for default palette classes.
- Custom spacing means `px-margin`, `gap-space-md`, `py-space-lg` are real utilities (`space-xs`=4px … `space-xl`=40px, `margin`=32px). Don't "correct" them to standard Tailwind values.
- Type utilities such as `text-headline-lg` / `text-label-sm` come from the same type scale and bake in font family, size, line height and weight.
- The base layer in `globals.css` hides scrollbars app-wide (`::-webkit-scrollbar { display: none }`) — missing scrollbars are intentional.
- `next.config.ts` registers `@tailwindcss/turbopack` as a CSS loader and enables the React Compiler; keep both in place.

## Images and icons

- Every image goes through `next/image`, from local files in `public/images/` (`hero-pizza.jpg`, `oven.jpg`, `avatar.jpg`, `menu-*.jpg`). There is no `images.remotePatterns`, so remote URLs fail — download assets locally instead.
- `fill` needs a positioned, sized parent (`relative h-*` or an aspect ratio), plus `sizes`.
- Icons are `lucide-react` only. The Material Symbols font was removed — do not reintroduce `material-symbols-outlined` spans or icon-font `<link>` tags.
- Lists of features hold component references (`icon: Flame`, rendered as `<item.icon size={20} />`) rather than icon-name strings; keep that pattern.

## Auth is only half wired (better-auth)

- `src/lib/auth.ts` builds the better-auth instance (MongoDB adapter, DB name hardcoded as `pizza_hub`, `emailAndPassword` enabled). `src/lib/auth-client.ts` is the React client.
- `.env` (gitignored via `.env*`) supplies `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (`http://localhost:3000`) and `DB_URI`.
- The UI does not use it yet: `sign-in-form.tsx`, `sign-up-form.tsx` and `google-auth-button.tsx` only display "Demo only" notices, and `socialProviders` in `auth.ts` is empty, so the Google buttons do nothing. Treat this as unfinished work, not a broken feature.
- `auth-client.ts` reads `process.env.BETTER_AUTH_URL`, which Next does not expose to the browser (server-only var). When wiring it up, either drop `baseURL` (better-auth defaults to the current origin) or move to a `NEXT_PUBLIC_*` variable.

## Conventions

- Package/project name `pizza_hub`; user-facing brand "PizzaHub".
- Components are flat in `src/components/`, marketing sections named `*-section.tsx`, PascalCase exports, `@/` alias → `src/`.
- Page copy, order rows and dashboard stats are hardcoded in the components; there is no data layer or DB read behind them.
