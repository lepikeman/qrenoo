# page.tsx – Réservation de rendez-vous

Page qui permet à un client de réserver un rendez-vous chez un professionnel donné (proID).

- Formulaire pour saisir : nom, téléphone, date du rendez-vous.
- Validation des champs côté serveur.
- Insère le rendez-vous dans la table `rendezvous` de Supabase.
- Redirige vers `/confirmation` après succès.

**Points clés :**
- Utilise les server actions Next.js (pas de "use client").
- Vérifie que tous les champs sont remplis avant insertion.
- Utilise `createClient()` pour interagir avec Supabase côté serveur.
