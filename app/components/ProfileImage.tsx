import React, { useState } from "react";

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = "Photo de profil",
  size = 120,
}) => {
  const [hasError, setHasError] = useState(false);
  const showFallback = hasError || !src;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showFallback ? (
        <span style={{ color: "#aaa", fontSize: size / 3 }}>?</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{ objectFit: "cover" }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default ProfileImage;
