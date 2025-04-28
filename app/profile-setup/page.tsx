"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function ProfileSetup() {
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [presentation, setPresentation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profession, bio, photoUrl, specialite, site_web, linkedin, presentation")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          setProfession(profile.profession || "");
          setBio(profile.bio || "");
          setPhotoUrl(profile.photoUrl || "");
          setSpecialite(profile.specialite || "");
          setSiteWeb(profile.site_web || "");
          setLinkedin(profile.linkedin || "");
          setPresentation(profile.presentation || "");
        }
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      profession,
      bio,
      photoUrl,
      specialite,
      site_web: siteWeb,
      linkedin,
      presentation,
      is_profile_complete: true,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/pro/dashboard");
      if (typeof window !== "undefined") {
        setTimeout(() => window.location.reload(), 200);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-black rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Complétez votre profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Profession</label>
          <input
            className="border rounded w-full p-2"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Spécialité</label>
          <input
            className="border rounded w-full p-2"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">Bio</label>
          <textarea
            className="border rounded w-full p-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Photo (URL)</label>
          <input
            className="border rounded w-full p-2"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-semibold">Site web</label>
          <input
            className="border rounded w-full p-2"
            value={siteWeb}
            onChange={(e) => setSiteWeb(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block font-semibold">LinkedIn</label>
          <input
            className="border rounded w-full p-2"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Valider"}
        </button>
      </form>
    </div>
  );
}
