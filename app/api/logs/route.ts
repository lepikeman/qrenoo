import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { message, level, context } = await request.json();

    // Récupère l'utilisateur actuel
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insère le log dans une table Supabase
    await supabase.from("logs").insert({
      message,
      level,
      context,
      user_id: user?.id,
      created_at: new Date().toISOString(),
    });

    return new Response("Log enregistré", { status: 200 });
  } catch (error) {
    return new Response(
      "Erreur lors de l'enregistrement du log, erreur :" + error,
      { status: 500 }
    );
  }
}
