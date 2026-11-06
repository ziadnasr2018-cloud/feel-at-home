import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  UserCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  AlertTriangle,
} from 'lucide-react';
import { storage } from '../services/storage';
import { RoommateProfile, Governorate, AccommodationType } from '../types';
import { RoommateCard } from '../components/RoommateCard';
import { useAuth } from '../context/AuthContext';

export const Roommates: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);

  // Filter States
  const [areaFilter, setAreaFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [uniFilter, setUniFilter] = useState('');

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Form State for User's Roommate Profile
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>('Female');
  const [occupationOrUni, setOccupationOrUni] = useState('');
  const [preferredArea, setPreferredArea] = useState('');
  const [governorate, setGovernorate] = useState<Governorate>('Cairo');
  const [budgetEgp, setBudgetEgp] = useState('');
  const [preferredType, setPreferredType] = useState<AccommodationType>('PRIVATE_ROOM');
  const [targetMoveInDate, setTargetMoveInDate] = useState('Immediate');
  const [bio, setBio] = useState('');
  const [sleepSchedule, setSleepSchedule] = useState('Early Bird (Sleep 11 PM)');
  const [cleanliness, setCleanliness] = useState('Daily / Very Clean');
  const [smoking, setSmoking] = useState('Non-Smoker strictly');
  const [guests, setGuests] = useState('Rarely / Quiet study only');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadProfiles = () => {
    let results = storage.getRoommateProfiles({
      area: areaFilter,
      budget: budgetFilter ? parseFloat(budgetFilter) : undefined,
      type: typeFilter,
    });

    if (uniFilter.trim()) {
      const u = uniFilter.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.occupationOrUni.toLowerCase().includes(u) ||
          p.bio.toLowerCase().includes(u)
      );
    }

    setProfiles(results);
  };

  useEffect(() => {
    loadProfiles();
  }, [areaFilter, budgetFilter, typeFilter, uniFilter]);

  // Pre-fill modal if user already has a roommate profile
  const openModal = () => {
    if (!user) {
      alert('Please log in or select a demo account to publish a roommate profile.');
      return;
    }

    const existing = storage.getRoommateProfileByUserId(user.id);
    if (existing) {
      setDisplayName(existing.displayName);
      setAge(existing.age ? existing.age.toString() : '');
      setGender(existing.gender || 'Female');
      setOccupationOrUni(existing.occupationOrUni);
      setPreferredArea(existing.preferredArea);
      setGovernorate(existing.governorate);
      setBudgetEgp(existing.budgetEgp.toString());
      setPreferredType(existing.preferredType);
      setTargetMoveInDate(existing.targetMoveInDate);
      setBio(existing.bio);
      setSleepSchedule(existing.lifestyleHabits.sleepSchedule);
      setCleanliness(existing.lifestyleHabits.cleanliness);
      setSmoking(existing.lifestyleHabits.smoking);
      setGuests(existing.lifestyleHabits.guests);
      setContactPhone(existing.contactPhone);
      setContactEmail(existing.contactEmail);
    } else {
      setDisplayName(user.fullName);
      setOccupationOrUni(user.occupationOrUni || 'Student at Cairo University');
      setPreferredArea('Dokki / Mesaha or Nasr City');
      setGovernorate('Cairo');
      setBudgetEgp('3500');
      setContactPhone(user.phoneNumber);
      setContactEmail(user.email);
      setBio('Studious and organized. Looking for a respectful flatmate to split rent in Greater Cairo.');
    }
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    storage.saveRoommateProfile(
      {
        userId: user.id,
        displayName: displayName.trim() || user.fullName,
        age: age ? parseInt(age) : undefined,
        gender,
        occupationOrUni: occupationOrUni.trim(),
        preferredArea: preferredArea.trim(),
        governorate,
        budgetEgp: parseFloat(budgetEgp) || 3000,
        preferredType,
        targetMoveInDate,
        bio: bio.trim(),
        lifestyleHabits: {
          sleepSchedule,
          cleanliness,
          smoking,
          guests,
        },
        contactPhone: contactPhone.trim() || user.phoneNumber,
        contactEmail: contactEmail.trim() || user.email,
        verificationStatus: user.verificationStatus || 'NOT_VERIFIED',
        originCategory: user.studentType,
        originLocation: user.originLocation,
      },
      user
    );

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
      loadProfiles();
    }, 1200);
  };

  const clearFilters = () => {
    setAreaFilter('');
    setBudgetFilter('');
    setTypeFilter('ALL');
    setUniFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Shared Accommodation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Roommate Discovery in Greater Cairo
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Finding a flat is easier and more affordable together. Connect with students and young professionals seeking compatible roommates.
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="bg-amber-600 hover:bg-amber-700 active:scale-98 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {user && storage.getRoommateProfileByUserId(user.id)
            ? 'Edit My Roommate Profile'
            : 'Post Roommate Profile'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-xs">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">
            Target Area / Neighborhood
          </label>
          <input
            type="text"
            placeholder="e.g. Dokki, Zayed, Shubra..."
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">
            Max Monthly Budget (EGP)
          </label>
          <input
            type="number"
            placeholder="e.g. 4000"
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">
            University or Workplace
          </label>
          <input
            type="text"
            placeholder="e.g. Cairo Univ, Ain Shams..."
            value={uniFilter}
            onChange={(e) => setUniFilter(e.target.value)}
            className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-stone-500 mb-1">
              Housing Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
            >
              <option value="ALL">All Types</option>
              <option value="PRIVATE_ROOM">Private Room</option>
              <option value="SHARED_ROOM">Shared Room</option>
              <option value="SHARED_APARTMENT">Shared Apartment</option>
            </select>
          </div>

          {(areaFilter || budgetFilter || uniFilter || typeFilter !== 'ALL') && (
            <button
              onClick={clearFilters}
              className="p-2 text-stone-400 hover:text-stone-700 text-xs font-semibold"
              title="Clear filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice for Roommate Search */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
        <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Student Roommate Safety Guideline:</strong> Feel at Home encourages meeting potential roommates on campus or in a public café before committing. Clarify shared expense agreements (Wi-Fi, gas, cleaning rotation) prior to signing lease contracts.
        </div>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
          <Users className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No roommate profiles match this search</h3>
          <p className="text-xs text-stone-500">
            Be the first to post a profile for this area or adjust your budget range!
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <RoommateCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {/* Create / Edit Roommate Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto relative animate-in fade-in space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {user && storage.getRoommateProfileByUserId(user.id)
                    ? 'Edit Your Roommate Profile'
                    : 'Create Your Roommate Profile'}
                </h3>
                <p className="text-xs text-stone-500">
                  Visible to students and professionals looking for flatmates.
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-900 text-sm">Roommate Profile Published!</h4>
                <p className="text-xs text-stone-500">Other members can now connect with you.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Display Name *</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 21"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      University or Workplace *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pharmacy student at Cairo University"
                      value={occupationOrUni}
                      onChange={(e) => setOccupationOrUni(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Any">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Governorate</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Cairo">Cairo</option>
                      <option value="Giza">Giza</option>
                      <option value="Qalyubia">Qalyubia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Target Area(s) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dokki, Zayed, Shubra"
                      value={preferredArea}
                      onChange={(e) => setPreferredArea(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Monthly Budget (EGP) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500"
                      value={budgetEgp}
                      onChange={(e) => setBudgetEgp(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Housing Type</label>
                    <select
                      value={preferredType}
                      onChange={(e) => setPreferredType(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="PRIVATE_ROOM">Private Room</option>
                      <option value="SHARED_ROOM">Shared Room (Bed)</option>
                      <option value="SHARED_APARTMENT">Shared Apartment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Target Move-In Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Immediate, or Next Month"
                      value={targetMoveInDate}
                      onChange={(e) => setTargetMoveInDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Short Personal Introduction (Bio) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell potential roommates about your study routine, habits, hobbies, and what you look for in a shared home..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                {/* Lifestyle Preferences */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
                    Living Habits & Preferences
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Sleep Schedule</label>
                      <select
                        value={sleepSchedule}
                        onChange={(e) => setSleepSchedule(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Early Bird (Sleep 10-11 PM)">Early Bird (Sleep 10-11 PM)</option>
                        <option value="Night Owl (Study late)">Night Owl (Study late)</option>
                        <option value="Standard / Flexible">Standard / Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Cleanliness</label>
                      <select
                        value={cleanliness}
                        onChange={(e) => setCleanliness(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Daily / Very Clean">Daily / Very Clean</option>
                        <option value="Moderate & Cooperative">Moderate & Cooperative</option>
                        <option value="Relaxed">Relaxed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Smoking Policy</label>
                      <select
                        value={smoking}
                        onChange={(e) => setSmoking(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Non-Smoker strictly">Non-Smoker strictly</option>
                        <option value="Balcony Only">Balcony Only</option>
                        <option value="Smoker friendly">Smoker friendly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Guest Policy</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Rarely / Quiet study only">Rarely / Quiet study only</option>
                        <option value="Occasional friends on weekends">Occasional friends on weekends</option>
                        <option value="Social flat">Social flat</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Save & Publish Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
