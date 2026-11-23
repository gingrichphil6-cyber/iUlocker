import React from 'react';
import { Check, Info, X } from 'lucide-react';

interface StatusBadgeProps {
  tone: 'pass' | 'fail' | 'info' | 'demo';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, label }) => {
  const styles = {
    pass: 'bg-[#1D1D1F] text-white border-[#1D1D1F]',
    fail: 'bg-[#FFF2F2] text-[#B3261E] border-[#E5B8B8]',
    info: 'bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]',
    demo: 'bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]',
  }[tone];

  const Icon = tone === 'pass' ? Check : tone === 'fail' ? X : Info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium tracking-tight whitespace-nowrap shrink-0 ${styles}`}
    >
      <Icon className="w-3 h-3 shrink-0 stroke-[2.5]" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
