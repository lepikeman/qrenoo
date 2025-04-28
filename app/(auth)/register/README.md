# Register Page – Documentation

Ce fichier décrit le fonctionnement du composant d'inscription situé dans `page.tsx`.

## Fonction principale : `RegisterPage`

Ce composant React gère l'inscription d'un nouvel utilisateur. Il utilise :
- `useState` pour gérer les états de chargement, d'erreur et de succès
- `supabase` pour l'inscription via l'API Supabase
- Un formulaire pour recueillir les informations utilisateur

### États
- `loading` : indique si une requête est en cours
- `error` : message d'erreur à afficher à l'utilisateur
- `success` : message de succès à afficher à l'utilisateur

### Fonction : `handleRegister(event)`
- Empêche le rechargement de la page lors de la soumission du formulaire
- Récupère les valeurs des champs : nom, prénom, email, mot de passe
- Vérifie si l'email existe déjà via `/api/check-email-exists`
- Si l'email existe : affiche une erreur et arrête la procédure
- Sinon, tente l'inscription via `supabase.auth.signUp`
  - Si une erreur survient (par exemple, email déjà utilisé), affiche un message adapté
  - Si succès, affiche un message de succès et réinitialise le formulaire

### Rendu JSX
- Affiche un formulaire d'inscription avec les champs :
  - Nom
  - Prénom
  - Email
  - Mot de passe
- Bouton de soumission désactivé pendant le chargement
- Affiche les messages d'erreur ou de succès sous le bouton
- Lien vers la page de connexion si l'utilisateur a déjà un compte

## Dépendances
- `next/link` pour la navigation
- `react` pour les hooks
- `@/utils/supabase/client` pour l'authentification Supabase

## API utilisée
- `/api/check-email-exists` : vérifie si l'email est déjà utilisé
- `supabase.auth.signUp` : crée un nouvel utilisateur avec email, mot de passe, nom, prénom

## Redirection
- Après inscription, l'utilisateur reçoit un email pour valider son compte
- Redirection prévue vers `/login` après validation de l'email

## Commentaires supprimés
- Les logs de debug (console.log) pour l'inscription et les retours Supabase.
- Les indications sur la récupération des champs du formulaire.
- Les explications sur la gestion des erreurs et du succès.

**Fonctionnement détaillé :**
- Formulaire d'inscription pour nom, prénom, email, mot de passe.
- Vérifie l'unicité de l'email via l'API `/api/check-email-exists`.
- Crée l'utilisateur dans Supabase et ajoute les champs supplémentaires.
- Affiche les messages d'erreur ou de succès.
- Redirige vers la connexion après inscription.

**Détails du code :**
- Utilise les hooks React pour gérer les états de chargement, d'erreur et de succès.
- Utilise Supabase pour l'inscription et la gestion des utilisateurs.
- Utilise `fetch` pour vérifier si l'email existe déjà avant de créer l'utilisateur.

---

**Résumé** :
Ce composant permet à un nouvel utilisateur de s'inscrire en renseignant ses informations. Il gère les cas d'erreur courants (email déjà utilisé) et affiche des messages adaptés à l'utilisateur.
