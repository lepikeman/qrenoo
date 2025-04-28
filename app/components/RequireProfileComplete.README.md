# RequireProfileComplete.tsx – Protection de complétion de profil

Composant qui vérifie si l'utilisateur a complété son profil :
- Utilise Supabase pour récupérer l'utilisateur courant et son profil.
- Si le champ `is_profile_complete` n'est pas vrai, redirige vers `/profile-setup`.
- S'utilise pour "wrapper" toutes les pages nécessitant un profil complet.

**Points clés :**
- Utilise `useEffect` pour vérifier le profil à chaque chargement de page.
- Sépare la logique de vérification du rendu des enfants.

**Fonctionnement détaillé :**
- Utilise Supabase pour récupérer l'utilisateur courant et son profil.
- Si le champ `is_profile_complete` n'est pas vrai, redirige vers `/profile-setup`.
- S'utilise pour "wrapper" toutes les pages nécessitant un profil complet.

**Détails du code :**
- Utilise `useEffect` pour vérifier le profil à chaque chargement de page.
- La fonction `checkProfile` récupère l'utilisateur connecté, puis attend 200ms pour laisser le temps à Supabase de propager la donnée.
- Utilise `.maybeSingle()` pour éviter les bugs de `.single()` si aucun profil n'est trouvé.
- Si le profil n'est pas complet, redirige l'utilisateur vers `/profile-setup` (sauf si on est déjà sur cette page).
- Le composant retourne simplement ses enfants s'ils sont autorisés.
