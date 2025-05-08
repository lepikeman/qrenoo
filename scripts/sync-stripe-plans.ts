import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

async function syncStripePlans() {
  try {
    // 1. Récupérer tous les plans de notre base de données
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('*')
      .order('order', { ascending: true });

    if (plansError) {
      throw plansError;
    }

    console.log(`Synchronisation de ${plans.length} plans avec Stripe`);

    // 2. Pour chaque plan, créer ou mettre à jour le produit et le prix dans Stripe
    for (const plan of plans) {
      // Vérifier si un mapping existe déjà
      const { data: mapping } = await supabase
        .from('stripe_price_mappings')
        .select('stripe_price_id')
        .eq('plan_id', plan.id)
        .single();

      if (mapping?.stripe_price_id) {
        console.log(`Prix Stripe existe déjà pour le plan ${plan.name}: ${mapping.stripe_price_id}`);
        continue;
      }

      // Créer un produit pour ce plan
      const product = await stripe.products.create({
        name: `Qrenoo ${plan.name}`,
        description: plan.description || `Plan ${plan.name} pour Qrenoo`,
        metadata: {
          plan_id: plan.id
        }
      });

      console.log(`Produit créé pour le plan ${plan.name}: ${product.id}`);

      // Créer un prix pour ce produit
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(Number(plan.price) * 100), // Convertir en centimes
        currency: 'eur',
        recurring: {
          interval: 'month'
        },
        metadata: {
          plan_id: plan.id
        }
      });

      console.log(`Prix créé pour le plan ${plan.name}: ${price.id}`);

      // Sauvegarder le mapping dans notre base de données
      const { error: mappingError } = await supabase
        .from('stripe_price_mappings')
        .insert([{
          plan_id: plan.id,
          stripe_price_id: price.id
        }]);

      if (mappingError) {
        console.error(`Erreur lors de la sauvegarde du mapping pour le plan ${plan.name}:`, mappingError);
      }
    }

    console.log('Synchronisation terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}

// Exécuter le script
syncStripePlans();