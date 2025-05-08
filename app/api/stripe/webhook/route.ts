/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Configuration supabase server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Gestion des événements
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(deletedSubscription);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Récupérer le client pour obtenir l'email
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  if ('deleted' in customer || !customer.email) return;
  
  // Trouver l'utilisateur associé à cet email
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', customer.email);
  
  if (!profiles || profiles.length === 0) {
    console.error(`Aucun utilisateur trouvé avec l'email ${customer.email}`);
    return;
  }
  
  // Trouver le plan associé à ce prix
  const priceId = subscription.items.data[0].price.id;
  const { data: priceMappings } = await supabase
    .from('stripe_price_mappings')
    .select('plan_id')
    .eq('stripe_price_id', priceId)
    .single();
  
  if (!priceMappings) {
    console.error(`Aucun plan trouvé pour le prix Stripe ${priceId}`);
    return;
  }
  
  // Mettre à jour le profil utilisateur
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_id: priceMappings.plan_id,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', profiles[0].user_id);
    
  if (error) {
    console.error('Erreur mise à jour profil:', error);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  // Trouver l'utilisateur avec cet ID d'abonnement
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('subscription_id', subscription.id);
  
  if (!profiles || profiles.length === 0) {
    console.error(`Aucun utilisateur trouvé avec l'abonnement ${subscription.id}`);
    return;
  }
  
  // Mettre à jour le statut
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', profiles[0].user_id);
    
  if (error) {
    console.error('Erreur mise à jour statut:', error);
  }
}