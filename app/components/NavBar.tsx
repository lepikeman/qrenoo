"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const navlinks = [
  { name: "Fonctionnalités", href: "/functions" },
  { name: "Tarifs", href: "/price" },
  { name: "A propos", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Métiers", href: "/jobs" },
  { name: "Témoignages / Contact", href: "/contact" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`sticky top-0 z-50 ${menuOpen ? "navbar-gradient" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight transition-colors"
        >
          <Image src="/assets/logo.png" alt="Logo" width={120} height={120} />
        </Link>
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

        <div
          className={`
            flex-col md:flex-row items-center gap-6 md:gap-8 
            font-semibold text-white text-base 
            absolute md:static right-0 top-16 
            rounded-b-xl md:rounded-none 
            transition-all duration-300 ease-in-out
            w-full md:w-auto
            ${menuOpen ? "flex navbar-menu-open" : "hidden md:flex"}
            ${menuOpen ? "opacity-100" : "opacity-0 md:opacity-100"}
            ${menuOpen ? "translate-y-0" : "-translate-y-5 md:translate-y-0"}
          `}
        >
          <div className="flex flex-col md:flex-row w-full md:w-auto">
            {navlinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="w-4/5 self-center text-white text-lg md:text-base border-b md:border-0 border-opacity-25 border-white pb-4 md:pb-0 px-2 md:px-2 mt-4 md:mt-0 hover:text-purple-300 transition-colors"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="px-6 py-6 md:hidden w-full">
            <Link
              href="/signup"
              className="block bg-[#B157FF] text-white py-5 rounded-full text-center w-full"
              onClick={toggleMenu}
            >
              Essayer Gratuitement
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
