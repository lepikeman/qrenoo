"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import DevPopup, { useDevPopup } from "./DevPopup";

// Définir les types pour plus de clarté
interface NavLink {
  name: string;
  href: string;
}

interface NavComponentProps {
  links: NavLink[];
  toggleMenu?: () => void;
}

const navlinks: NavLink[] = [
  { name: "Fonctionnalités", href: "/functions" },
  { name: "Tarifs", href: "/price" },
  // { name: "À propos", href: "/about" },
  // { name: "Blog", href: "/blog" },
  // { name: "Métiers", href: "/jobs" },
  { name: "Contact", href: "/contact" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isPopupOpen, openPopup, closePopup } = useDevPopup();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Correction du typage avec React.FC et l'interface NavComponentProps
  const MobileNav: React.FC<NavComponentProps> = ({ links, toggleMenu }) => {
    return (
      <div className="flex flex-col w-full">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="w-4/5 self-center text-white text-lg border-b border-opacity-25 border-white pb-4 px-2 mt-4 hover:text-[#B157FF]"
            onClick={toggleMenu}
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  };

  // Même chose pour DesktopNav - toggleMenu est optionnel ici
  const DesktopNav: React.FC<NavComponentProps> = ({ links }) => {
    return (
      <div className="flex flex-row w-auto">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-white text-sm lg:text-base px-3 lg:px-4 hover:text-[#B157FF] whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-40 ${menuOpen ? "navbar-gradient" : ""} md:bg-[#170628] backdrop-blur-md bg-opacity-95`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight transition-colors"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="w-24 md:w-28 lg:w-32"
            />
          </Link>

          {/* Hamburger pour mobile */}
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-md transition md:hidden"
          >
            <span
              className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1 transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          {/* Navigation principale */}
          <div
            className={`
              flex-col md:flex-row items-center gap-6 md:gap-2 lg:gap-4 
              font-semibold text-white text-base 
              absolute md:static right-0 top-16 
              rounded-b-xl md:rounded-none 
              transition-all duration-300 ease-in-out
              w-full md:w-auto
              md:bg-transparent
              ${menuOpen ? "flex" : "hidden md:flex"}
              ${menuOpen ? "opacity-100" : "opacity-0 md:opacity-100"}
              ${menuOpen ? "translate-y-0" : "-translate-y-5 md:translate-y-0"}
            `}
          >
            <div className="block w-full md:hidden">
              <MobileNav links={navlinks} toggleMenu={toggleMenu} />
            </div>
            <div className="hidden md:block">
              <DesktopNav links={navlinks} />
            </div>

            {/* Bouton CTA - caché sur mobile, visible sur md+ */}
            <a
              href="#"
              onClick={openPopup}
              className="hidden md:block bg-[#B157FF] hover:bg-[#9a3ee2] text-white py-2 px-4 lg:px-6 rounded-full text-center ml-2 lg:ml-4 text-sm lg:text-base transition-colors"
            >
              Essayer Gratuitement
            </a>

            {/* Bouton CTA - visible sur mobile uniquement */}
            <div className="px-6 py-6 md:hidden w-full">
              <a
                href="#"
                onClick={openPopup}
                className="block bg-[#B157FF] text-white py-5 rounded-full text-center w-full"
              >
                Essayer Gratuitement
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Popup d'information "En développement" */}
      <DevPopup isOpen={isPopupOpen} onClose={closePopup} />
    </>
  );
}
