# AGENTS.md

PizzaHub — Next.js 16 App Router storefront + role-based dashboards (`user` / `vendor` / `admin`), originally ported from a single Tailwind-CDN HTML page. Styling now comes from Tailwind v4 theme tokens in CSS.

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
- `src/app/(dashboard)/` — role-gated dashboard areas. `user/` (`/user/dashboard`) is the customer area, `vendor/` (`/vendor/dashboard`, `/vendor/dashboard/menu`) the vendor area, `admin/` (`/admin/dashboard`, `/admin/dashboard/menu`) the admin area. Each area's `layout.tsx` wraps `DashboardRoleLayout` from `src/components/dashboard-role-layout.tsx`, which reads the session, redirects signed-out visitors to `/sign-in`, and redirects a mismatched role to `homeForRole()`. There is no `/dashboard` route — don't add one.
- `src/app/api/auth/[...all]/route.ts` — better-auth handler.

Put new pages inside one of these groups (e.g. `(site)/menu/page.tsx`). Do **not** create `src/app/page.tsx` — `/` is owned by `(site)` and a second root page is a route conflict.

## Menu form is intentionally frontend-only

- `menu-manager.tsx` renders a hardcoded demo table (`ITEMS`) — no fetch, no persistence. Save, delete and edit were deliberately removed; don't reintroduce them without an explicit request.
- `MenuFormModal` collects name, category, price, description, image file, availability and hidden status/vendor fields, logs the selected file metadata and `Menu form data`, then closes. There is no upload or persistence — a selected image is only logged (`image` stays `null`).
- Categories are canonical in `MENU_CATEGORIES` (`src/lib/menu.ts`). The form takes price in BDT (`৳`); the demo table still formats `$`.

## Styling

- Tailwind v4, CSS-first: there is no `tailwind.config.*`. All tokens live in the `@theme` block of `src/app/globals.css` — add or change tokens there.
- Brand tokens are deliberately non-standard: `dough-canvas`, `dough-surface`, `charcoal-dark`, `crust-gold`, `basil-fresh`, `primary-container`, `surface-container-*`, `on-surface-variant`. Don't swap them for default palette classes.
- Custom spacing means `px-margin`, `gap-space-md`, `py-space-lg` are real utilities (`space-xs`=4px … `space-xl`=40px, `margin`=32px). Don't "correct" them to standard Tailwind values.
- Type utilities such as `text-headline-lg` / `text-label-sm` come from the same type scale and bake in font family, size, line height and weight.
- The base layer in `globals.css` hides scrollbars app-wide (`::-webkit-scrollbar { display: none }`) — missing scrollbars are intentional.
- `next.config.ts` registers `@tailwindcss/turbopack` as a CSS loader and enables the React Compiler; keep both in place.

## Images and icons

- Every image goes through `next/image`. Bundled assets live in `public/images/` (`hero-pizza.jpg`, `oven.jpg`, `avatar.jpg`, `placeholder.png`, `menu-*.jpg`).
- `next.config.ts` sets `images.remotePatterns` to `hostname: "**"` for both `http` and `https`, so any remote URL (e.g. a user's avatar CDN) is accepted by the optimizer. Don't remove it — signed-in avatars come from arbitrary external hosts.
- `fill` needs a positioned, sized parent (`relative h-*` or an aspect ratio), plus `sizes`.
- Icons are `lucide-react` only. The Material Symbols font was removed — do not reintroduce `material-symbols-outlined` spans or icon-font `<link>` tags.
- Lists of features hold component references (`icon: Flame`, rendered as `<item.icon size={20} />`) rather than icon-name strings; keep that pattern.

## Auth and roles (better-auth)

- `src/lib/auth.ts` builds the better-auth instance (MongoDB adapter, DB name hardcoded as `pizza_hub`, `emailAndPassword` enabled). `src/lib/auth-client.ts` is the React client.
- `.env` (gitignored via `.env*`) supplies `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (`http://localhost:3000`), `DB_URI` and the Google OAuth credentials used by `socialProviders.google`.
- `src/lib/roles.ts` is the single source of truth for `user | vendor | admin`: `normalizeRole`, `roleLabel` and `homeForRole`. The better-auth `user.additionalFields.role` field is client-writable (`input: true`) so the sign-up radio choice persists, but `databaseHooks.user.create.before` downgrades any `admin` signup to `user` — never remove that hook without a server-side check.
- Guards live in the server layouts, not middleware: `DashboardRoleLayout` calls `auth.api.getSession({ headers: await headers() })` and `redirect()`s. Missing/unknown roles normalize to `user` to avoid redirect loops.
- The sidebar/nav (`dashboard-nav.tsx`) is keyed by role via `NAV_BY_ROLE`, and sign-in/sign-up/header links land on `homeForRole()`.
- `auth-client.ts` reads `process.env.BETTER_AUTH_URL`, which Next does not expose to the browser (server-only var); the value is `undefined` client-side, so better-auth falls back to the current origin. Moving to a `NEXT_PUBLIC_*` variable would make it explicit.
- Google sign-in uses `callbackURL: "/"` from `google-auth-button.tsx`, so OAuth accounts always land on the storefront rather than a role dashboard.
- Auth feedback uses `react-toastify`; the only `ToastContainer` is mounted in `(auth)/layout.tsx`, so toasts elsewhere need their own container.

## Verification gotchas

- `BETTER_AUTH_URL` is pinned to `http://localhost:3000`, so sign-up/sign-in POSTs need `Origin: http://localhost:3000` even when the app is served on another port.
- In headless-browser checks, scope form selectors to `[role="dialog"]`: `document.querySelector('[name="description"]')` matches Next's `<meta name="description">` in `<head>`, not the modal textarea.

## Conventions

- Package/project name `pizza_hub`; user-facing brand "PizzaHub".
- Components are flat in `src/components/`, marketing sections named `*-section.tsx`, PascalCase exports, `@/` alias → `src/`.
- Page copy, order rows and dashboard stats are hardcoded in the components; there is no data layer or DB read behind them.
