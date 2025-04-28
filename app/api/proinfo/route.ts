import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/proinfo?pro_id=xxxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pro_id = searchParams.get("pro_id");
  if (!pro_id) {
    return NextResponse.json({ error: "pro_id requis" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", pro_id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
