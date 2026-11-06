import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '../types';

interface Props {
  verificationStatus: VerificationStatus;
  compact?: boolean;
}

export const TrustNotice: React.FC<Props> = ({ verificationStatus, compact = false }) => {
  return (
    <div className="space-y-3">
      {/* Verification Badge */}
      <div className="flex flex-wrap items-center gap-2">
        {verificationStatus === 'VERIFIED' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Physically Verified Property
          </span>
        ) : verificationStatus === 'VERIFICATION_PENDING' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Verification Documents Under Review
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
            Not Verified Yet — Exercise Standard Due Diligence
          </span>
        )}

        <span className="text-[11px] text-stone-500">
          Feel at Home never auto-verifies listings without physical inspection.
        </span>
      </div>

      {!compact && (
        <div className="p-4 bg-amber-50/80 border-l-4 border-amber-600 rounded-r-xl text-amber-950 text-xs leading-relaxed space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Official Safe Stay Rule (Greater Cairo):
          </div>
          <p className="text-stone-700 text-xs">
            Do <strong className="font-semibold text-stone-900">not</strong> transfer reservation deposits, down payments, or broker fees via <strong>Vodafone Cash, InstaPay, or wire transfer</strong> prior to in-person viewing of the premises and contract verification. Feel at Home provides free discovery and never asks for cash transfers.
          </p>
        </div>
      )}
    </div>
  );
};
