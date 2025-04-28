import { getProPublicProfile } from "../../../lib/pro";
import ProfilePublic from "@/app/components/Profile/ProfilePublic";

export const runtime = "nodejs";

type ProfilePublicPageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function ProfilePublicPage({
  params,
}: ProfilePublicPageProps) {
  const id = params.id;
  const profile = await getProPublicProfile(id);
  // Ensure user_id and profession are always present for Profile interface compatibility
  const profileWithUserId = {
    ...profile,
    id: id,
    profession: profile?.profession ?? "",
  };
  if (!profile) {
    return (
      <div
        style={{
          padding: 40,
          color: "#e00",
          fontWeight: "bold",
          fontSize: 20,
          maxWidth: 700,
          margin: "30px auto",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        Profil non trouvé pour l&apos;id :
        <span style={{ fontFamily: "monospace", fontSize: 16, color: "#e00" }}>
          {id}
        </span>
        <br />
        <span style={{ color: "#e00", fontWeight: 700 }}>
          Vérifie que cet id existe bien dans la table <b>profiles</b> (colonne
          user_id ou id).
        </span>
      </div>
    );
  }
  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <ProfilePublic profile={profileWithUserId} />
    </div>
  );
}
