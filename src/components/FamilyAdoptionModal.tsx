import React, { useState } from 'react';
import {
  Heart,
  Home,
  CheckCircle2,
  X,
  Send,
  GraduationCap,
  Globe2,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Listing, User } from '../types';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  currentUser: User | null;
  onSuccess: () => void;
}

export const FamilyAdoptionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  listing,
  currentUser,
  onSuccess,
}) => {
  const family = listing.familyHostDetails || {
    familyName: 'Egyptian Host Family',
    familyMembersOverview: 'Welcoming Egyptian family in Greater Cairo.',
    mealsProvided: 'BREAKFAST_AND_DINNER',
    welcomingCategories: ['UPPER_EGYPT', 'INTERNATIONAL_STUDENT'],
    languagesSpoken: ['Arabic', 'English'],
    mentorshipNotes: 'Warm family atmosphere and student support.',
  };

  const [originCategory, setOriginCategory] = useState<'UPPER_EGYPT' | 'INTERNATIONAL' | 'OTHER_GOVERNORATE'>(
    currentUser?.studentType === 'UPPER_EGYPT'
      ? 'UPPER_EGYPT'
      : currentUser?.studentType === 'INTERNATIONAL'
      ? 'INTERNATIONAL'
      : 'UPPER_EGYPT'
  );
  const [originLocation, setOriginLocation] = useState(
    currentUser?.originLocation || (originCategory === 'UPPER_EGYPT' ? 'Assiut (الصعيد)' : 'International / Foreign Country')
  );
  const [universityAndFaculty, setUniversityAndFaculty] = useState(
    currentUser?.occupationOrUni || 'Cairo University'
  );
  const [studyYearOrDegree, setStudyYearOrDegree] = useState('2nd Year Undergraduate');
  const [name, setName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [introductionStory, setIntroductionStory] = useState(
    'I am looking for a warm, protective Egyptian family environment where I can feel at home while focusing on my university studies.'
  );
  const [dietaryPreferences, setDietaryPreferences] = useState(
    'Eats traditional Egyptian home cooking; non-smoker; quiet study habits.'
  );
  const [targetMoveInDate, setTargetMoveInDate] = useState('Start of Next Semester');
  const [durationMonths, setDurationMonths] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !originLocation.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      storage.createFamilyRequest({
        listingId: listing.id,
        listingTitle: listing.title,
        hostFamilyName: family.familyName,
        hostUserId: listing.userId,
        seekerId: currentUser ? currentUser.id : `guest-${Date.now()}`,
        seekerName: name.trim(),
        seekerEmail: email.trim(),
        seekerPhone: phone.trim(),
        originCategory,
        originLocation: originLocation.trim(),
        universityAndFaculty: universityAndFaculty.trim(),
        studyYearOrDegree: studyYearOrDegree.trim(),
        introductionStory: introductionStory.trim(),
        dietaryPreferences: dietaryPreferences.trim(),
        targetMoveInDate: targetMoveInDate.trim(),
        stayDurationMonths: parseInt(durationMonths) || 10,
      });

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1600);
    } catch (err: any) {
      alert(err.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto space-y-6 text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
            <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>Egyptian Family Homestay & Mentorship Program • برنامج الاستضافة والتبني الأسري</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-950 tracking-tight">
            Apply to be Hosted by {family.familyName}
          </h2>
          <p className="text-stone-600 leading-relaxed text-xs">
            Designed especially for students relocating from <strong>Upper Egypt (صعيد مصر)</strong> and <strong>international foreign students (طلاب وافدون)</strong> seeking family protection, traditional Egyptian home meals, and genuine mentorship away from home.
          </p>
        </div>

        {/* Family Snapshot Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-amber-700" /> Host Family Snapshot:
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Host Family
            </span>
          </div>

          <p className="text-stone-700 leading-relaxed italic">
            "{family.familyMembersOverview}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-200/50 text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                {family.mealsProvided === 'ALL_MEALS'
                  ? '3 Daily Home-Cooked Meals'
                  : family.mealsProvided === 'BREAKFAST_AND_DINNER'
                  ? 'Fresh Breakfast & Egyptian Home Dinner'
                  : family.mealsProvided === 'DINNER_ONLY'
                  ? 'Daily Egyptian Family Dinner'
                  : 'Home-Cooking by Arrangement'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Languages: {family.languagesSpoken.join(', ')}</span>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">
              Application Submitted to {family.familyName}!
            </h3>
            <p className="text-stone-600 max-w-md mx-auto text-xs">
              The host family has received your story. They will review your application and reach out to schedule a video or in-person family tea meeting.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Background / Origin */}
            <div className="space-y-3">
              <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                1. Student Origin & Category *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOriginCategory('UPPER_EGYPT');
                    setOriginLocation('Assiut (الصعيد)');
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    originCategory === 'UPPER_EGYPT'
                      ? 'bg-amber-100/80 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center gap-1">
                    🌾 Upper Egypt Student
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    طالب من الصعيد (أسيوط، سوهاج، قنا، الأقصر، أسوان، إلخ)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOriginCategory('INTERNATIONAL');
                    setOriginLocation('Foreign / International Country');
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    originCategory === 'INTERNATIONAL'
                      ? 'bg-amber-100/80 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center gap-1">
                    🌍 International Student
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    طالب وافد (ماليزيا، إندونيسيا، نيجيريا، فرنسا، إلخ)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOriginCategory('OTHER_GOVERNORATE');
                    setOriginLocation('Other Egyptian Governorate');
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    originCategory === 'OTHER_GOVERNORATE'
                      ? 'bg-amber-100/80 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center gap-1">
                    🏙️ Other Governorate
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    محافظات أخرى (الإسكندرية، المنصورة، طنطا، إلخ)
                  </span>
                </button>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Specific Origin City / Governorate / Country *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assiut, Sohag, Kuala Lumpur (Malaysia), Paris, Sohag..."
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* University & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  University & Faculty *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cairo University - Kasr Al-Ainy Medicine"
                  value={universityAndFaculty}
                  onChange={(e) => setUniversityAndFaculty(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Year of Study / Degree *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2nd Year Medical Student, 1st Year Master's"
                  value={studyYearOrDegree}
                  onChange={(e) => setStudyYearOrDegree(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            {/* Personal Story & Introduction */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <label className="block font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                Message to the Host Family (Tell them about yourself) *
              </label>
              <textarea
                rows={3}
                required
                value={introductionStory}
                onChange={(e) => setIntroductionStory(e.target.value)}
                placeholder="Share a few words about your personality, hobbies, why you want to live with an Egyptian family, and your academic goals..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Target Move-in Date *</label>
                <input
                  type="text"
                  required
                  value={targetMoveInDate}
                  onChange={(e) => setTargetMoveInDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Duration of Stay (Months) *</label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <p className="text-[11px] text-stone-500">
                Host families interview applicants to ensure compatibility and safety for both sides.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending Application...' : 'Send Family Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
