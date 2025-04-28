/**
 * ProfileImageUpload.tsx
 *
 * Composant pour uploader et afficher la photo de profil utilisateur dans la sidebar du dashboard.
 *
 * Props :
 *   - imageUrl: url de la photo actuelle
 *
 * Affiche la photo de profil et permet à l'utilisateur de la modifier.
 */
import React from "react";

interface ProfileImageUploadProps {
  imageUrl?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ imageUrl }) => (
  <div>
    {/* Placeholder, à remplacer par l'UI d'upload réelle */}
    <img src={imageUrl || "/default-profile.png"} alt="Profil" className="w-24 h-24 rounded-full object-cover mx-auto" />
    <button className="block mx-auto mt-2 text-sm text-blue-600 underline">Changer la photo</button>
  </div>
);

export default ProfileImageUpload;
