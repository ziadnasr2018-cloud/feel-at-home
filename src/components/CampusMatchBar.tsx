import React from 'react';
import { GraduationCap, Navigation, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { CampusTarget } from '../types';
import { GREATER_CAIRO_CAMPUSES } from '../services/locationMatch';

interface Props {
  selectedCampusId: string;
  onSelectCampus: (campusId: string) => void;
  userBudget?: number;
  onBudgetChange?: (budget: number | undefined) => void;
}

export const CampusMatchBar: React.FC<Props> = ({
  selectedCampusId,
  onSelectCampus,
  userBudget,
  onBudgetChange,
}) => {
  const currentCampus =
    GREATER_CAIRO_CAMPUSES.find((c) => c.id === selectedCampusId) ||
    GREATER_CAIRO_CAMPUSES[0];

  return (
    <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🎯 Location & Commute Match Calculator
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Where do you study or work in Greater Cairo?
          </h3>
          <p className="text-xs text-stone-300">
            Select your campus to automatically calculate commute times, Metro accessibility, and match percentages for every listing.
          </p>
        </div>

        {/* Selected Campus Pill */}
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
              Active Target
            </span>
            <span className="font-bold text-white">{currentCampus.shortName}</span>
            <span className="text-[11px] text-stone-400 block">{currentCampus.landmark}</span>
          </div>
        </div>
      </div>

      {/* Campus Selector Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
          Select Your University / Hub:
        </span>
        <div className="flex flex-wrap gap-2">
          {GREATER_CAIRO_CAMPUSES.map((campus) => {
            const isSelected = campus.id === selectedCampusId;
            return (
              <button
                key={campus.id}
                type="button"
                onClick={() => onSelectCampus(campus.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm ring-2 ring-white/50 scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <span>{campus.shortName}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Budget Sync */}
      {onBudgetChange && (
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="font-medium">My Student Monthly Budget:</span>
            <input
              type="number"
              placeholder="e.g. 4000"
              value={userBudget || ''}
              onChange={(e) =>
                onBudgetChange(e.target.value ? parseFloat(e.target.value) : undefined)
              }
              className="w-28 p-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-bold"
            />
            <span className="text-stone-400">EGP</span>
          </div>

          <span className="text-[11px] text-amber-200/90">
            ⚡ Listings are automatically re-scored based on transit + budget match!
          </span>
        </div>
      )}
    </div>
  );
};
