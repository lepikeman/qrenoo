"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function NavBar() {

  const [menuOpen, setMenuOpen] = useState(false);

 


  return (
    <nav className="bg-[#f6f8f2] border-b border-[#efe9db] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-2xl font-bold text-[#29381a] tracking-tight hover:text-[#405c26] transition-colors"
        >
          <Image src="/assets/logo.png" alt="Logo" width={100} height={100} />
        </Link>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          className="flex flex-col justify-center items-center w-10 h-10 rounded-md border border-[#ded9cb] bg-white hover:bg-[#ede9e0] transition md:hidden"
        >
          <span
            className={`block w-6 h-0.5 bg-[#29381a] mb-1 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-[#29381a] mb-1 ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-[#29381a] transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          ></span>
        </button>
        <div
          className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 font-semibold text-[#29381a] text-base absolute md:static right-0 top-16 bg-[#f6f8f2] md:bg-transparent shadow-md md:shadow-none rounded-b-xl md:rounded-none transition-all duration-200 w-full md:w-auto ${menuOpen ? "flex" : "hidden md:flex"}`}
        >
          <Link href="/jobs" className="hover:text-[#405c26] transition-colors">
            Métier
          </Link>
          <Link
            href="/price"
            className="hover:text-[#405c26] transition-colors"
          >
            Tarifs
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#405c26] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

/*
.navbar { position: sticky; top: 0; left: 0; right: 0; z-index: 20; background: #fff; box-shadow: 0 2px 8px #0001; }
.navbar-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 1.2em 1em; }
.navbar-logo { font-size: 1.7em; font-weight: 800; color: var(--primary); text-decoration: none; letter-spacing: 0.02em; }
.navbar-links { display: flex; gap: 1.2em; align-items: center; }
.navbar-link { background: none; border: none; color: var(--primary); font-weight: 600; font-size: 1em; cursor: pointer; padding: 0.6em 1.2em; border-radius: 6px; transition: background 0.2s, color 0.2s; text-decoration: none; }
.navbar-link:hover, .navbar-link:focus { background: var(--secondary); color: var(--accent); }
.navbar-link-register { background: var(--primary); color: #fff; }
.navbar-link-register:hover { background: var(--primary-hover); color: #fff; }
.navbar-hamburger { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; margin-left: 1em; }
.navbar-hamburger-bar { width: 26px; height: 3px; background: var(--primary); border-radius: 2px; display: block; }
@media (max-width: 800px) {
  .navbar-inner { flex-direction: row; padding: 1em 0.6em; }
  .navbar-links { position: absolute; top: 100%; right: 0; left: 0; background: #fff; flex-direction: column; align-items: stretch; gap: 0.7em; padding: 1em 0.5em; display: none; box-shadow: 0 2px 8px #0002; }
  .navbar-links-open { display: flex; }
  .navbar-hamburger { display: flex; }
}
*/
