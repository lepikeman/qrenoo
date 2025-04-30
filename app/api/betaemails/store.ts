// Simple file-based storage for beta emails (for demo/dev only)
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function storeBetaEmail(email: string) {
  await supabase.from("beta_emails").insert({ email });
}

interface BetaEmailRow {
  email: string;
}

export async function readAllBetaEmails() {
  const { data } = await supabase.from("beta_emails").select("email");
  return data?.map((row: BetaEmailRow) => row.email) || [];
}

export async function clearBetaEmails() {
  await supabase.from("beta_emails").delete().neq("id", 0);
}