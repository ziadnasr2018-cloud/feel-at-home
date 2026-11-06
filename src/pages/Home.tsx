import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Users,
  Home as HomeIcon,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Building,
  GraduationCap,
  ShieldAlert,
  Compass,
  UtensilsCrossed,
  Heart,
} from 'lucide-react';
import { storage } from '../services/storage';
import { Listing, RoommateProfile, CampusTarget } from '../types';
import { ListingCard } from '../components/ListingCard';
import { RoommateCard } from '../components/RoommateCard';
import { CampusMatchBar } from '../components/CampusMatchBar';
import { GREATER_CAIRO_CAMPUSES } from '../services/locationMatch';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [governorate, setGovernorate] = useState('ALL');
  const [accommodationType, setAccommodationType] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState<string>('cairo-univ');
  const selectedCampus: CampusTarget =
    GREATER_CAIRO_CAMPUSES.find((c) => c.id === selectedCampusId) ||
    GREATER_CAIRO_CAMPUSES[0];

  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [featuredRoommates, setFeaturedRoommates] = useState<RoommateProfile[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const all = storage.getListings();
    setFeaturedListings(all.slice(0, 4));

    const rms = storage.getRoommateProfiles();
    setFeaturedRoommates(rms.slice(0, 3));

    if (user) {
      setSavedIds(storage.getSavedListingIds(user.id));
    }
  }, [user]);

  const handleToggleSave = (id: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const isNowSaved = storage.toggleSaveListing(user.id, id);
    if (isNowSaved) {
      setSavedIds((prev) => [...prev, id]);
    } else {
      setSavedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (governorate !== 'ALL') params.append('governorate', governorate);
    if (accommodationType !== 'ALL') params.append('type', accommodationType);
    if (maxBudget) params.append('maxPrice', maxBudget);
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    navigate(`/listings?${params.toString()}`);
  };

  const cairoDistricts = [
    { name: 'Dokki & Mesaha', gov: 'Giza', desc: '5 mins to Cairo Univ & Metro Line 2', query: 'Dokki' },
    { name: 'Nasr City', gov: 'Cairo', desc: 'Close to Abbas El-Akkad & Al-Azhar', query: 'Nasr City' },
    { name: 'New Cairo', gov: 'Cairo', desc: 'Direct access to GUC & AUC campuses', query: 'New Cairo' },
    { name: 'Shubra El-Kheima', gov: 'Qalyubia', desc: 'Budget-friendly student hub by Metro', query: 'Shubra El-Kheima' },
    { name: 'Sheikh Zayed', gov: 'Giza', desc: 'Smart Village & modern compounds', query: 'Sheikh Zayed' },
    { name: 'Benha', gov: 'Qalyubia', desc: 'Benha University medicine & engineering', query: 'Benha' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-stone-50 to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-semibold shadow-xs">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            <span>Dedicated Housing Discovery for Greater Cairo Students & Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.15]">
            A home easy to find, <br />
            <span className="text-amber-700 font-black">safe to stay.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Moving to a new city shouldn&apos;t mean dealing with fake listings and unverified brokers.
            Feel at Home connects university students and relocating jobholders with verified rooms, private flats, and trustworthy roommates across Cairo, Giza, and Qalyubia.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-4 gap-3 text-left"
          >
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Governorate
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Greater Cairo</option>
                <option value="Cairo">Cairo (Nasr City, New Cairo, Maadi)</option>
                <option value="Giza">Giza (Dokki, Zayed, Mohandessin)</option>
                <option value="Qalyubia">Qalyubia (Shubra, Benha)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Housing Type
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Housing Options</option>
                <option value="PRIVATE_ROOM">Private Room</option>
                <option value="PRIVATE_APARTMENT">Private Apartment</option>
                <option value="SHARED_APARTMENT">Shared Apartment</option>
                <option value="SHARED_ROOM">Shared Room (Bed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Max Budget (EGP)
              </label>
              <input
                type="number"
                placeholder="e.g. 4000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition text-xs cursor-pointer"
              >
                <Search className="w-4 h-4" /> Find Accommodation
              </button>
            </div>
          </form>

          {/* Core Action Links */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-stone-600">
            <Link
              to="/listings"
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
            >
              Browse All Listings
            </Link>
            <Link
              to="/roommates"
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" /> Find a Roommate
            </Link>
            <Link
              to="/create-listing"
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
            >
              List Your Property Free
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Accommodation Listings & University Campus Match */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <CampusMatchBar
          selectedCampusId={selectedCampusId}
          onSelectCampus={setSelectedCampusId}
        />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Featured Opportunities & Match Scores
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Popular Housing in Greater Cairo
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Scored live by commute proximity, nearest Cairo Metro line, and student budget.
            </p>
          </div>

          <Link
            to={`/listings${selectedCampus ? `?campusId=${selectedCampus.id}` : ''}`}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            Explore all listings ({storage.getListings().length})
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              targetCampus={selectedCampus}
              isSaved={savedIds.includes(item.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      </section>

      {/* Egyptian Family Homestay & Adoption Program Showcase (برنامج الاستضافة والتبني الأسري) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-amber-800/40">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>برنامج الاستضافة والتبني الأسري للطلاب المغتربين والوافدين</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Live with a Loving Egyptian Family in Greater Cairo
              </h2>

              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Are you moving from Upper Egypt (طلاب صعيد مصر: أسيوط، سوهاج، قنا، أسوان) or arriving from abroad as an international student? You don&apos;t have to face Cairo alone. Our <strong>Egyptian Family Homestay & Adoption</strong> program pairs you with vetted, warm Cairo families who provide:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-base font-bold block text-amber-300">🍲 Home-Cooked Meals</span>
                  <p className="text-[11px] text-stone-300">
                    Traditional Egyptian breakfast & dinner (Mahshi, Molokhia, Baladi bread) with the host family.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-base font-bold block text-amber-300">🛡️ Family Protection & Mentorship</span>
                  <p className="text-[11px] text-stone-300">
                    Parental guidance, safe neighborhood advice, and a quiet, secure atmosphere to focus on studies.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-base font-bold block text-amber-300">🤝 Pre-Move Family Tea</span>
                  <p className="text-[11px] text-stone-300">
                    A traditional introductory tea session (&quot;قعدة تعارف&quot;) before any lease to ensure mutual peace of mind.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to="/listings?homestay=true"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Explore Egyptian Family Homestays (استعراض بيوت العائلات)
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
                >
                  Track Applications in Dashboard
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-700/80 text-white flex items-center justify-center font-bold text-lg">
                  أم
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">عائلة ماما نادية • الدقي</h4>
                  <p className="text-[11px] text-amber-300">Host Family • 6 mins to Cairo Univ</p>
                </div>
              </div>

              <blockquote className="text-xs text-stone-200 italic border-l-2 border-amber-400 pl-3">
                &ldquo;بناتنا وأولادنا من الصعيد ومن خارج مصر أمانة في رقبتنا. بنوفر لهم الأكل البيتي النظيف وجو أسري هادئ يركزوا فيه على دراستهم بكل أمان.&rdquo;
              </blockquote>

              <div className="text-[11px] text-stone-300 pt-1 border-t border-white/10 flex items-center justify-between">
                <span>Verified Egyptian Host</span>
                <span className="text-amber-400 font-bold">100% Background Checked</span>
              </div>
            </div>
          </div>

          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Why Feel at Home — Core Problem & Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
              The Problem We Solve
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Scattered Facebook groups, hidden broker fees, and unverified promises. We fixed that.
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              When students or fresh graduates move from Alexandria, Mansoura, Assiut, or other provinces to Greater Cairo, finding safe housing is stressful. Feel at Home centralizes the experience into a single, honest, community-first platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-800">
            <div className="space-y-2.5 p-5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Centralized & Filterable</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Filter directly by governorate (Cairo, Giza, Qalyubia), specific neighborhood, furnishing status, and student budgets in EGP.
              </p>
            </div>

            <div className="space-y-2.5 p-5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">True Verification Rules</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                No false badges. If a place hasn&apos;t undergone physical verification, it is strictly designated as &quot;Not Verified&quot;. Anti-scam advisories prevent fraudulent advance payments.
              </p>
            </div>

            <div className="space-y-2.5 p-5 bg-stone-800/60 rounded-2xl border border-stone-700/60">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Roommate Discovery</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Halve living costs and beat Cairo rental spikes. Connect with peers who match your sleeping cycles, study focus, and cleanliness standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Greater Cairo Key Districts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Explore Neighborhoods
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Student & Professional Hubs in Greater Cairo
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tap on any area to instantly filter listings near your university or workplace.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cairoDistricts.map((d, idx) => (
            <Link
              key={idx}
              to={`/listings?query=${encodeURIComponent(d.query)}`}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-sm transition group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                {d.gov}
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-2 group-hover:text-amber-700 transition">
                {d.name}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">
                {d.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Roommate Discovery Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Shared Accommodation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Find Trustworthy Roommates
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Discover students and young professionals seeking flatmates across Cairo, Giza, and Qalyubia.
            </p>
          </div>

          <Link
            to="/roommates"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            View all roommate profiles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRoommates.map((profile) => (
            <RoommateCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-stone-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              How Feel at Home Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              A smooth 3-step path to finding or offering safe accommodation in Greater Cairo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm">
                01
              </span>
              <h3 className="font-bold text-stone-900 text-base">Filter by Campus & Budget</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose private rooms or shared flats near Cairo University, Ain Shams, GUC, AUC, or Benha. Narrow down by rent in EGP and furnished amenities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm">
                02
              </span>
              <h3 className="font-bold text-stone-900 text-base">Inspect in Person Safely</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Check transparent verification indicators. Connect with the property host to schedule an in-person viewing before any deposit commitment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm">
                03
              </span>
              <h3 className="font-bold text-stone-900 text-base">Move In & Feel at Home</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sign your lease contract with full clarity on house rules and utility bills. Settle into your new city with comfort and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Hosts */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-700 to-orange-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have a flat or spare room to rent?
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Connect with respectful university students and young professionals across Cairo, Giza, and Qalyubia. Free to list and manage.
            </p>
          </div>

          <Link
            to="/create-listing"
            className="px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-md transition whitespace-nowrap"
          >
            List Your Property Now
          </Link>
        </div>
      </section>
    </div>
  );
};
