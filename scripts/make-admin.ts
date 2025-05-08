import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string // Utilisez la clé de service pour avoir tous les droits
);

async function makeAdmin(email: string) {
  try {
    console.log(`Tentative de définir ${email} comme administrateur...`);
    
    // 1. Récupérer l'utilisateur par email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Erreur lors de la recherche des utilisateurs: ${userError.message}`);
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`Aucun utilisateur trouvé avec l'email: ${email}`);
    }
    
    console.log(`Utilisateur trouvé: ${user.id} (${user.email})`);
    
    // 2. Mettre à jour le statut admin dans la table profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('user_id', user.id);
      
    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour du statut admin: ${updateError.message}`);
    }
    
    console.log(`✅ L'utilisateur ${email} est maintenant administrateur`);
    
    // 3. Vérifier que la mise à jour a bien fonctionné
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();
      
    console.log(`Statut admin vérifié: ${updatedProfile?.is_admin}`);
    
    return true;
  } catch (error: any) {
    console.error("❌ Erreur:", error);
    return false;
  }
}

// Exécuter le script avec l'email fourni en ligne de commande
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: npm run make-admin -- user@email.com');
    process.exit(1);
  }
  
  const email = args[0];
  
  console.log(`
=========================================
Définition d'un administrateur
=========================================
Email: ${email}
  `);
  
  const success = await makeAdmin(email);
  process.exit(success ? 0 : 1);
}

main();