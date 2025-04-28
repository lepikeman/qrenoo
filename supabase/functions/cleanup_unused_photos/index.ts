import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req: Request) => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  // Log diagnostic
  console.log("SUPABASE_URL present:", !!url, "SUPABASE_SERVICE_ROLE_KEY length:", key?.length);
  if (!url || !key) {
    return new Response(
      JSON.stringify({ status: "error", message: "Missing env vars", urlPresent: !!url, keyLength: key?.length }),
      { status: 500 }
    );
  }
  const supabase = createClient(url, key);

  // 1. Liste tous les fichiers du bucket
  const bucketName = "avatar"; // <-- Remplace par le nom réel de ton bucket
  const { data: allFiles, error: listError } = await supabase
    .storage
    .from(bucketName)
    .list("", { limit: 10000, offset: 0, search: "" });

  if (listError) {
    return new Response(
      JSON.stringify({ status: "error", message: listError.message }),
      { status: 500 }
    );
  }

  // 2. Récupère la liste des fichiers utilisés dans la base
  // Exemple : imaginons que tu stockes le chemin dans la colonne "photo_url" de la table "profiles"
  const { data: usedPhotos, error: usedError } = await supabase
    .from("profiles")
    .select("photoUrl");

  if (usedError) {
    return new Response(
      JSON.stringify({ status: "error", message: usedError.message }),
      { status: 500 }
    );
  }

  // 3. Crée un Set des chemins utilisés
  const usedSet = new Set(
    (usedPhotos ?? [])
      .map((row: any) => {
        if (!row.photoUrl) return null;
        return row.photoUrl.split('/').pop();
      })
      .filter((name: string | null) => !!name)
  );

  // 4. Détecte les fichiers non utilisés
  const unusedFiles = (allFiles ?? [])
    .filter((file: any) => file && file.name && !usedSet.has(file.name));

  // 5. Supprime les fichiers non utilisés
  let deletedCount = 0;
  for (const file of unusedFiles) {
    const { error: delError } = await supabase
      .storage
      .from(bucketName)
      .remove([file.name]);
    if (!delError) deletedCount++;
  }

  return new Response(
    JSON.stringify({ status: "ok", deleted: deletedCount }),
    { status: 200 }
  );
});