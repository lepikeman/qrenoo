import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("Utilisateur non connecté");
      return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
    }

    // Récupération et validation du body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Erreur lors du parsing du body:", error);
      return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
    }

    const { planId } = body;

    if (!planId) {
      console.error("planId manquant dans la requête");
      return NextResponse.json({ error: "planId est requis" }, { status: 400 });
    }

    console.log(`Création d'une session checkout pour l'utilisateur ${user.id}, plan ${planId}`);

    // Récupérer les détails du plan depuis Supabase
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      console.error("Erreur lors de la récupération du plan:", planError);
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 });
    }

    // Récupérer le priceId Stripe correspondant au plan
    const { data: priceMappings, error: mappingError } = await supabase
      .from("stripe_price_mappings")
      .select("stripe_price_id")
      .eq("plan_id", planId)
      .single();

    if (mappingError || !priceMappings?.stripe_price_id) {
      console.error("Erreur lors de la récupération du prix Stripe:", mappingError);
      return NextResponse.json({ error: "Prix Stripe non configuré pour ce plan" }, { status: 400 });
    }

    console.log(`Prix Stripe trouvé: ${priceMappings.stripe_price_id}`);

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const { data: currentSubscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subError && !subError.message.includes('No rows found')) {
      console.error("Erreur lors de la vérification de l'abonnement:", subError);
    }

    let sessionParams: Stripe.Checkout.SessionCreateParams;
    const successUrl = `${req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || 'https://qrenoo.com'}/dashboard?subscription_updated=true`;
    const cancelUrl = `${req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || 'https://qrenoo.com'}/price?cancelled=true`;

    // Si l'utilisateur a déjà un abonnement, créer une session pour mise à jour
    if (currentSubscription?.stripe_subscription_id) {
      console.log(`Mise à jour de l'abonnement existant: ${currentSubscription.stripe_subscription_id}`);
      
      // Récupérer le customer_id associé à l'abonnement existant
      const subscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id);
      
      sessionParams = {
        mode: "subscription",
        customer: subscription.customer as string,
        line_items: [{ price: priceMappings.stripe_price_id, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          metadata: {
            userId: user.id,
            planId: planId,
          },
        },
      };
    } else {
      // Créer une nouvelle session d'abonnement
      console.log("Création d'un nouvel abonnement");
      sessionParams = {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceMappings.stripe_price_id, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: user.email,
        subscription_data: {
          metadata: {
            userId: user.id,
            planId: planId,
          },
        },
      };
    }

    // Créer la session Stripe
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log(`Session Stripe créée: ${session.id}`);
      return NextResponse.json({ url: session.url });
    } catch (stripeError: unknown) {
      console.error("Erreur Stripe:", stripeError);
      const errorMessage = stripeError instanceof Error ? stripeError.message : 'Une erreur inconnue est survenue';
      return NextResponse.json(
        { error: `Erreur Stripe: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Erreur générale:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Erreur lors de la création de la session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
