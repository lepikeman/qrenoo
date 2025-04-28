import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    headers: {
      apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
  });

  const result = await resp.json();
  console.log("DEBUG check-email-exists:", { email, result, status: resp.status });

  if (!resp.ok) {
    return NextResponse.json({ exists: false, error: result.message }, { status: 500 });
  }

  interface SupabaseUser {
    email: string;
  }

  const exists = Array.isArray(result.users) && result.users.some((u: SupabaseUser) => u.email === email);
  return NextResponse.json({ exists, debug: result });
}
