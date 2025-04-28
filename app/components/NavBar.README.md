# NavBar.tsx – Barre de navigation

Composant qui affiche la barre de navigation principale sur toutes les pages :
- Affiche différents liens selon que l'utilisateur est connecté ou non.
- Gère la déconnexion via Supabase.
- Utilise les hooks React pour écouter l'état d'authentification.

**Fonctionnalités :**
- Boutons "Se connecter", "S'inscrire" (si non connecté).
- Lien vers l'espace professionnel et bouton "Déconnecter" (si connecté).
- Utilise `useRouter` de Next.js pour la navigation.

**Fonctionnement détaillé :**
- Affiche différents liens selon que l'utilisateur est connecté ou non.
- Gère la déconnexion via Supabase.
- Utilise les hooks React pour écouter l'état d'authentification.

**Détails du code :**
- Utilise `useEffect` pour vérifier l'utilisateur au chargement et écouter les changements d'authentification.
- Si un utilisateur est connecté, affiche les liens vers l'espace professionnel et le bouton "Déconnecter".
- Si aucun utilisateur n'est connecté, affiche les boutons "Se connecter" et "S'inscrire".
- Utilise `useRouter` de Next.js pour la navigation après les actions.
- Le bouton "Déconnecter" appelle Supabase pour se déconnecter, remet l'état utilisateur à `null` et redirige vers la page de login.

**Commentaires supprimés :**
- Vérifie l'utilisateur au chargement
- Ecoute les changements d'auth
