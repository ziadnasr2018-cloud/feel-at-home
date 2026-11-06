import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  X,
  Compass,
  GraduationCap,
  Train,
  UtensilsCrossed,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { storage } from '../services/storage';
import { Listing, FilterOptions, CampusTarget } from '../types';
import { ListingCard } from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';
import { parseNaturalLanguageSearch } from '../services/gemini';
import { GREATER_CAIRO_CAMPUSES } from '../services/locationMatch';
import { CampusMatchBar } from '../components/CampusMatchBar';

export const ExploreListings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Target Campus state for location matching
  const [selectedCampusId, setSelectedCampusId] = useState<string>(
    searchParams.get('campus') || storage.getTargetCampusId()
  );

  // Filters state
  const [governorate, setGovernorate] = useState(searchParams.get('governorate') || 'ALL');
  const [city, setCity] = useState(searchParams.get('city') || 'ALL');
  const [type, setType] = useState(searchParams.get('type') || 'ALL');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'ALL');
  const [isFurnished, setIsFurnished] = useState(searchParams.get('isFurnished') || 'ALL');
  const [amenity, setAmenity] = useState(searchParams.get('amenity') || 'ALL');
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [sort, setSort] = useState<'match_desc' | 'newest' | 'price_asc' | 'price_desc'>('match_desc');
  const [familyHomestayOnly, setFamilyHomestayOnly] = useState<boolean>(searchParams.get('homestay') === 'true');
  const [verificationFilter, setVerificationFilter] = useState<string>(searchParams.get('verified') || 'ALL');

  const [listings, setListings] = useState<Listing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const activeCampus =
    GREATER_CAIRO_CAMPUSES.find((c) => c.id === selectedCampusId) ||
    GREATER_CAIRO_CAMPUSES[0];

  const handleSelectCampus = (campusId: string) => {
    setSelectedCampusId(campusId);
    storage.setTargetCampusId(campusId);
  };

  useEffect(() => {
    const govParam = searchParams.get('governorate');
    if (govParam) setGovernorate(govParam);

    const qParam = searchParams.get('query');
    if (qParam !== null) setQuery(qParam);

    const typeParam = searchParams.get('type');
    if (typeParam) setType(typeParam);

    const maxParam = searchParams.get('maxPrice');
    if (maxParam) setMaxPrice(maxParam);

    const campParam = searchParams.get('campus');
    if (campParam) setSelectedCampusId(campParam);

    const homeParam = searchParams.get('homestay');
    if (homeParam !== null) setFamilyHomestayOnly(homeParam === 'true');

    const verParam = searchParams.get('verified');
    if (verParam) setVerificationFilter(verParam);
  }, [searchParams]);

  const loadListings = () => {
    const filters: FilterOptions = {
      governorate,
      city,
      type,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bedrooms,
      isFurnished,
      amenity,
      query,
      sort,
      targetCampusId: selectedCampusId,
      familyHomestayOnly,
      verificationFilter,
    };
    const results = storage.getListings(filters);
    setListings(results);

    if (user) {
      setSavedIds(storage.getSavedListingIds(user.id));
    }
  };

  useEffect(() => {
    loadListings();
  }, [
    governorate,
    city,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    isFurnished,
    amenity,
    query,
    sort,
    selectedCampusId,
    familyHomestayOnly,
    verificationFilter,
    user,
  ]);

  const handleToggleSave = (id: string) => {
    if (!user) {
      alert('Please sign in or select a demo account to save favorites.');
      return;
    }
    const isNowSaved = storage.toggleSaveListing(user.id, id);
    if (isNowSaved) {
      setSavedIds((prev) => [...prev, id]);
    } else {
      setSavedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const resetFilters = () => {
    setGovernorate('ALL');
    setCity('ALL');
    setType('ALL');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('ALL');
    setIsFurnished('ALL');
    setAmenity('ALL');
    setQuery('');
    setSort('match_desc');
    setFamilyHomestayOnly(false);
    setVerificationFilter('ALL');
    setSearchParams({});
  };

  const handleAiSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiProcessing(true);
    try {
      const parsed = await parseNaturalLanguageSearch(aiPrompt);
      if (parsed.governorate) setGovernorate(parsed.governorate);
      if (parsed.type) setType(parsed.type);
      if (parsed.maxPrice) setMaxPrice(parsed.maxPrice.toString());
      setQuery(aiPrompt);
      setAiSearchActive(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const commonAmenities = [
    'High-speed WiFi',
    'Air Conditioning',
    'Near Metro Station',
    'Natural Gas',
    'Washing Machine',
    'Building Security',
    'Elevator',
    'Quiet Study Area',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Location & Campus Commute Matching Calculator Bar */}
      <CampusMatchBar
        selectedCampusId={selectedCampusId}
        onSelectCampus={handleSelectCampus}
        userBudget={maxPrice ? parseFloat(maxPrice) : undefined}
        onBudgetChange={(b) => setMaxPrice(b ? b.toString() : '')}
      />

      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Accommodations Ranked for {activeCampus.shortName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Matching calculated via distance, Metro accessibility, and budget.
          </p>
        </div>

        {/* AI Natural Language Search Affordance */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAiSearchActive(!aiSearchActive)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Natural Language Search
          </button>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* AI Smart Search Assistant Box */}
      {aiSearchActive && (
        <form
          onSubmit={handleAiSmartSearch}
          className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Natural Language Housing Assistant
            </span>
            <button
              type="button"
              onClick={() => setAiSearchActive(false)}
              className="text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-stone-600">
            Type how you talk in real life, e.g.: &ldquo;I need a furnished room in Dokki near Cairo University under 4,000 EGP&rdquo; or &ldquo;Shared bed near Shubra El-Kheima metro station&rdquo;.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Furnished room in Dokki under 4000 EGP near Metro"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isAiProcessing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
            >
              {isAiProcessing ? 'Analyzing...' : 'Apply Search'}
            </button>
          </div>
        </form>
      )}

      {/* Text Keyword Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by neighborhood (Dokki, Nasr City, Shubra), street, or university..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Category & Safety Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setFamilyHomestayOnly(false);
            setVerificationFilter('ALL');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            !familyHomestayOnly && verificationFilter === 'ALL'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Home className="w-3.5 h-3.5" /> All Accommodations
        </button>

        <button
          type="button"
          onClick={() => setFamilyHomestayOnly(!familyHomestayOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            familyHomestayOnly
              ? 'bg-amber-700 text-white shadow-xs ring-2 ring-amber-500/30'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
          <span>🏡 Egyptian Family Homestays (استضافة أسرية)</span>
          <span className="text-[10px] bg-amber-900/20 px-1.5 py-0.2 rounded-full">
            Upper Egypt & Foreign Students
          </span>
        </button>

        <button
          type="button"
          onClick={() => setVerificationFilter(verificationFilter === 'VERIFIED' ? 'ALL' : 'VERIFIED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            verificationFilter === 'VERIFIED'
              ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Hosts Only (موثّق فقط)</span>
        </button>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block bg-white p-5 rounded-2xl border border-stone-200 space-y-5 sticky top-24 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" /> Filter Options
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Family Homestay Program Toggle */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={familyHomestayOnly}
                onChange={(e) => setFamilyHomestayOnly(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-amber-900">
                🏡 Egyptian Family Homestays (استضافة أسرية)
              </span>
            </label>
            <p className="text-[10px] text-amber-800 leading-tight">
              Includes home-cooked Egyptian meals (breakfast & dinner) & family guidance for Upper Egypt and international scholars.
            </p>
          </div>

          {/* Host Verification Status */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Host Verification Status
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified Only (موثّق رسمياً)</option>
              <option value="VERIFICATION_PENDING">Pending Review (قيد الفحص)</option>
            </select>
          </div>

          {/* Governorate */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Governorate</label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Greater Cairo</option>
              <option value="Cairo">Cairo Governorate</option>
              <option value="Giza">Giza Governorate</option>
              <option value="Qalyubia">Qalyubia Governorate</option>
            </select>
          </div>

          {/* Accommodation Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Housing Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Housing Types</option>
              <option value="PRIVATE_ROOM">Private Room</option>
              <option value="PRIVATE_APARTMENT">Private Apartment</option>
              <option value="SHARED_APARTMENT">Shared Apartment</option>
              <option value="SHARED_ROOM">Shared Room (Bed)</option>
            </select>
          </div>

          {/* Monthly Budget (EGP) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Price Range (EGP / mo)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="ALL">Any Bedroom Count</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Furnishing</label>
            <select
              value={isFurnished}
              onChange={(e) => setIsFurnished(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="true">Furnished Only</option>
              <option value="false">Unfurnished Only</option>
            </select>
          </div>

          {/* Key Amenities */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Key Facility</label>
            <select
              value={amenity}
              onChange={(e) => setAmenity(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            >
              <option value="ALL">Any Amenities</option>
              {commonAmenities.map((am) => (
                <option key={am} value={am}>
                  {am}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Listings Display Column */}
        <main className="md:col-span-3 space-y-4">
          {/* Header Controls: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 text-xs">
            <span className="font-semibold text-stone-700">
              Showing <strong className="text-stone-900 font-bold">{listings.length}</strong> available properties in Greater Cairo
            </span>

            <div className="flex items-center gap-2">
              <span className="text-stone-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 font-bold focus:outline-none"
              >
                <option value="match_desc">🎯 Highest Campus Match %</option>
                <option value="newest">Newest Listed First</option>
                <option value="price_asc">Rent: Low to High</option>
                <option value="price_desc">Rent: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(governorate !== 'ALL' || type !== 'ALL' || maxPrice || query || isFurnished !== 'ALL' || amenity !== 'ALL' || familyHomestayOnly || verificationFilter !== 'ALL') && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-stone-400 font-medium mr-1">Active filters:</span>
              {familyHomestayOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  🏡 Egyptian Family Homestays (استضافة أسرية)
                  <button onClick={() => setFamilyHomestayOnly(false)} className="hover:text-red-500 font-bold ml-0.5">×</button>
                </span>
              )}
              {verificationFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                  🛡️ {verificationFilter === 'VERIFIED' ? 'Verified Hosts Only' : 'Pending Hosts'}
                  <button onClick={() => setVerificationFilter('ALL')} className="hover:text-red-500 font-bold ml-0.5">×</button>
                </span>
              )}
              {governorate !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Gov: {governorate}
                  <button onClick={() => setGovernorate('ALL')} className="hover:text-red-500">×</button>
                </span>
              )}
              {type !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Type: {type.replace('_', ' ')}
                  <button onClick={() => setType('ALL')} className="hover:text-red-500">×</button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Max: {Number(maxPrice).toLocaleString()} EGP
                  <button onClick={() => setMaxPrice('')} className="hover:text-red-500">×</button>
                </span>
              )}
              {query && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  &ldquo;{query}&rdquo;
                  <button onClick={() => setQuery('')} className="hover:text-red-500">×</button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-900 underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Grid or Empty State */}
          {listings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  No listings found matching your criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try broadening your budget in EGP, changing your governorate filter to &quot;All Greater Cairo&quot;, or selecting another destination campus.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={handleToggleSave}
                  targetCampus={activeCampus}
                  userBudget={maxPrice ? parseFloat(maxPrice) : undefined}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-bold text-stone-900 text-sm">Filter Listings</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Mobile Homestay Toggle */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={familyHomestayOnly}
                  onChange={(e) => setFamilyHomestayOnly(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span className="text-xs font-bold text-amber-900">
                  🏡 Egyptian Family Homestay
                </span>
              </label>
              <p className="text-[10px] text-amber-800">
                Home meals & mentorship for Upper Egypt and foreign students.
              </p>
            </div>

            {/* Mobile Verification Select */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Host Verification</label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border rounded-lg"
              >
                <option value="ALL">All Accounts</option>
                <option value="VERIFIED">Verified Hosts Only</option>
                <option value="VERIFICATION_PENDING">Pending Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Campus</label>
              <select
                value={selectedCampusId}
                onChange={(e) => handleSelectCampus(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border rounded-lg font-bold"
              >
                {GREATER_CAIRO_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName} ({c.governorate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Governorate</label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border rounded-lg"
              >
                <option value="ALL">All Greater Cairo</option>
                <option value="Cairo">Cairo</option>
                <option value="Giza">Giza</option>
                <option value="Qalyubia">Qalyubia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Max Price (EGP)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border rounded-lg"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
