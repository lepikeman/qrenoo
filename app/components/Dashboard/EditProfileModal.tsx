/**
 * EditProfileModal.tsx
 *
 * Modale d'édition du profil utilisateur dans le dashboard.
 *
 * Props :
 *   - open: boolean (état d'ouverture de la modale)
 *   - onClose: fonction (fermeture de la modale)
 *   - profileForm: Profile (formulaire de profil)
 *   - setProfileForm: fonction (mise à jour du formulaire de profil)
 *   - handleUpdateProfile: fonction (mise à jour du profil)
 *   - profileLoading: boolean (état de chargement du profil)
 *
 * Affiche une fenêtre modale pour éditer les informations du profil.
 */
import React from "react";
import DashboardProfileInfo from "@/app/components/Dashboard/DashboardProfileInfo";
import type { Profile } from "@/app/types/Profile";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileForm: Profile;
  setProfileForm: (form: Profile) => void;
  handleUpdateProfile: (form: Profile) => Promise<void>;
  profileLoading: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, profileForm, setProfileForm, handleUpdateProfile, profileLoading }) => {
  if (!open) return null;
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fermer">&times;</button>
        <DashboardProfileInfo
          profileForm={profileForm}
          onChange={(field, value) => setProfileForm({ ...profileForm, [field]: value })}
          onSave={async (profileFormToSave) => {
            setProfileForm(profileFormToSave);
            await handleUpdateProfile(profileFormToSave);
            onClose();
          }}
          saving={profileLoading}
          visible={open}
        />
      </div>
    </div>
  );
};

export default EditProfileModal;
