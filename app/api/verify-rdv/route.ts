import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { rdv_id, code } = await request.json();
  if (!rdv_id || !code) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("rendezvous")
    .select("validation_code")
    .eq("id", rdv_id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 400 });
  if (String(data.validation_code) === String(code)) {
    await supabase.from("rendezvous").update({ is_validated: true }).eq("id", rdv_id);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Code invalide" }, { status: 400 });
}
