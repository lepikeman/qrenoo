import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// "use client" supprimé pour permettre l'utilisation des server actions

export default function BookPage({ params }: { params: { proId: string } }) {
  async function handleSubmit(formData: FormData) {
    "use server";

    const nom = formData.get("nom") as string;
    const phone = formData.get("phone") as string;
    const date_jour = formData.get("date_jour") as string;
    const heure = formData.get("heure") as string;

    // Validation: check if all fields are filled
    if (!nom || !phone || !date_jour || !heure || !params.proId) {
      console.error("Tous les champs sont obligatoires", {
        nom,
        phone,
        date_jour,
        heure,
        proId: params.proId,
      });
      // Optionnel: afficher un message d'erreur à l'utilisateur ici
      return;
    }

    const supabase = await createClient();
    // Debug: log data before insert
    console.log("Inserting into rendezvous:", {
      pro_id: params.proId,
      client_nom: nom,
      client_phone: phone,
      date_jour,
      heure,
    });
    const { error } = await supabase
      .from("rendezvous")
      .insert([
        {
          pro_id: params.proId,
          client_nom: nom,
          client_phone: phone,
          date_jour,
          heure,
        },
      ])
      .select();

    if (error) {
      console.error("Erreur Supabase :", error);
      // Optionnel : afficher un message d'erreur à l'utilisateur
      return;
    }

    redirect("/confirmation");
  }

  return (
    <form action={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="nom" className="block mb-2">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date_jour" className="block mb-2">
          Date du rendez-vous
        </label>
        <input
          type="date"
          id="date_jour"
          name="date_jour"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <label htmlFor="heure" className="block mb-2">
          Heure du rendez-vous
        </label>
        <input
          type="time"
          id="heure"
          name="heure"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Réserver
      </button>
    </form>
  );
}
