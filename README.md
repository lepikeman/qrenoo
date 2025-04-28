# Documentation de l'application RDV Kine

Ce document décrit la structure et le fonctionnement des principaux fichiers du dossier `app/`.

---

## Sommaire des fichiers et dossiers

- `app/layout.tsx` : Layout principal, applique la barre de navigation et protège les routes selon le profil utilisateur.
- `app/page.tsx` : Page d'accueil simple.
- `app/components/NavBar.tsx` : Barre de navigation affichée sur toutes les pages.
- `app/components/RequireProfileComplete.tsx` : Composant qui vérifie si le profil utilisateur est complet avant d'accéder à certaines pages.
- `app/(auth)/login/page.tsx` : Page de connexion utilisateur.
- `app/(auth)/register/page.tsx` : Page d'inscription utilisateur.
- `app/api/check-email-exists/route.ts` : API interne pour vérifier si un email existe déjà dans Supabase.
- `app/book/[proID]/page.tsx` : Formulaire de réservation d'un rendez-vous pour un professionnel donné.
- `app/profile-setup/page.tsx` : Page permettant à l'utilisateur de compléter son profil (bio et profession).
- `app/pro/dashboard/page.tsx` : Tableau de bord professionnel, affichant les rendez-vous et les informations du profil.

---

## Détail des fichiers principaux

### `app/layout.tsx`
- Définit le layout global (polices, NavBar, protection des routes).
- Utilise `RequireProfileComplete` pour forcer la complétion du profil sauf sur `/profile-setup`.

### `app/page.tsx`
- Affiche la page d'accueil.

### `app/components/NavBar.tsx`
- Affiche des liens dynamiques selon l'état de connexion de l'utilisateur (connexion, inscription, espace pro, déconnexion).
- Gère la déconnexion via Supabase.

### `app/components/RequireProfileComplete.tsx`
- Vérifie si le profil utilisateur est complet (champ `is_profile_complete` dans la table `profiles`).
- Redirige vers `/profile-setup` si besoin.

### `app/(auth)/login/page.tsx`
- Formulaire de connexion par email/mot de passe.
- Redirige vers `/pro/dashboard` après succès.

### `app/(auth)/register/page.tsx`
- Formulaire d'inscription (nom, prénom, email, mot de passe).
- Vérifie l'unicité de l'email via l'API interne.
- Crée l'utilisateur dans Supabase.

### `app/api/check-email-exists/route.ts`
- API route qui vérifie si un email existe déjà dans la base Supabase (utilise la clé service_role).

### `app/book/[proID]/page.tsx`
- Formulaire de réservation d'un rendez-vous pour un professionnel (nom, téléphone, date).
- Insère un rendez-vous dans la table `rendezvous`.

### `app/profile-setup/page.tsx`
- Permet à l'utilisateur de compléter son profil (profession et bio).
- Met à jour la table `profiles` et le flag `is_profile_complete`.

### `app/pro/dashboard/page.tsx`
- Affiche les informations du profil professionnel et l'agenda des rendez-vous (via FullCalendar).
- Permet de modifier la bio du profil.

---

**Pour plus de détails sur chaque composant, consultez les fichiers sources dans le dossier `app/`.**
# qrenoo
