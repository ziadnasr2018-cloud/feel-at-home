import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { VerificationStatus } from '../types';

interface Props {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<Props> = ({
  status,
  size = 'sm',
  showLabel = true,
  className = '',
}) => {
  if (status === 'VERIFIED') {
    return (
      <span
        title="Verified Account: Identity, Egyptian National ID / Passport, or University Enrollment verified."
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : size === 'md'
            ? 'px-2.5 py-1 text-xs'
            : 'px-3 py-1.5 text-sm'
        } ${className}`}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        {showLabel && <span>Verified Account</span>}
      </span>
    );
  }

  if (status === 'VERIFICATION_PENDING') {
    return (
      <span
        title="Verification Pending: National ID or Student Proof submitted, currently under review."
        className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : size === 'md'
            ? 'px-2.5 py-1 text-xs'
            : 'px-3 py-1.5 text-sm'
        } ${className}`}
      >
        <Clock className={size === 'sm' ? 'w-3 h-3 text-amber-700 animate-spin-slow' : 'w-4 h-4 text-amber-700'} />
        {showLabel && <span>Verification Pending</span>}
      </span>
    );
  }

  // NOT_VERIFIED
  return (
    <span
      title="Not Verified: Standard user account. Always inspect premises in person before paying deposits."
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-stone-100 text-stone-600 border border-stone-200 shadow-2xs ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : size === 'md'
          ? 'px-2.5 py-1 text-xs'
          : 'px-3 py-1.5 text-sm'
      } ${className}`}
    >
      <ShieldAlert className={size === 'sm' ? 'w-3 h-3 text-stone-400' : 'w-4 h-4 text-stone-400'} />
      {showLabel && <span>Not Verified</span>}
    </span>
  );
};
