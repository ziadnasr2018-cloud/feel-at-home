import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Lock,
  Flag,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const TrustSafety: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Our Core Promise & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Trust & Safe Stay Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          &ldquo;A home easy to find, safe to stay.&rdquo; We believe transparency is the foundation of student and young professional housing in Greater Cairo.
        </p>
      </div>

      {/* Official Safety Warning */}
      <div className="p-6 bg-amber-50 border-2 border-amber-400 rounded-3xl space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>The Golden Rule for Renting in Greater Cairo</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          Never transfer advance reservation deposits, key fees, or broker commissions via <strong>Vodafone Cash, InstaPay, or direct bank transfer</strong> before you or a trusted representative physically inspect the property and confirm the landlord&apos;s leasing authority.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Zero Fake Badges</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Many websites slap &quot;Verified&quot; stickers indiscriminately. At Feel at Home, any listing that hasn&apos;t undergone in-person property auditing is strictly marked as <strong>&quot;Not Verified Yet&quot;</strong>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <Flag className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Community Fraud Reporting</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every listing features an active &quot;Report&quot; button. If a provider demands upfront mobile money or misleading prices, reports are flagged to our moderation team immediately.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Responsible Boundaries</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We do not claim that software alone prevents all fraud. Instead, we empower tenants with checklists, direct landlord contact details, and verified university landmarks.
          </p>
        </div>
      </div>

      {/* Renter Checklist */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
        <h2 className="text-lg font-bold text-stone-900">
          Inspection Checklist Before Signing a Lease in Egypt:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Test Utilities:</strong> Turn on water taps, check gas pressure, test the water heater, and verify AC cooling.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Verify Lease Authority:</strong> Ask the host to show identification and confirm ownership or sublet rights.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Clarify Shared Bills:</strong> Ensure water, electricity, building maintenance (Bawwab), and internet costs are in writing.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Deposit Return Terms:</strong> Write clearly on the rental contract when and how the security deposit is refunded.</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <span>Browse Greater Cairo Housing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
