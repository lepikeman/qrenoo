"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavigationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Masque la NavBar sur toutes les routes contenant /dashboard (pro/dashboard, dashboard, etc)
  const hideNav = pathname && pathname.includes("dashboard");
  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  );
}
