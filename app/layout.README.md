# layout.tsx – Layout principal

Ce fichier définit le layout global de l'application :
- Applique les polices personnalisées.
- Affiche la barre de navigation (`NavBar`).
- Protège toutes les routes (sauf `/profile-setup`) avec le composant `RequireProfileComplete` qui force l'utilisateur à compléter son profil avant d'accéder au reste de l'application.
- Gère l'injection des enfants React dans le layout HTML.

**Points clés :**
- Utilise les polices Geist de Google Fonts.
- Ajoute une protection de route côté client.
- Structure la page avec `<html>` et `<body>` pour Next.js.

**Fonctionnement détaillé :**
- Applique les polices personnalisées Geist et Geist_Mono de Google Fonts.
- Importe la feuille de style globale `globals.css`.
- Affiche la barre de navigation (`NavBar`).
- Protège toutes les routes sauf `/profile-setup` avec le composant `RequireProfileComplete` qui force l'utilisateur à compléter son profil avant d'accéder au reste de l'application.
- Gère l'injection des enfants React dans le layout HTML (balises `<html>` et `<body>`).

**Détails du code :**
- La variable `isProfileSetupPage` permet de ne pas appliquer la protection sur la page `/profile-setup`.
- Si l'utilisateur est sur cette page, le contenu est affiché directement.
- Sinon, le contenu est "wrappé" dans `RequireProfileComplete` pour forcer la complétion de profil.
- Le composant applique aussi les classes de police et d'anticrénelage sur le `<body>`.
