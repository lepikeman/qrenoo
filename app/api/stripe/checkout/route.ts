import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-04-30.basil" });

// Mappe tes planId à tes priceId Stripe ici
const PLAN_TO_PRICE: Record<string, string> = {
    "00000000-0000-0000-0000-000000000002": "price_1RKgtP2cxaGZNwgt4uaEPH0l",
    "00000000-0000-0000-0000-000000000003": "price_1RKgtt2cxaGZNwgtesctfbp0",
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    const priceId = PLAN_TO_PRICE[planId];
    if (!priceId) {
      return NextResponse.json({ error: "Plan inconnu" }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customer_email: user?.email,
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/price`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
