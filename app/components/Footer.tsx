interface FooterLink {
  label: string;
  href?: string;
}

interface FooterProps {
  links?: FooterLink[];
  children?: React.ReactNode;
}

const defaultLinks: FooterLink[] = [
  { label: "Mentions légales" },
  { label: "CGU et CGV" },
  { label: "RGPD" },
  { label: "Donnée utilisateur" },
];

export default function Footer({
  links = defaultLinks,
  children,
}: FooterProps) {
  return (
    <footer className="bg-[#29381a] text-white py-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Qrenoo. Tous droits réservés.
          </p>
          {children && <div className="mt-2">{children}</div>}
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs justify-center md:justify-end mt-2 md:mt-0">
          {links.map((link, idx) => (
            <li key={idx}>
              {link.href ? (
                <a href={link.href} className="hover:underline cursor-pointer">
                  {link.label}
                </a>
              ) : (
                link.label
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
