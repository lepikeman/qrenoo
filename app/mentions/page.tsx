export default function MentionsLegales() {
  return (
    <main className="bg-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-[#29381a] mb-6">
          Mentions légales
        </h1>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Éditeur du site
            </h2>
            <p className="text-gray-600">
              Axel XHAFLAIRE
              <br />
              Tél : 06 67 39 42 56
              <br />
              Email : xhaflaire.axel@gmail.com
              <br />
              Adresse : 2 ruelle du paradis - 10220 Onjon
              <br />
              SIRET : 942 423 138 00018
            </p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hébergement
            </h2>
            <p className="text-gray-600">
              Vercel Inc.
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Protection des données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Conformément au RGPD, vous disposez des droits d&apos;accès, de
              rectification et de suppression de vos données. Pour toute
              demande, contactez-nous à
              <a
                href="mailto:contact.qrenoo@gmail.com"
                className="text-[#29381a] underline ml-1"
              >
                contact.qrenoo@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
