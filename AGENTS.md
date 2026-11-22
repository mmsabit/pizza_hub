# AGENTS.md

PizzaHub — Next.js 16 App Router storefront plus role dashboards (`user` / `vendor` / `admin`). This repo is the **frontend only**: menus, orders, search and payment verification come from a separate REST API at `NEXT_PUBLIC_API_URL`. MongoDB is used only for better-auth accounts and Premium flags.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — production build; also runs the TypeScript check
- `npm run start -- --port 3123` — serve an existing build
- `npm run lint` — bare `eslint` (ESLint 9 flat config), not `next lint`
- `npx next typegen` — generate route types before typechecking
- `npx tsc --noEmit` — fails with `Cannot find name 'LayoutProps'` until `next typegen` (or one dev/build pass) has run
- Working verification order: `npx next typegen` → `npx tsc --noEmit` → `npm run lint` → `npm run build`

No test runner, CI workflow or formatter config. `README.md` is the untouched create-next-app template (Geist fonts, `app/page.tsx`) — trust the code, not it.

## Backend boundary

- Menu/order/search calls hit `${process.env.NEXT_PUBLIC_API_URL}`: `/menu`, `/menu/:id`, `/menus`, `/menus/:vendorId`, `/menus/search`, `/adminmenu`, `/order`, `/vendor_order/:id`, `/customer_order/:id`, `/available-menu`, `/payment`, `/vendor`, `/user`, `/vendor-data/:id`, `/payments/checkout-verify`. Those routes do not exist in this repo.
- Server pages fetch with `cache: "no-store"`; client components read `NEXT_PUBLIC_API_URL` directly. There is no local data layer for menus or orders.
- Mongo (`DB_URI`, database hardcoded `pizza_hub`) is touched only by `src/lib/auth.ts` and `src/lib/plan.ts` (`user` collection). Don't add menu/order collections here.
- Local API routes: `src/app/api/auth/[...all]/route.ts` (better-auth), `api/upload` (ImgBB proxy), `api/checkout_sessions` (Stripe).
- If list pages look empty, check `NEXT_PUBLIC_API_URL` and backend health first: most list pages catch fetch errors and render empty states, though a few (e.g. vendor menu) let the fetch fail.
- Shared API shapes live in `src/app/type/type.ts` (`PizzaType`, `OrderType`, `OrderStateType`), not `src/types`.

## Environment

`.env` is gitignored and there is no `.env.example`. Expected keys: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (`http://localhost:3000`), `DB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API`, `NEXT_PUBLIC_API_URL`, `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`. (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set but unused, and nothing imports `@stripe/stripe-js` — checkout redirects to a server-created session URL.)

## Routes and guards

`src/app/layout.tsx` owns only `<html>`/`<body>`, fonts and metadata. Each area adds its own chrome:

- `src/app/(site)/` — storefront. `layout.tsx` adds `SiteHeader` + `SiteFooter`; `page.tsx` owns `/`. `/menu` is `force-dynamic`; `/menu/[menuid]` is public and swaps actions by role (owner vendor: edit/delete, admin: delete/status, signed-in customer: order form).
- `src/app/(auth)/` — `/sign-in`, `/sign-up`. Standalone dark shell, no site header/footer.
- `src/app/(dashboard)/` — role-gated areas. `user/` (`/user/dashboard`, `/user/dashboard/order`, `/user/dashboard/order/[slug]`, `/user/profile`), `vendor/` (`/vendor/dashboard`, `menu`, `order`, `order/[slug]`, `plan`, `invoice/success`, `/vendor/profile`), `admin/` (`/admin/dashboard`, `menu`, `order`, `order/[slug]`, `payment`, `user`, `vendor`, `profile`). Each area's `layout.tsx` wraps `DashboardRoleLayout`, which reads the session, redirects signed-out visitors to `/sign-in`, and redirects a mismatched role to `homeForRole()`. There is no `/dashboard` route — don't add one.
- Put new pages inside one of these groups. Do **not** create `src/app/page.tsx` — `/` is owned by `(site)` and a second root page is a route conflict.

## Auth, roles, Premium

- `src/lib/roles.ts` is the source of truth: `normalizeRole`, `roleLabel`, `homeForRole`. Unknown/missing roles normalize to `user` to avoid redirect loops.
- `src/lib/auth.ts`: better-auth + Mongo adapter. `role` is client-writable so sign-up can send user/vendor, but `databaseHooks.user.create.before` maps anything that is not `vendor` to `user` (admin signups are downgraded). Never remove that hook without a server-side check.
- `premium` is `input: false` (server-written); `isPremiumActive()` checks this flag.
- `user.changeEmail` is enabled with `updateEmailWithoutVerification: true` because no transactional email sender exists. Email/password accounts (`emailVerified === false`) update immediately; verified accounts (e.g. Google) still fail with "Verification email isn't enabled". `updateUser` itself always rejects `email`.
- Guards live in the dashboard layouts, not middleware.
- `auth-client.ts` reads server-only `BETTER_AUTH_URL`, so it is `undefined` in the browser and better-auth falls back to the current origin. Don't hardcode it.
- Google OAuth uses `callbackURL: "/"`, so social sign-ins land on the storefront, not a dashboard.
- Stripe flow: `POST /api/checkout_sessions` creates a `mode: "subscription"` Checkout Session (the price must be recurring) → Stripe redirects to `/vendor/dashboard/invoice/success?session_id=...` → that page retrieves the session, calls the backend's `checkoutVerify`, and calls `activatePremium` only when `session.client_reference_id === authSession.user.id`. There is no webhook or cancellation endpoint in this repo.

