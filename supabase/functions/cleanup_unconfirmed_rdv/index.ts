// supabase/functions/cleanup_unconfirmed_rdv/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  console.log("Function cleanup_unconfirmed_rdv invoked");
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

  // Supprime les RDV non confirmés créés il y a plus de 15 minutes
  const { error, count } = await supabase
    .from("rendezvous")
    .delete()
    .lt("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .eq("is_validated", false)
    .select("*", { count: "exact" });

  if (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    );
  }
  return new Response(
    JSON.stringify({ status: "ok", deleted: count }),
    { status: 200 }
  );
});