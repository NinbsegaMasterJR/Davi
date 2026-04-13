import React from "react";

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d98a" />
          <stop offset="55%" stopColor="#d7644c" />
          <stop offset="100%" stopColor="#0d716b" />
        </linearGradient>
        <linearGradient id="brandCross" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f7fffc" />
          <stop offset="100%" stopColor="#f0d98a" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="55" fill="rgba(8,45,43,0.18)" />
      <path
        d="M60 13 C69 23, 73 31, 71 40 C69 48, 63 51, 63 58 C63 66, 68 70, 72 76
           C61 73, 52 65, 50 55 C47 40, 54 25, 60 13 Z"
        fill="url(#brandGlow)"
      />
      <path
        d="M60 31
           C76 31, 89 42, 89 58
           C89 80, 68 91, 60 100
           C52 91, 31 80, 31 58
           C31 42, 44 31, 60 31 Z"
        fill="#0b6a63"
      />
      <path
        d="M60 39
           C72 39, 81 47, 81 58
           C81 74, 66 83, 60 90
           C54 83, 39 74, 39 58
           C39 47, 48 39, 60 39 Z"
        fill="url(#brandGlow)"
      />
      <path
        d="M56 30 h8 v18 h16 v8 h-16 v28 h-8 v-28 h-16 v-8 h16 z"
        fill="url(#brandCross)"
      />
    </svg>
  );
};
