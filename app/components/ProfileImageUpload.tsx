import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfileImageUploadProps {
  proId: string;
  imageUrl?: string;
  onUpload?: (url: string) => void;
  width?: number;
  height?: number;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  proId,
  imageUrl,
  onUpload,
  width = 150,
  height = 150,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(imageUrl);
  const [warning, setWarning] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [src, setSrc] = useState<string>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>();
  const [showCropModal, setShowCropModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      setSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (): Promise<File> => {
    const image = new Image();
    image.src = src!;
    
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop!.width * scaleX;
    canvas.height = crop!.height * scaleY;
    
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      image,
      crop!.x * scaleX,
      crop!.y * scaleY,
      crop!.width * scaleX,
      crop!.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob!], 'profile-image.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const handleUpload = async (file: File) => {
    // Limite de taille : 5 Mo
    const maxSize = 5 * 1024 * 1024; // 5 Mo en octets
    if (file.size > maxSize) {
      setWarning("Le fichier est trop volumineux (max 5 Mo)");
      return;
    }
    setWarning(null);
    const oldPhotoUrl = preview;
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
    <div>
      {warning && <div>{warning}</div>}
      {showCropModal && src && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop
            >
              <img src={src} alt="Recadrage" />
            </ReactCrop>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={async () => {
                  const croppedFile = await getCroppedImg();
                  const url = URL.createObjectURL(croppedFile);
                  setPreview(url);
                  setCroppedImageUrl(url);
                  setShowCropModal(false);
                  await handleUpload(croppedFile);
                }}
                className="btn btn-primary bg-[#6e7b4d] text-white"
              >
                Confirmer
              </button>
              
              <button
                onClick={() => setShowCropModal(false)}
                className="btn btn-ghost border border-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
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
