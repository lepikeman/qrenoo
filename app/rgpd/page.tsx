export default function RGPD() {
  return (
    <main className="bg-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-[#29381a] mb-6">
          Protection des données
        </h1>

        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Vos droits
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification des informations inexactes</li>
              <li>Droit à l&apos;oubli et suppression des données</li>
              <li>Opposition au traitement commercial</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Contact DPO
            </h2>
            <p className="text-gray-600">
              Pour exercer vos droits, contactez notre délégué à la protection
              des données :
              <a
                href="mailto:contact@qrenoo.com"
                className="block mt-2 text-[#29381a] underline"
              >
                contact@qrenoo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
