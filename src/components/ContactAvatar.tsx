"use client";

import Image from "next/image";
import { useState } from "react";
import { UserCircle } from "lucide-react";

const primaryColorTextClass = "text-[#143c80]";
const lightBorderColorClass = "border-[#143c80]/20";
const lightestBgColorClass = "bg-[#143c80]/10";

interface ContactAvatarProps {
  src?: string;
  alt: string;
  name: string;
  size?: number;
}

const DEFAULT_AVATAR_SRC = "/images/avatars/default.png";

export default function ContactAvatar({
  src,
  alt,
  name,
  size = 128,
}: ContactAvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(src || DEFAULT_AVATAR_SRC);
  const [error, setError] = useState(!src);

  const handleError = () => {
    if (currentSrc !== DEFAULT_AVATAR_SRC) {
        setCurrentSrc(DEFAULT_AVATAR_SRC);
    } else {
        setError(true);
    }
  };

  if (error && currentSrc === DEFAULT_AVATAR_SRC) {
    return (
      <div
        className={`rounded-full mb-5 border-4 ${lightBorderColorClass} ${lightestBgColorClass} flex items-center justify-center shadow-md`}
        style={{ width: size, height: size }}
        title={name}
      >
        <UserCircle
          className={`${primaryColorTextClass}/60`}
          style={{ width: size * 0.7, height: size * 0.7 }}
        />
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full mb-5 border-4 ${lightBorderColorClass} shadow-md object-cover bg-gray-100`}
      onError={handleError}
      priority={false}
    />
  );
}