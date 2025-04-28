/**
 * ProfileSidebar.tsx
 *
 * Composant d'affichage des informations du profil utilisateur dans la sidebar du dashboard.
 *
 * Props :
 *   - profileForm: données du profil utilisateur
 *   - setProfileForm: fonction pour modifier le profil
 *   - proId: identifiant du professionnel
 *   - onEdit: fonction appelée lors du clic sur le bouton d'édition
 *
 * Affiche la photo, les infos principales, les liens et un bouton pour éditer le profil.
 */
import React from "react";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import { HiPencil } from "react-icons/hi2";
import type { Profile } from "@/app/types/Profile";

interface ProfileSidebarProps {
  profileForm: Profile;
  setProfileForm: (form: Profile) => void;
  proId: string;
  onEdit: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileForm, setProfileForm, proId, onEdit }) => (
  <aside>
    <div>
      {/* Photo de profil bien centrée dans un cercle */}
      <div>
        <ProfileImageUpload
          proId={proId}
          imageUrl={profileForm.photoUrl}
          onUpload={(url) => setProfileForm({ ...profileForm, photoUrl: url })}
        />
      </div>
      {/* Affichage infos profil */}
      <div>
        <div>
          <div>
            <div>
              {profileForm.profession || <span>Profession</span>}
            </div>
            <button
              onClick={onEdit}
              title="Modifier le profil"
            >
              <HiPencil size={20} color="#000000" />
            </button>
          </div>
        </div>
        <div>{profileForm.specialite}</div>
        <div>{profileForm.bio}</div>
        <div>
          {profileForm.phone && <span>{profileForm.phone}</span>}
          {profileForm.adresse_postale && (
            <span>
              {profileForm.adresse_postale}, {profileForm.code_postal} {profileForm.ville}
            </span>
          )}
          {profileForm.site_web && (
            <a href={profileForm.site_web} target="_blank" rel="noopener noreferrer">Site web</a>
          )}
          {profileForm.linkedin && (
            <a href={profileForm.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          )}
        </div>
      </div>
    </div>
  </aside>
);

export default ProfileSidebar;
