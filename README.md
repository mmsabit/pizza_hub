# PizzaHub

PizzaHub is a wood-fired pizza ordering platform with a public storefront, a customer account area, and dedicated vendor and admin dashboards.

> **Scope of this repository:** this repo is the **frontend only**. It is a Next.js App Router application. Menus, orders, vendors and payment verification come from a separate PizzaHub REST API. MongoDB is used here only for authentication accounts and the Premium flag.

---

## 1. Project Name

**PizzaHub** — package name `pizza_hub`.

---

## 2. Project Description

PizzaHub lets customers browse a pizza menu, place an order, and follow it from the kitchen to delivery. Vendors manage their own dishes and incoming tickets, and admins review the whole platform.

### Main features

- **Public storefront** — landing page with featured dishes, specialities, testimonials and calls to action.
- **Menu catalogue** — browse approved dishes, search menus, and open a dish detail page with pricing, availability, vendor details and ordering controls.
- **Authentication** — email/password and Google sign-in through better-auth, with role-aware redirects.
- **Customer dashboard** — order totals and history, live status tracking, order detail pages, cancellation, and a shared profile screen.
- **Vendor dashboard** — menu management (create, edit, delete, availability, featured dishes), incoming kitchen tickets, accept/prepare/ready/deliver status updates, a Premium plan page, and the vendor profile.
- **Admin dashboard** — platform totals, menu approval/rejection, all orders, payment history, and account lists for users and vendors.
- **Premium subscription** — Stripe Checkout subscription flow for vendors, verified on the success page before the Premium flag is activated.
- **Image uploads** — profile and dish images are uploaded through a server-side ImgBB proxy.
- **UI/UX** — responsive layouts, Tailwind CSS v4 + daisyUI 5, light/dark theme, toast notifications, loading state, and custom 404 pages.

### Roles

| Role | Entry point | What they can do |
| --- | --- | --- |
| `user` | `/user/dashboard` | Browse and order, track/cancel orders, edit profile |
| `vendor` | `/vendor/dashboard` | Manage menu and orders, buy Premium, edit store profile |
| `admin` | `/admin/dashboard` | Approve menus, view all orders/payments/users/vendors |

### How it fits together

```text
Browser
  │
  ▼
Next.js frontend (this repo, :3000)
  ├── better-auth  ──────────────►  MongoDB (accounts + premium flag)
  ├── PizzaHub REST API ─────────►  Express + MongoDB backend (:8000)
  ├── /api/upload ───────────────►  ImgBB
  └── /api/checkout_sessions ────►  Stripe Checkout
```

---

## 3. Technology, Packages and Libraries

### Core framework

