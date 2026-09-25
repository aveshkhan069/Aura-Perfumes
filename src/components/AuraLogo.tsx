/**
 * AuraLogo — reusable inline-SVG brand mark for AURA Perfumes.
 * Usage:  <AuraLogo size="sm" | "md" | "lg" />
 * The flame icon + wordmark renders crisply at any resolution.
 */
import React from 'react';

interface AuraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { flame: { w: 20, h: 26 }, text: 'text-lg', tagline: 'text-[7px]', gap: 'gap-2' },
  md: { flame: { w: 28, h: 36 }, text: 'text-[1.6rem]', tagline: 'text-[8px]', gap: 'gap-2.5' },
  lg: { flame: { w: 40, h: 52 }, text: 'text-4xl', tagline: 'text-[10px]', gap: 'gap-3.5' },
};

export const AuraLogo: React.FC<AuraLogoProps> = ({ size = 'md', className = '' }) => {
  const s = sizes[size];
  const gradId = `aFlame-${size}`;

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Flame mark */}
      <svg
        width={s.flame.w}
        height={s.flame.h}
        viewBox="0 0 28 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#f0e0c0" />
            <stop offset="55%"  stopColor="#c5a880" />
            <stop offset="100%" stopColor="#8a6d42" />
          </linearGradient>
        </defs>
        {/* Outer flame silhouette */}
        <path
          d="M14 1 C14 1 3 13 3 21 C3 28.2 7.9 33.5 14 35 C20.1 33.5 25 28.2 25 21 C25 13 14 1 14 1Z"
          fill={`url(#${gradId})`}
        />
        {/* Inner cutout for depth */}
        <path
          d="M14 9 C14 9 9.5 17 9.5 21.5 C9.5 24.5 11.4 26.5 14 27.5 C16.6 26.5 18.5 24.5 18.5 21.5 C18.5 17 14 9 14 9Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif-luxury ${s.text} tracking-[0.22em] font-semibold uppercase`}
          style={{ color: 'inherit' }}
        >
          AURA
        </span>
        <span
          className={`${s.tagline} tracking-[0.4em] uppercase font-sans mt-0.5 opacity-75`}
          style={{ color: '#c5a880' }}
        >
          PARFUMS DE LUXE
        </span>
      </div>
    </div>
  );
};
