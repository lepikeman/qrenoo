# page.tsx – Complétion du profil utilisateur

Page permettant à l'utilisateur de compléter son profil professionnel :
- Saisie de la profession et de la bio.
- Pré-remplissage si le profil existe déjà.
- Met à jour la table `profiles` avec les nouvelles informations et le flag `is_profile_complete`.
- Redirige vers `/pro/dashboard` après succès.

**Points clés :**
- Utilise Supabase pour récupérer et mettre à jour le profil.
- Rafraîchit la page après redirection pour éviter le cache.

**Commentaires supprimés :**
- Pré-remplir si déjà existant (optionnel)
- On force un refresh après la redirection pour éviter le cache
