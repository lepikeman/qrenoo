import React from "react";
import Image from "next/image";

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt = "Photo de profil", size = 120 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {src ? (
      <Image src={src} alt={alt} width={size} height={size} style={{ objectFit: "cover" }} />
    ) : (
      <span style={{ color: "#aaa", fontSize: size / 3 }}>?</span>
    )}
  </div>
);

export default ProfileImage;
