export default function CguPage() {
  return (
    <main className="bg-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-[#29381a] mb-6">
          Conditions générales
        </h1>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Utilisation du service
            </h2>
            <p className="text-gray-600">
              Le service de prise de rendez-vous est exclusivement réservé aux
              prestations de type coaching, tatouage, photographie et coiffure.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Paiement & Annulation
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Paiement sécurisé par carte bancaire avant la prestation</li>
              <li>
                Annulation sans frais jusqu&apos;à 24h avant le rendez-vous
              </li>
              <li>Pas de remboursement après ce délai</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Responsabilités
            </h2>
            <p className="text-gray-600">
              Nous ne pouvons être tenus responsables des indisponibilités
              temporaires du service dues à des maintenance ou problèmes
              techniques.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
