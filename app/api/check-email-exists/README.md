# API – check-email-exists

Cette route API permet de vérifier si un email existe déjà dans la base utilisateurs Supabase.

**Fonctionnement détaillé :**
- Reçoit une requête POST avec un email.
- Utilise la clé `service_role` pour accéder à l'API Admin de Supabase Auth (côté serveur uniquement).
- Retourne `{ exists: true/false }` selon la présence de l'email.
- Utilisée pour empêcher la double inscription avec le même email.

**Détails du code :**
- Récupère l'email envoyé dans la requête POST.
- Appelle l'API REST Admin de Supabase pour rechercher un utilisateur avec cet email (en utilisant la clé `service_role`).
- Parse la réponse JSON de l'API.
- Log de debug : affiche l'email recherché et la réponse de Supabase dans la console serveur.
- Si la requête échoue, retourne une erreur 500 au client.
- Déclare un type TypeScript minimal pour l'utilisateur Supabase.
- Vérifie si la liste des utilisateurs retournée contient au moins un utilisateur avec l'email exact.
- Ajoute les informations de debug dans la réponse pour analyse côté client.

**Points clés :**
- Sécurité : la clé service_role doit rester côté serveur.
- Retourne aussi des infos de debug pour le développement.

**Commentaires supprimés :**
- **Récupération de l'email** : l'email est récupéré à partir de la requête POST pour être utilisé dans la recherche.
- **Appel à l'API Admin de Supabase** : la clé `service_role` est utilisée pour accéder à l'API Admin de Supabase Auth, permettant ainsi de rechercher des utilisateurs en fonction de leur email.
- **Parsing de la réponse JSON** : la réponse de l'API est parsée pour extraire les informations nécessaires.
- **Log de debug** : les informations de debug sont affichées dans la console serveur pour faciliter l'analyse et la résolution des problèmes.
- **Gestion des erreurs** : en cas d'échec de la requête, une erreur 500 est retournée au client pour indiquer un problème serveur.
- **Déclaration du type utilisateur** : un type TypeScript minimal est déclaré pour l'utilisateur Supabase pour assurer la cohérence des données.
- **Vérification de l'email** : la liste des utilisateurs retournée est vérifiée pour déterminer si l'email exact est présent.
- **Ajout des informations de debug** : les informations de debug sont ajoutées à la réponse pour permettre une analyse plus approfondie côté client.
- **Sécurité de la clé service_role** : il est crucial de maintenir la clé `service_role` confidentielle et de ne l'exposer que côté serveur pour éviter tout accès non autorisé à l'API Admin de Supabase Auth.