## Data and status conventions

- Menu `status` is lowercase `pending | approved | rejected`; order `order_status` is uppercase `PENDING | CONFIRMED | PREPARING | READY | OUT_FOR_DELIVERY | DELIVERED | CANCELLED`. Don't normalize one into the other.
- New vendor dishes POST with `status: "pending"`; admin approves/rejects via `PATCH /adminmenu/:id`. Admin can mark at most 3 items featured — enforced in the UI only.
- Order "placed at" is derived from the MongoDB ObjectId prefix (`orderTimestamp` in `user/dashboard/order/_comp/order-ui.ts`), not a stored timestamp.
- Currency is inconsistent by design: storefront/orders use BDT (`৳`), vendor/admin menu tables and the Premium plan still use `$`. Change both sides together or not at all.
- The public `/menu` page renders whatever `/menu` returns and shows non-approved items with a status badge rather than hiding them; the homepage uses `/available-menu` for featured dishes.
- Vendor order detail refuses tickets whose `order.vendor.id` differs from the signed-in user; admin order detail is read-only.
- Several modals rely on fixed DOM ids (`editModal`, `deleteModal`, `orderModal`), so render one instance per page.

## Styling

- Tailwind v4 CSS-first: no `tailwind.config.*`. Tokens live in the `@theme` block of `src/app/globals.css`; add/change them there.
- daisyUI 5 is loaded via `@plugin "daisyui"` with a customized `light` theme (`<html data-theme="light">`). daisyUI classes (`btn`, `modal`, `modal-box`, `checkbox`) coexist with the brand token utilities — both are legitimate.
- Brand tokens are deliberately non-standard: `dough-canvas`, `dough-surface`, `charcoal-dark`, `crust-gold`, `basil-fresh`, `primary-container`, `surface-container-*`, `on-surface-variant`. Don't swap them for default palette classes.
- Custom spacing makes `px-margin`, `gap-space-md`, `py-space-lg` real utilities (`space-xs`=4px … `space-xl`=40px, `margin`=32px). Type utilities (`text-headline-lg`, `text-label-sm`, …) bake in family, size, line height and weight.
- The base layer hides scrollbars app-wide (`::-webkit-scrollbar { display: none }`) — intentional.
- Fonts are Epilogue (headlines) + Plus Jakarta Sans (body), wired as `--font-epilogue` / `--font-jakarta` in `src/app/layout.tsx`.
- `next.config.ts` registers `@tailwindcss/turbopack` as a CSS loader and enables the React Compiler; keep both.

## Images, icons, uploads

- Every image goes through `next/image`. Bundled assets are in `public/images/` (`hero-pizza.jpg`, `oven.jpg`, `avatar.jpg`, `placeholder.png`, `menu-*.jpg`).
- `next.config.ts` accepts any remote host (`hostname: "**"`, http + https) because avatars and menu images come from arbitrary CDNs. Don't remove it.
- User/menu image uploads go through `POST /api/upload`, which proxies ImgBB (`IMGBB_API`, 32 MB limit) and returns `{ imageUrl }`. The browser never talks to ImgBB directly.
- `fill` needs a positioned, sized parent plus `sizes`.
- Icons are `lucide-react` only; feature lists hold component references (`icon: Flame` → `<item.icon size={20} />`), not icon-name strings.

## Conventions and gotchas

- `ToastContainer` is mounted in `src/app/layout.tsx`; `(site)`, `(auth)` and `(vendor)` layouts add duplicates. Toasts work everywhere — don't add another container.
- Components live in feature folders under `src/components/`: `layout/`, `marketing/` (`*-section.tsx`), `auth/`, `dashboard/` (`vendormenu/`, `adminmenu/`, `vendorplan/`, `adminaccounts/`, `profile/`). PascalCase exports, `@/` alias → `src/`.
- Dashboard overview pages (`user`, `vendor`, `admin` `dashboard/page.tsx`) use hardcoded stats/demo rows. Orders and menu pages fetch the real backend — don't assume a dashboard number is live.
- The three profile pages (`/user/profile`, `/vendor/profile`, `/admin/dashboard/profile`) share `ProfileScreen` in `src/components/dashboard/profile/`; the vendor variant also gets a plan card. Update the shared component, not each page.
- Several user nav entries are `"#"` placeholders (addresses, rewards, settings).
- `BETTER_AUTH_URL` is pinned to `http://localhost:3000`, so sign-up/sign-in POSTs need `Origin: http://localhost:3000` even when the app is served on another port.
- In headless-browser checks, scope form selectors to `[role="dialog"]`: `document.querySelector('[name="description"]')` matches Next's `<meta name="description">` in `<head>`, not the modal textarea.
