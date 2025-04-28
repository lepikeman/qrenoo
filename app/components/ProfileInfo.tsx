import React from "react";
import type { Profile } from "@/app/types/Profile";
import { FiPhone } from "react-icons/fi";

const ProfileInfo: React.FC<Partial<Profile>> = ({
  profession,
  specialite,
  bio,
  site_web,
  linkedin,
  adresse_postale,
  code_postal,
  ville,
  phone,
}) => (
  <div>
    <h1>{profession}</h1>
    {specialite && <h2>{specialite}</h2>}
    {bio && <div>{bio}</div>}
    {adresse_postale && (
      <div>
        <span>
          {adresse_postale}, {code_postal} {ville}
        </span>
      </div>
    )}
    {phone && (
      <div>
        <FiPhone />
        <span>{phone}</span>
      </div>
    )}
    <div>
      {site_web && (
        <a
          href={site_web}
          target="_blank"
          rel="noopener noreferrer"
        >
          Site web
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      )}
    </div>
  </div>
);

export default ProfileInfo;

/*
 * Styles (à placer dans globals.css ou un fichier dédié)
 *
 * .profile-card { max-width: 500px; margin: 0 auto; padding: 2rem; border-radius: 18px; background: #fff; box-shadow: 0 2px 16px #0001; }
 * .profile-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 0.2em; }
 * .profile-specialite { font-size: 1.2rem; color: var(--accent); margin-bottom: 0.7em; }
 * .profile-presentation { margin-bottom: 0.7em; font-size: 1.1em; }
 * .profile-bio { color: #666; margin-bottom: 0.7em; font-size: 1em; }
 * .profile-links { display: flex; flex-wrap: wrap; gap: 1em; margin-top: 1em; }
 * .profile-link { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 1.1em; transition: color 0.2s; }
 * .profile-link:hover { text-decoration: underline; color: var(--primary); }
 * @media (max-width: 600px) { .profile-card { padding: 1rem; } .profile-title { font-size: 1.5rem; } }
 */
