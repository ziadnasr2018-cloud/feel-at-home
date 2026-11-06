import React, { useState } from 'react';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  X,
  Globe2,
  Heart,
} from 'lucide-react';
import { RoommateProfile } from '../types';
import { VerificationBadge } from './VerificationBadge';

interface Props {
  profile: RoommateProfile;
}

export const RoommateCard: React.FC<Props> = ({ profile }) => {
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(profile.contactPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-stone-900 text-base">{profile.displayName}</h3>
              {profile.gender && (
                <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                  {profile.gender}
                </span>
              )}
              <VerificationBadge status={profile.verificationStatus || 'NOT_VERIFIED'} size="sm" />
            </div>
            {profile.age && <p className="text-xs text-stone-500">{profile.age} years old</p>}
          </div>

          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold rounded-full shrink-0">
            Roommate Seeker
          </span>
        </div>

        {/* Origin / Special Student Category Pill */}
        {profile.originCategory === 'UPPER_EGYPT' && (
          <div className="p-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-200/80 text-[11px] flex items-center justify-between font-semibold">
            <span>🌾 Upper Egypt Student (طالب من الصعيد)</span>
            <span className="text-[10px] text-amber-800 font-normal">{profile.originLocation}</span>
          </div>
        )}

        {profile.originCategory === 'INTERNATIONAL' && (
          <div className="p-2 rounded-xl bg-sky-50 text-sky-950 border border-sky-200/80 text-[11px] flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5 text-sky-600" /> International Student (طالب وافد)</span>
            <span className="text-[10px] text-sky-800 font-normal">{profile.originLocation}</span>
          </div>
        )}

        {profile.isInterestedInFamilyHomestay && (
          <div className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-950 border border-orange-200/70 text-[10px] flex items-center gap-1.5 font-medium">
            <Heart className="w-3 h-3 text-orange-600 fill-orange-600 shrink-0" />
            <span>Interested in Egyptian Family Homestay or Flat Sharing</span>
          </div>
        )}


        {/* Occupation / College */}
        <div className="p-2.5 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="font-medium text-stone-900">{profile.occupationOrUni}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Target Area: <strong className="font-semibold text-stone-800">{profile.preferredArea}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Budget: <strong className="font-semibold text-stone-900">{profile.budgetEgp.toLocaleString()} EGP</strong> / mo</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Move-in: <strong className="font-medium">{profile.targetMoveInDate}</strong></span>
          </div>
        </div>

        {/* Bio */}
        <div className="text-xs text-stone-600 italic leading-relaxed bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/60">
          "{profile.bio}"
        </div>

        {/* Lifestyle Tags */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Living Preferences
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
              🕒 {profile.lifestyleHabits.sleepSchedule}
            </span>
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
              ✨ {profile.lifestyleHabits.cleanliness}
            </span>
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
              🚭 {profile.lifestyleHabits.smoking}
            </span>
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
              👥 {profile.lifestyleHabits.guests}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">
          {profile.governorate}
        </span>

        <button
          onClick={() => setShowContact(true)}
          className="text-xs bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-medium px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" /> Connect
        </button>
      </div>

      {/* Connect Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h4 className="font-bold text-stone-900 text-base">
                Connect with {profile.displayName}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Reach out to discuss shared accommodation in Greater Cairo.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-700" /> Phone:
                </span>
                <span className="font-semibold text-stone-900">{profile.contactPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-700" /> Email:
                </span>
                <span className="font-semibold text-stone-900 truncate max-w-[170px]">
                  {profile.contactEmail}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 text-amber-900 text-[11px] rounded-lg border border-amber-200 leading-relaxed">
              ⚠️ <strong>Safety reminder:</strong> Always meet potential flatmates in public areas (campus cafeteria, cafe near the apartment) before committing to a lease.
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyPhone}
                className="flex-1 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition"
              >
                {copied ? 'Copied Number!' : 'Copy Phone'}
              </button>
              <a
                href={`tel:${profile.contactPhone}`}
                className="flex-1 py-2 text-xs font-semibold text-center bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
              >
                Call Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
