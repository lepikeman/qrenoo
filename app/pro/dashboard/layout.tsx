import RequireProfileComplete from "@/app/components/RequireProfileComplete";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Pas de <html> ni <body> ici !
  return (
    <RequireProfileComplete>
      {children}
    </RequireProfileComplete>
  );
}
