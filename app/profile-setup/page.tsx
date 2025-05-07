/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function ProfileSetup() {
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [oldPhotoUrl, setOldPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("profession, bio, photoUrl, specialite, site_web, linkedin")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          setProfession(profile.profession || "");
          setBio(profile.bio || "");
          setPhotoUrl(profile.photoUrl || "");
          setOldPhotoUrl(profile.photoUrl || "");
          setSpecialite(profile.specialite || "");
          setSiteWeb(profile.site_web || "");
          setLinkedin(profile.linkedin || "");
        }
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // APRÈS: Utilisation de getUser()
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    
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

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    // Limite de taille : 5 Mo
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setPhotoWarning("Le fichier est trop volumineux (max 5 Mo)");
      return;
    }
    setPhotoWarning(null);
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatar")
      .upload(fileName, file, { upsert: true });
    if (uploadError) {
      setPhotoWarning("Erreur upload : " + uploadError.message);
      setUploading(false);
      return;
    }
    const publicUrl = supabase.storage.from("avatar").getPublicUrl(fileName).data.publicUrl;
    setPhotoUrl(publicUrl);
    setUploading(false);

    // Update profile in DB
    await supabase
      .from("profiles")
      .update({ photoUrl: publicUrl })
      .eq("user_id", userId);

    // Remove old photo if needed
    if (
      oldPhotoUrl &&
      oldPhotoUrl.includes("supabase.co/storage/v1/object/public/avatar/")
    ) {
      const path = oldPhotoUrl.split("/avatar/")[1];
      if (path) {
        await supabase.storage.from("avatar").remove([path]);
      }
    }
    setOldPhotoUrl(publicUrl);
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
          <label className="block font-semibold">Photo</label>
          <div className="flex items-center gap-2">
            <input
              className="border rounded w-full p-2"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Ajouter une photo"
              readOnly
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer", background: "#f9fafb" }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handlePhotoFileChange}
              disabled={uploading}
            />
          </div>
          {photoWarning && <div className="text-red-500">{photoWarning}</div>}
            <img
              src={photoUrl}
              alt="Aperçu"
              className="mt-2 rounded object-cover"
              width={96}
              height={96}
            />
            
          {uploading && <div className="text-blue-500">Téléchargement...</div>}
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
