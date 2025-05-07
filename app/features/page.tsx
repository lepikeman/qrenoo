import Image from 'next/image'

export const metadata = {
  title: 'Fonctionnalités | Qrenoo - Logiciel de prise de rendez-vous en ligne',
  description: 'Découvrez toutes les fonctionnalités de Qrenoo : agenda en ligne, rappels SMS, paiement en ligne, et bien plus pour gérer efficacement vos rendez-vous.',
}

export default function Features() {
  return (
    <main className="features-page">
      <section className="hero">
        <h1>Toutes les fonctionnalités de Qrenoo</h1>
        <p>Découvrez comment notre logiciel de prise de rendez-vous peut transformer votre activité</p>
      </section>
      
      <section className="feature-list">
        <div className="feature">
          <h2>Agenda intelligent</h2>
          <p>Gérez votre planning en toute simplicité avec notre interface intuitive.</p>
          <Image src="/images/feature-agenda.png" alt="Agenda Qrenoo" width={500} height={300} />
          <ul>
            <li>Vue journalière, hebdomadaire et mensuelle</li>
            <li>Gestion de plusieurs praticiens</li>
            <li>Synchronisation avec Google Calendar</li>
          </ul>
        </div>
        
        {/* Ajoutez d'autres fonctionnalités similaires */}
      </section>
    </main>
  )
}