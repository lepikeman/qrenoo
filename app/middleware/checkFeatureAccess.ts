import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function checkFeatureAccess(
  req: NextRequest,
  featureSlug: string
) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Vérifier si l'utilisateur est connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Récupérer le plan de l'utilisateur
  const { data: userData } = await supabase
    .from("users")
    .select("plan_id")
    .eq("id", user.id)
    .single();

  if (!userData?.plan_id) {
    return NextResponse.redirect(new URL("/price", req.url));
  }

  // Vérifier si le plan donne accès à la fonctionnalité
  const { data: feature } = await supabase
    .from("plan_features")
    .select("enabled")
    .eq("plan_id", userData.plan_id)
    .eq("feature_slug", featureSlug)
    .single();

  if (!feature?.enabled) {
    // Rediriger vers la page de tarification avec l'information sur la fonctionnalité
    return NextResponse.redirect(
      new URL(`/price?feature=${featureSlug}`, req.url)
    );
  }

  return res;
}
