import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isPremiumActive } from "@/lib/plan";
import { stripe } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout Session for the Premium plan and returns its URL.
 * The client redirects to Stripe itself, so the browser never has to follow a
 * cross-origin redirect from `fetch` (which would be blocked by CORS).
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to upgrade." },
        { status: 401 },
      );
    }

    if (isPremiumActive(session.user)) {
      return NextResponse.json(
        { error: "This account is already on Premium." },
        { status: 400 },
      );
    }

    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PREMIUM_PRICE_ID is not set in .env." },
        { status: 500 },
      );
    }

    const origin =
      request.headers.get("origin") ??
      process.env.BETTER_AUTH_URL ??
      new URL(request.url).origin;

    const checkout = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      // Premium is a monthly plan, so the Price must be a recurring price.
      mode: "subscription",
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      success_url: `${origin}/vendor/dashboard/invoice/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/vendor/dashboard/plan`,
      allow_promotion_codes: true,
    });

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
