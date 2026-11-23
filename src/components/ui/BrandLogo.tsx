import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  compact = false,
  onClick,
}) => {
  const content = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 select-none">
      <svg
        width={compact ? 24 : 26}
        height={compact ? 24 : 26}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx="8"
          fill="#1D1D1F"
        />
        <path
          d="M12 14.5V12.2C12 9.99086 13.7909 8.2 16 8.2C18.2091 8.2 20 9.99086 20 12.2"
          stroke="#FFFFFF"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <rect
          x="9.75"
          y="14.5"
          width="12.5"
          height="9.75"
          rx="2.5"
          fill="#FFFFFF"
        />
        <circle cx="16" cy="19.35" r="1.4" fill="#1D1D1F" />
      </svg>
      <span className="font-display font-semibold tracking-tight text-[#1D1D1F] text-base sm:text-lg">
        iUnlocker
      </span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] rounded-lg cursor-pointer"
        aria-label="iUnlocker Home"
      >
        {content}
      </button>
    );
  }

  return content;
};
