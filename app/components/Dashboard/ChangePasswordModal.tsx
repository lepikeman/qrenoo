import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  email,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("La confirmation du mot de passe ne correspond pas.");
      return;
    }
    setLoading(true);
    // 1. Vérifie l'ancien mot de passe (authentifie l'utilisateur)
    const { error: signInError, data } = await supabase.auth.signInWithPassword(
      {
        email,
        password: oldPassword,
      }
    );
    if (signInError) {
      setError("Ancien mot de passe incorrect.");
      setLoading(false);
      return;
    }
    // Force la session côté client après signIn
    if (data && data.session) {
      await supabase.auth.setSession(data.session);
    }
    
    // 2. Vérifie que l'utilisateur est bien authentifié avec getUser() (sécurisé)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      setError("Session invalide. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }
    
    // 3. Change le mot de passe (l'utilisateur est connecté)
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    console.log("updateUser result:", updateError);
    if (updateError) {
      setError(
        "Erreur lors du changement de mot de passe : " + updateError.message
      );
      setLoading(false);
      return;
    }
    // Déconnecte l'utilisateur puis reconnecte-le avec le nouveau mot de passe
    await supabase.auth.signOut();
    const { error: reSignInError } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    if (reSignInError) {
      setError(
        "Le mot de passe a été changé mais la reconnexion a échoué : " +
          reSignInError.message
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    setSuccess("Votre mot de passe a été mis à jour avec succès.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setSuccess("");
      onClose();
    }, 1500);
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBgClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-[380px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-[#29381a]">
          Changer le mot de passe
        </h2>
        <p>Email utilisé pour le changement de mot de passe : {email}</p>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <input
            type="password"
            className="dashboard-profile-input"
            placeholder="Ancien mot de passe"
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            className="dashboard-profile-input"
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="dashboard-profile-input"
            placeholder="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#29381a] text-white font-semibold rounded-lg px-4 py-2 hover:brightness-105"
              disabled={loading}
            >
              {loading ? "Modification..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
