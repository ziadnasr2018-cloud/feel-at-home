import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Check,
  Phone,
  Mail,
  Send,
  Heart,
  Flag,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Train,
  Navigation,
  Compass,
} from 'lucide-react';
import { storage } from '../services/storage';
import { Listing, CampusTarget } from '../types';
import { TrustNotice } from '../components/TrustNotice';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';
import { GoogleMapsExplorer } from '../components/GoogleMapsExplorer';
import { GREATER_CAIRO_CAMPUSES, calculateLocationMatch } from '../services/locationMatch';
import { FamilyAdoptionModal } from '../components/FamilyAdoptionModal';
import { VerificationBadge } from '../components/VerificationBadge';

export const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);

  // Target Campus State for Commute Matching
  const [selectedCampusId, setSelectedCampusId] = useState<string>(storage.getTargetCampusId());

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState(user?.fullName || '');
  const [inquiryPhone, setInquiryPhone] = useState(user?.phoneNumber || '');
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || '');
  const [inquiryMsg, setInquiryMsg] = useState(
    'Hello! I am an Egyptian university student interested in this accommodation and would like to schedule an in-person viewing. Please let me know your availability.'
  );
  const [moveInDate, setMoveInDate] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = storage.getListingById(id);
    if (found) {
      setListing(found);
      setActiveImageIndex(0);
      if (user) {
        const saved = storage.getSavedListingIds(user.id);
        setIsSaved(saved.includes(id));
      }
    }
  }, [id, user]);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Listing Not Found</h2>
        <p className="text-xs text-stone-500">
          This property might have been removed or the link is invalid.
        </p>
        <Link
          to="/listings"
          className="inline-block px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Housing Discovery
        </Link>
      </div>
    );
  }

  const activeCampus =
    GREATER_CAIRO_CAMPUSES.find((c) => c.id === selectedCampusId) ||
    GREATER_CAIRO_CAMPUSES[0];

  const matchResult = calculateLocationMatch(listing, activeCampus);

  const handleToggleFavorite = () => {
    if (!user) {
      alert('Please log in to save favorites.');
      return;
    }
    const saved = storage.toggleSaveListing(user.id, listing.id);
    setIsSaved(saved);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    storage.createInquiry({
      listingId: listing.id,
      listingTitle: listing.title,
      listingLocation: `${listing.neighborhood}, ${listing.city}`,
      seekerId: user ? user.id : 'guest-seeker',
      providerId: listing.userId,
      name: inquiryName,
      phone: inquiryPhone,
      email: inquiryEmail,
      message: inquiryMsg,
      moveInDate,
    });

    setInquirySent(true);
  };

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
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80';

  const images = listing.images && listing.images.length > 0 ? listing.images : [defaultEgyptianInterior];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isSaved
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            {isSaved ? 'Saved to Favorites' : 'Save Property'}
          </button>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-red-50 hover:text-red-700 text-stone-500 text-xs font-medium transition cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" /> Report
          </button>
        </div>
      </div>

      {/* Main Listing Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900">
              {formatType(listing.accommodationType)}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-stone-100 text-stone-700">
              {listing.isFurnished ? 'Furnished' : 'Unfurnished'}
            </span>
            {listing.isFamilyHomestay && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-700 text-white shadow-xs flex items-center gap-1">
                🏡 Egyptian Family Homestay
              </span>
            )}
            <VerificationBadge status={listing.verificationStatus} size="sm" />
            {listing.isDemo && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900 text-white uppercase tracking-wider">
                Demo Listing
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-snug">
            {listing.title}
          </h1>

          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {listing.address}, {listing.neighborhood}, {listing.city} ({listing.governorate} Governorate)
            </span>
          </p>
        </div>


        {/* Price & Match Score Card */}
        <div className="bg-stone-900 text-white p-5 rounded-3xl md:text-right shrink-0 space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {listing.priceEgp.toLocaleString()} <span className="text-xs font-normal text-stone-400">EGP / month</span>
          </div>
          {listing.depositEgp && (
            <p className="text-[11px] text-stone-300">
              Security Deposit: {listing.depositEgp.toLocaleString()} EGP (Refundable)
            </p>
          )}

          {/* Location Match Score Pill */}
          <div className="pt-1 flex items-center justify-end gap-2">
            <div className="px-3 py-1 bg-amber-500 text-stone-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{matchResult.matchPercentage}% Match for {activeCampus.shortName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Selector Bar for Instant Re-Calculation */}
      <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-bold text-amber-950">
            Calculate Commute to Your Campus:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCampusId}
            onChange={(e) => {
              setSelectedCampusId(e.target.value);
              storage.setTargetCampusId(e.target.value);
            }}
            className="p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none"
          >
            {GREATER_CAIRO_CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Egyptian Family Host & Student Adoption Showcase Box */}
      {listing.isFamilyHomestay && listing.familyHostDetails && (
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-500/30 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Egyptian Family Host & Mentorship Program • برنامج الاستضافة والتبني الأسري</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Hosted by {listing.familyHostDetails.familyName}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "{listing.familyHostDetails.familyMembersOverview}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAdoptionModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-98 whitespace-nowrap cursor-pointer flex items-center gap-2 self-start md:self-center"
            >
              <span>Apply for Family Homestay / Adoption</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Home Meals Included
              </span>
              <p className="font-semibold text-white">
                {listing.familyHostDetails.mealsProvided === 'ALL_MEALS'
                  ? '3 Daily Home Meals'
                  : listing.familyHostDetails.mealsProvided === 'BREAKFAST_AND_DINNER'
                  ? 'Fresh Breakfast & Egyptian Home Dinner'
                  : 'Daily Family Dinner'}
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Welcoming Students
              </span>
              <p className="font-semibold text-white">
                Upper Egypt (طلاب الصعيد) & International (وافدون)
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Family Care & Mentorship
              </span>
              <p className="font-semibold text-white">
                {listing.familyHostDetails.languagesSpoken.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Trust & Safe Stay Banner */}
      <TrustNotice verificationStatus={listing.verificationStatus} />

      {/* Photo Gallery with Egyptian Theme */}
      <div className="space-y-3">
        <div className="aspect-[16/9] sm:aspect-[21/9] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 relative shadow-sm">
          <img
            src={
              imgError[activeImageIndex]
                ? defaultEgyptianInterior
                : images[activeImageIndex] || defaultEgyptianInterior
            }
            alt={listing.title}
            onError={() => setImgError((prev) => ({ ...prev, [activeImageIndex]: true }))}
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-600 scale-95 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgError[idx] ? defaultEgyptianInterior : img}
                  alt=""
                  onError={() => setImgError((prev) => ({ ...prev, [idx]: true }))}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Google Maps Transit Explorer */}
      <GoogleMapsExplorer listing={listing} targetCampus={activeCampus} />

      {/* Content Columns: Details on Left, Contact/Inquiry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Key Quick Attributes */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-stone-200 text-center">
            <div className="p-2">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                Bedrooms
              </span>
              <p className="text-base font-bold text-stone-900 flex items-center justify-center gap-1.5 mt-0.5">
                <Bed className="w-4 h-4 text-amber-700" /> {listing.bedrooms} Room{listing.bedrooms > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 border-x border-stone-100">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                Bathrooms
              </span>
              <p className="text-base font-bold text-stone-900 flex items-center justify-center gap-1.5 mt-0.5">
                <Bath className="w-4 h-4 text-amber-700" /> {listing.bathrooms} Bath{listing.bathrooms > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                Furnished
              </span>
              <p className="text-base font-bold text-stone-900 mt-0.5">
                {listing.isFurnished ? 'Fully Furnished' : 'Unfurnished'}
              </p>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-stone-900">About This Student Accommodation</h2>
            <div className="p-5 bg-white rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          {/* Facilities & Amenities */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-stone-900">Amenities & Housing Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {listing.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-800"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Universities & Public Transit */}
          {listing.nearbyLandmarks && listing.nearbyLandmarks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-stone-900">Transit & Academic Landmarks</h2>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                {listing.nearbyLandmarks.map((lm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{lm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {listing.rules && listing.rules.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-stone-900">House Rules & Terms</h2>
              <ul className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-700">
                {listing.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar: Host Card & Inquiry Form */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            {/* Host Profile Header */}
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Listed By Property Provider
              </span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold text-base flex items-center justify-center shrink-0">
                  {listing.user.fullName.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-stone-900 text-sm">{listing.user.fullName}</h3>
                    <VerificationBadge
                      status={listing.user.verificationStatus || listing.verificationStatus || 'NOT_VERIFIED'}
                      size="sm"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Host since {new Date(listing.user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

            </div>

            {/* Direct Contact Phone & Email */}
            <div className="p-3 bg-stone-50 rounded-2xl space-y-2 text-xs text-stone-700 border border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-700" /> Phone:
                </span>
                <a
                  href={`tel:${listing.user.phoneNumber}`}
                  className="font-bold text-stone-900 hover:text-amber-700"
                >
                  {listing.user.phoneNumber}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-700" /> Email:
                </span>
                <span className="font-semibold text-stone-900 truncate max-w-[150px]">
                  {listing.user.email}
                </span>
              </div>
            </div>

            {/* Direct In-App Inquiry Form */}
            {inquirySent ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Inquiry Sent Successfully</h4>
                <p className="text-xs text-emerald-700">
                  Your message has been forwarded to {listing.user.fullName}. You can review sent messages in your dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setInquirySent(false)}
                  className="text-xs text-emerald-800 underline font-medium mt-1 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 pt-1">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Request an In-Person Viewing
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Sarah Adel"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+20 10..."
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Move-in Date
                    </label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Inquiry to Host
                </button>
              </form>
            )}

            {/* Safety Warning in Host Card */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-tight">
              🔒 <strong>In-Person Rule:</strong> Inspect the property key, water/gas connections, and sign a paper lease before paying any deposit.
            </div>
          </div>
        </aside>
      </div>

      <FamilyAdoptionModal
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
        listing={listing}
        currentUser={user}
        onSuccess={() => {
          setIsAdoptionModalOpen(false);
          alert('Your family homestay application has been successfully submitted! The host family will contact you.');
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </div>
  );
};

