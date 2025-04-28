"use client";
import React from "react";
import type { Profile } from "@/app/types/Profile";
import { FiPhone, FiGlobe, FiMapPin } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import ProfileImage from "@/app/components/ProfileImage";
import Reservation from "../Reservation";

interface ProfilePublicProps {
  profile: Profile;
}

const ProfilePublic: React.FC<ProfilePublicProps> = ({ profile }) => {
  return (
    <main className="min-h-screen bg-[#f6f8f2] flex flex-col items-center px-2 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-12 w-full max-w-fit mx-auto">
        {/* Bloc infos pro à gauche, toute la hauteur */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3">
            <div className="text-base md:text-lg font-bold text-[#29381a] mb-2">
              Présentation
            </div>
            <div className="text-[#444] text-xs md:text-base whitespace-pre-line w-full flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4 mb-2">
                <ProfileImage src={profile.photoUrl} size={90} />
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold text-[#29381a]">
                    {profile.profession}
                  </h1>
                  {profile.specialite && (
                    <div className="text-[#6e7b4d] text-base md:text-lg font-semibold mt-1">
                      {profile.specialite}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#888] mt-1 text-xs md:text-base">
                    <FiMapPin />
                    <span>
                      {profile.ville}
                      {profile.code_postal ? `, ${profile.code_postal}` : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2 text-[#29381a] bg-[#f6f8f2] rounded-lg px-3 py-2 font-semibold hover:bg-[#e5e9e0] text-xs md:text-base"
                  >
                    <FiPhone /> {profile.phone}
                  </a>
                )}
                {profile.site_web && (
                  <a
                    href={profile.site_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#29381a] bg-[#f6f8f2] rounded-lg px-3 py-2 font-semibold hover:bg-[#e5e9e0] text-xs md:text-base"
                  >
                    <FiGlobe /> Site web
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#29381a] bg-[#f6f8f2] rounded-lg px-3 py-2 font-semibold hover:bg-[#e5e9e0] text-xs md:text-base"
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
              </div>
              <div className="text-xs text-[#888]">
                {profile.adresse_postale}
              </div>
              <div className="text-xs text-[#405c26] font-medium">
                <span>Horaires d&apos;ouverture :</span>
                <table className="mt-1 w-full text-left">
                  <tbody>
                    {[
                      { label: "Lundi", key: "lundi" },
                      { label: "Mardi", key: "mardi" },
                      { label: "Mercredi", key: "mercredi" },
                      { label: "Jeudi", key: "jeudi" },
                      { label: "Vendredi", key: "vendredi" },
                      { label: "Samedi", key: "samedi" },
                      { label: "Dimanche", key: "dimanche" },
                    ].map(({ label, key }) => {
                      const horaires = profile.horaires_jours?.[key];
                      return (
                        <tr key={key}>
                          <td className="pr-2 py-0.5 font-semibold">{label}</td>
                          <td className="py-0.5">
                            {horaires === null
                              ? "Fermé"
                              : horaires &&
                                  horaires.ouverture &&
                                  horaires.fermeture
                                ? `${horaires.ouverture} - ${horaires.fermeture} (${Number(horaires.intervalle_creneau) || Number(profile.intervalle_creneau) || 30} min)`
                                : "Fermé"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-[#444] text-xs md:text-base whitespace-pre-line">
                {profile.bio ||
                  "Ce professionnel n'a pas encore renseigné de biographie."}
              </div>
            </div>
          </section>
        </div>
        {/* Bloc réservation à droite, toute la hauteur */}
        <div className="flex-1 flex flex-col md:w-[100%]">
          <section className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 h-full min-h-[600px]">
            <h2 className="text-lg md:text-2xl font-bold text-[#29381a] mb-4 text-center">
              Réservez votre créneau
            </h2>
            <Reservation
              proId={profile.id || profile.user_id || profile.pro_id}
              horaires_jours={profile.horaires_jours}
              intervalle_creneau={
                typeof profile.intervalle_creneau === "number"
                  ? profile.intervalle_creneau
                  : undefined
              }
            />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePublic;
