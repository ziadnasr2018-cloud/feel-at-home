import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Heart,
  CheckCircle2,
  Train,
  Navigation,
  GraduationCap,
} from 'lucide-react';
import { Listing, CampusTarget } from '../types';
import { calculateLocationMatch } from '../services/locationMatch';

interface Props {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  targetCampus?: CampusTarget;
  userBudget?: number;
}

export const ListingCard: React.FC<Props> = ({
  listing,
  isSaved = false,
  onToggleSave,
  targetCampus,
  userBudget,
}) => {
  const [imgError, setImgError] = useState(false);

  const formatType = (type: string) => {
    switch (type) {
      case 'PRIVATE_APARTMENT':
        return 'Private Apartment';
      case 'PRIVATE_ROOM':
        return 'Private Room';
      case 'SHARED_APARTMENT':
        return 'Shared Flat';
      case 'SHARED_ROOM':
        return 'Shared Room (Bed)';
      default:
        return type;
    }
  };

  const defaultEgyptianInterior =
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80';

  const mainImage =
    !imgError && listing.images && listing.images.length > 0
      ? listing.images[0]
      : defaultEgyptianInterior;

  // Calculate location match score if target campus is present
  const matchResult = targetCampus
    ? calculateLocationMatch(listing, targetCampus, userBudget)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
          <img
            src={mainImage}
            alt={listing.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {listing.isDemo && (
              <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                Demo
              </span>
            )}

            {listing.isFamilyHomestay && (
              <span className="bg-amber-700/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-amber-500/50">
                🏡 Family Homestay • استضافة
              </span>
            )}

            {listing.verificationStatus === 'VERIFIED' ? (
              <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            ) : listing.verificationStatus === 'VERIFICATION_PENDING' ? (
              <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                Verification Pending
              </span>
            ) : (
              <span className="bg-stone-800/80 backdrop-blur-xs text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                Not Verified
              </span>
            )}
          </div>


          {/* Location Match Percentage Pill (Top-Right under heart) */}
          {matchResult && (
            <div
              className={`absolute top-11 right-3 px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-md backdrop-blur-xs flex items-center gap-1 border ${
                matchResult.matchPercentage >= 90
                  ? 'bg-emerald-600/95 text-white border-emerald-400'
                  : matchResult.matchPercentage >= 80
                  ? 'bg-amber-600/95 text-white border-amber-300'
                  : 'bg-stone-900/90 text-amber-300 border-stone-700'
              }`}
              title={`Match calculated based on distance to ${targetCampus?.shortName} and metro access`}
            >
              <span>{matchResult.matchPercentage}% Match</span>
            </div>
          )}

          {/* Availability Status (if rented) */}
          {listing.status === 'RENTED' && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Currently Rented
              </span>
            </div>
          )}

          {/* Favorite Toggle Button */}
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(listing.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs hover:bg-white rounded-full text-stone-700 shadow-sm transition active:scale-90 cursor-pointer"
              title={isSaved ? 'Remove from saved' : 'Save to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition ${
                  isSaved ? 'fill-red-500 text-red-500' : 'text-stone-600 hover:text-red-500'
                }`}
              />
            </button>
          )}

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-xs px-3 py-1 rounded-lg text-white shadow-xs">
            <span className="text-base font-bold tracking-tight">
              {listing.priceEgp.toLocaleString()}
            </span>
            <span className="text-xs text-stone-300 font-normal"> EGP / mo</span>
          </div>

          {/* Photo Count */}
          {listing.images && listing.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white">
              {listing.images.length} photos
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              {formatType(listing.accommodationType)}
            </span>
            <span className="text-stone-500 font-medium text-[11px]">
              {listing.isFurnished ? '• Furnished' : '• Unfurnished'}
            </span>
          </div>

          <Link to={`/listings/${listing.id}`} className="block group-hover:text-amber-800 transition">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
              {listing.title}
            </h3>
          </Link>

          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">
              {listing.neighborhood}, {listing.city} ({listing.governorate})
            </span>
          </p>

          {listing.isFamilyHomestay && (
            <div className="p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-1.5 font-medium">
              <span>💛</span>
              <span className="truncate">Egyptian Family Host • Welcomes Upper Egypt & Foreign Students</span>
            </div>
          )}

          {/* Location Match Details Line */}

          {matchResult && (
            <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-stone-700 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 font-medium text-amber-950 truncate">
                <Navigation className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="truncate">{matchResult.highlightText}</span>
              </span>
              <span className="text-stone-500 shrink-0 text-[10px] font-semibold">
                {matchResult.commuteEstimate.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]">
            <Bed className="w-3.5 h-3.5 text-stone-400" />
            {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Bath className="w-3.5 h-3.5 text-stone-400" />
            {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
          {listing.nearestMetro && (
            <span
              className="hidden sm:flex items-center gap-1 text-[10px] text-stone-500"
              title={listing.nearestMetro.name}
            >
              <Train className="w-3 h-3 text-red-600" />
              {listing.nearestMetro.walkingMinutes}m Metro
            </span>
          )}
        </div>

        <Link
          to={`/listings/${listing.id}`}
          className="font-semibold text-amber-700 hover:text-amber-800 text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition"
        >
          View &rarr;
        </Link>
      </div>
    </div>
  );
};
