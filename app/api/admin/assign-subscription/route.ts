import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Création du client Supabase
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérification des droits admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    
    console.log("Utilisateur authentifié:", user.id);
    
    // Vérifier si l'utilisateur est admin
    const { data: adminCheck, error: adminError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();
    
    if (adminError) {
      console.error("Erreur lors de la vérification admin:", adminError);
      return NextResponse.json({ error: `Erreur de vérification admin: ${adminError.message}` }, { status: 500 });
    }
    
    if (!adminCheck?.is_admin) {
      return NextResponse.json({ error: "Accès refusé: vous devez être administrateur" }, { status: 403 });
    }
    
    // Récupérer les données du corps de la requête
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError);
      return NextResponse.json({ error: "Format de requête invalide" }, { status: 400 });
    }
    
    const { userId, planId, subscriptionId } = requestData;
    
    // Valider les données requises
    if (!userId || !planId || !subscriptionId) {
      return NextResponse.json({ error: "Tous les champs sont requis: userId, planId, subscriptionId" }, { status: 400 });
    }
    
    console.log("Données reçues:", { userId, planId, subscriptionId });
    
    // Vérifier que l'utilisateur cible existe
    const { data: userExists, error: userError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .single();
    
    if (userError) {
      console.error("Erreur lors de la vérification de l'utilisateur:", userError);
      return NextResponse.json({ error: `L'utilisateur n'existe pas: ${userError.message}` }, { status: 404 });
    }
    
    // Vérifier que le plan existe
    const { data: planExists, error: planError } = await supabase
      .from("plans")
      .select("id")
      .eq("id", planId)
      .single();
    
    if (planError) {
      console.error("Erreur lors de la vérification du plan:", planError);
      return NextResponse.json({ error: `Le plan n'existe pas: ${planError.message}` }, { status: 404 });
    }
    
    console.log("Utilisateur et plan vérifiés, mise à jour...");
    
    // Mise à jour du profil utilisateur
    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({
        plan_id: planId,
        subscription_id: subscriptionId,
        subscription_status: "active",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select();
    
    if (updateError) {
      console.error("Erreur lors de la mise à jour du profil:", updateError);
      return NextResponse.json({ error: `Erreur de mise à jour: ${updateError.message}` }, { status: 500 });
    }
    
    console.log("Mise à jour réussie:", updateData);
    
    return NextResponse.json({
      success: true,
      message: `L'abonnement ${subscriptionId} a été assigné à l'utilisateur`,
      data: updateData
    });
    
  } catch (error: any) {
    console.error("Erreur non gérée:", error);
    return NextResponse.json({ 
      error: `Erreur serveur: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