| Technology | Version | Purpose |
| --- | --- | --- |
| [Next.js](https://nextjs.org) | 16.4.6 | App Router, server components, route handlers, image optimisation |
| [React](https://react.dev) | 19.3.0 | UI runtime |
| [TypeScript](https://www.typescriptlang.org) | ^5 | Type safety |
| Turbopack | bundled with Next.js | Dev/build bundler |
| React Compiler | `babel-plugin-react-compiler` 1.0.0 | Automatic memoisation (`reactCompiler: true`) |

### Styling and UI

| Package | Version | Purpose |
| --- | --- | --- |
| [Tailwind CSS](https://tailwindcss.com) | ^4.3.3 | CSS-first styling (`@theme` tokens in `src/app/globals.css`) |
| `@tailwindcss/postcss` | ^4.3.5 | PostCSS integration |
| `@tailwindcss/turbopack` | 4.3.3 | Turbopack CSS loader |
| [daisyUI](https://daisyui.com) | 5.8.1 | Component classes and light/dark themes |
| [lucide-react](https://lucide.dev) | 1.74.0 | Icon set |
| [react-toastify](https://fkhadra.github.io/react-toastify) | 11.2.0 | Toast notifications |
| [Flatpickr](https://flatpickr.js.org) / `react-flatpickr` | 4.6.13 / 4.0.11 | Delivery-date picker |
| Google Fonts via `next/font` | — | Epilogue (headlines) + Plus Jakarta Sans (body) |

### Authentication and data

| Package | Version | Purpose |
| --- | --- | --- |
| [better-auth](https://www.better-auth.com) | 1.7.25 | Email/password, Google OAuth, sessions, JWT plugin |
| `@better-auth/mongo-adapter` | 1.7.25 | Stores auth users/sessions in MongoDB |
| [mongodb](https://www.mongodb.com/docs/drivers/node) | 7.9.0 | Mongo client for auth and Premium flags |

### Payments and external services

| Package / service | Version | Purpose |
| --- | --- | --- |
| [Stripe Node SDK](https://github.com/stripe/stripe-node) | 23.2.0 | Server-created subscription Checkout Sessions |
| ImgBB API | — | Hosts uploaded profile/menu images |
| Google OAuth | — | Social sign-in |

### Tooling

| Package | Version | Purpose |
| --- | --- | --- |
| ESLint | ^9 | Linting (`npm run lint`, flat config) |
| `eslint-config-next` | 16.4.6 | Next.js lint rules |
| `@types/node`, `@types/react`, `@types/react-dom` | — | TypeScript types |

> `motion` (14.14.0) and `@stripe/stripe-js` (10.3.0) are present in `package.json` but are not currently imported anywhere. Checkout redirects to a server-created Stripe URL, so the browser Stripe SDK is not needed.

---

## 4. Where We get the API?

The API comes from **three places**:

### A. PizzaHub REST API (main data source)

This is a **separate backend project**, `pizzahub_server/`, built with **Express 5 + MongoDB 7 + Stripe + jose**. It is not included in this repository and must be running separately.

- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Local default: `http://localhost:8000`
- Authentication: better-auth issues a JWT; requests send `Authorization: Bearer <token>`. The backend verifies that token against the frontend's JWKS endpoint (`${CLIENT_URL}/api/auth/jwks`), so the backend needs `CLIENT_URL=http://localhost:3000`.

Endpoints used by this frontend:

| Area | Endpoints |
| --- | --- |
| Menu | `GET /menu`, `GET /menu/:id`, `GET /available-menu`, `GET /featured_menu`, `GET /menus/search`, `GET /menus/:vendorId`, `POST /menus`, `PATCH /menu/:id`, `DELETE /menu/:id` |
| Admin menu | `GET /adminmenu`, `PATCH /adminmenu/:id` |
| Orders | `POST /order`, `GET /order`, `GET /order/:id`, `PATCH /order/:id`, `GET /customer_order/:userId`, `GET /vendor_order/:vendorId` |
| Accounts | `GET /user`, `GET /vendor`, `GET /vendor-data/:id` |
| Payments | `GET /payment`, `POST /payments/checkout-verify` |

### B. Local Next.js route handlers

These live in this repo under `src/app/api/`:

| Route | Purpose |
| --- | --- |
| `POST/GET /api/auth/[...all]` | better-auth endpoints (sign-in, sign-up, session, JWKS, etc.) |
| `POST /api/upload` | Validates an image and proxies it to ImgBB; returns `{ imageUrl }` |
| `POST /api/checkout_sessions` | Creates a Stripe subscription Checkout Session for Premium |

### C. Third-party APIs called from the server

- **ImgBB** — `https://api.imgbb.com/1/upload` via `/api/upload` (`IMGBB_API`).
- **Stripe** — Checkout Sessions via the Stripe Node SDK (`STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`).
- **Google OAuth** — sign-in provider (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

There is **no local data layer for menus or orders**; those collections belong to the backend. MongoDB in this repo is only the better-auth database (`pizza_hub`), plus the `user.premium` flag.

---

## 5. How to Setup this project locally

### Prerequisites

- **Node.js 20.9+** (22 LTS recommended) and npm
- **MongoDB** database (Atlas or local) for authentication
- The **PizzaHub backend** (`pizzahub_server`) running on port `8000`
- Optional accounts/keys:
  - Google OAuth app
  - ImgBB API key
  - Stripe test account with a **recurring** Premium price

### Step 1 — Clone and install

```bash
git clone <your-repository-url> pizza_hub
cd pizza_hub
npm install
```

### Step 2 — Create the frontend `.env`

Create a `.env` file in the project root (there is no `.env.example`):

```env
# better-auth
BETTER_AUTH_SECRET=replace-with-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (database: pizza_hub)
DB_URI=mongodb+srv://<user>:<password>@<cluster>/pizza_hub

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ImgBB (image uploads)
IMGBB_API=your-imgbb-api-key

# PizzaHub backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe Premium subscription
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PREMIUM_PRICE_ID=price_...
# Optional / currently unused by the code:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Notes:

- Generate `BETTER_AUTH_SECRET` with a password manager or `openssl rand -base64 32`.
- `STRIPE_PREMIUM_PRICE_ID` must point to a **recurring** price, because checkout uses `mode: "subscription"`.
- `BETTER_AUTH_URL` is intentionally pinned to `http://localhost:3000`. If you serve the app on another port, auth requests may need an explicit `Origin: http://localhost:3000` header.

### Step 3 — Start the backend API

In the separate backend folder:

```bash
cd ../pizzahub_server
npm install
npm start
```

The backend needs its own `.env`:

```env
PORT=8000
DB_URI=mongodb+srv://<user>:<password>@<cluster>/pizza_hub
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```

`CLIENT_URL` must match the frontend origin so the backend can fetch `/api/auth/jwks` and verify bearer tokens.

### Step 4 — Start the frontend

From the `pizza_hub` folder:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Step 5 — Configure external services

- **Google OAuth** — add this authorised redirect URI:
  `http://localhost:3000/api/auth/callback/google`
- **Stripe** — use test keys. Checkout redirects to `/vendor/dashboard/invoice/success?session_id=...`; no webhook is required by this repo.
- **ImgBB** — uploads fail without `IMGBB_API`.

### Step 6 — Create an admin account (optional)

Sign-up only allows `user` or `vendor`; anything else is downgraded to `user`. To test the admin area, set the role directly in MongoDB:

```js
db.user.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

To test Premium without Stripe, set `premium: true` on a vendor account.

### Verification commands

```bash
npx next typegen      # generate route types (needed before a clean typecheck)
npx tsc --noEmit      # TypeScript check
npm run lint          # ESLint 9
npm run build         # production build + TypeScript check
npm run start -- --port 3123   # serve an existing build on another port
```

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| Menu/order lists are empty | Check that the backend is running and `NEXT_PUBLIC_API_URL` is correct. Most pages catch fetch errors and render empty states. |
| `Cannot find name 'LayoutProps'` during `tsc` | Run `npx next typegen` (or one `npm run dev` / `npm run build` pass). |
| Sign-in fails when the app runs on another port | Keep `BETTER_AUTH_URL=http://localhost:3000`; send `Origin: http://localhost:3000` with auth POSTs. |
| Premium checkout says the price is invalid | `STRIPE_PREMIUM_PRICE_ID` must be a recurring subscription price. |
| Image upload returns an error | `IMGBB_API` is missing or the file is over 32 MB / not an image. |
| Vendor pages show nothing | Make sure the signed-in account has `role: "vendor"` and that the backend is reachable. |
