import React, { useState } from 'react';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'neon' | 'blue' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ...rest
}) => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const sizeVal = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - sizeVal / 2;
    const y = e.clientY - rect.top - sizeVal / 2;

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-2), { id, x, y, size: sizeVal }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== id));
    }, 550);

    onClick?.(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[42px]',
    lg: 'px-7 py-3.5 text-base min-h-[52px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#1D1D1F] text-white border border-[#1D1D1F] hover:opacity-90',
    neon: 'bg-[#1D1D1F] text-white border border-[#1D1D1F] hover:opacity-90',
    blue: 'bg-[#1D1D1F] text-white border border-[#1D1D1F] hover:opacity-90',
    secondary:
      'bg-white text-[#1D1D1F] border border-[#D2D2D7] hover:bg-[#F5F5F7]',
    ghost:
      'bg-transparent text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-transparent',
    danger:
      'bg-[#FFF2F2] text-[#B3261E] border border-[#E5B8B8] hover:bg-[#FFE6E6]',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.985] ${sizeClasses} ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
          className="pointer-events-none absolute rounded-full bg-current animate-ripple"
        />
      ))}
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          <span>Checking…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
