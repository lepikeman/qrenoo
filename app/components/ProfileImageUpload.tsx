import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

interface ProfileImageUploadProps {
  className?: string;
  proId: string;
  imageUrl?: string;
  onUpload?: (url: string) => void;
  width?: number;
  height?: number;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  className,
  proId,
  imageUrl,
  onUpload,
  width = 150,
  height = 150,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(imageUrl);
  const [warning, setWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Limite de taille : 5 Mo
    const maxSize = 5 * 1024 * 1024; // 5 Mo en octets
    if (file.size > maxSize) {
      setWarning("Le fichier est trop volumineux (max 5 Mo)");
      return;
    }
    setWarning(null);
    const oldPhotoUrl = preview;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${proId}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("avatar")
      .upload(fileName, file, { upsert: true });
    if (error) {
      setWarning("Erreur upload : " + error.message);
      setUploading(false);
      return;
    }
    const publicUrl = supabase.storage.from("avatar").getPublicUrl(fileName)
      .data.publicUrl;
    setPreview(publicUrl);
    setUploading(false);
    if (onUpload) onUpload(publicUrl);
    await supabase
      .from("profiles")
      .update({ photoUrl: publicUrl })
      .eq("id", proId);
    console.log("PATCH payload envoyé à Supabase (ProfileImageUpload):", {
      photoUrl: publicUrl,
    });
    if (
      oldPhotoUrl &&
      oldPhotoUrl.includes("supabase.co/storage/v1/object/public/avatar/")
    ) {
      const path = oldPhotoUrl.split("/avatar/")[1];
      if (path) {
        await supabase.storage.from("avatar").remove([path]);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {warning && <div>{warning}</div>}
      <div
        className="relative group cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Profil"
              width={width}
              height={height}
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                alignItems: "center",
                aspectRatio: "1 / 1", // Ajout pour forcer le ratio carré
                width: `${width}px`,
                height: `${height}px`,
                display: "block",
              }}
            />
            {/* Overlay visible uniquement au hover */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              style={{ pointerEvents: "none" }}
            >
              <span className="text-white font-semibold text-lg select-none">
                Modifier la photo
              </span>
            </div>
          </>
        ) : (
          <span>?</span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

export default ProfileImageUpload;
