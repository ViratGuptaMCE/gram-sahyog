import React, { useState } from 'react';
import { Users } from 'lucide-react';

const LawyerAvatar = ({ src, alt, className = "", sizeClass = "h-8 w-8" }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#0B2545]/5 text-[#00B4D8] ${className}`}>
        <Users className={`${sizeClass} stroke-[1.2]`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover grayscale contrast-105 ${className}`}
      onError={() => setError(true)}
    />
  );
};

export default LawyerAvatar;
