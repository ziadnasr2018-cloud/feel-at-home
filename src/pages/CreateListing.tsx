import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Sparkles,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Building,
  ShieldCheck,
  ArrowRight,
  Info,
  Camera,
} from 'lucide-react';
import { storage } from '../services/storage';
import { Governorate, AccommodationType } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateListingDescription } from '../services/gemini';
import { EgyptianPhotoGenerator } from '../components/EgyptianPhotoGenerator';

export const CreateListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('PRIVATE_ROOM');
  const [governorate, setGovernorate] = useState<Governorate>('Cairo');
  const [city, setCity] = useState('Nasr City');
  const [neighborhood, setNeighborhood] = useState('District 7');
  const [address, setAddress] = useState('18 Tayaran Street, Nasr City');
  const [priceEgp, setPriceEgp] = useState('3800');
  const [depositEgp, setDepositEgp] = useState('3800');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [isFurnished, setIsFurnished] = useState(true);

  // Amenities
  const allAmenities = [
    'High-speed WiFi',
    'Air Conditioning',
    'Near Metro Station',
    'Natural Gas',
    'Washing Machine',
    'Elevator',
    'Building Security',
    'Balcony',
    'Kitchen Appliances',
    'Water Heater',
    'Quiet Study Area',
    'Full Wardrobe',
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-speed WiFi',
    'Air Conditioning',
    'Natural Gas',
    'Near Metro Station',
  ]);

  // Images
  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502005229762-ae1b46d3383e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  ];
  const [imageUrl, setImageUrl] = useState(samplePhotoPresets[0]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([samplePhotoPresets[1]]);

  // Rules & Landmarks
  const [rules, setRules] = useState('Quiet study hours after 11 PM\nNo smoking inside bedrooms\nStudents and young professionals only');
  const [nearbyLandmarks, setNearbyLandmarks] = useState('Metro Station — 5 mins walk\nMain University Campus — 10 mins walk\nSupermarket & Pharmacy — 2 mins walk');

  // Contact
  const [hostPhone, setHostPhone] = useState(user?.phoneNumber || '+20 10 1234 5678');
  const [hostEmail, setHostEmail] = useState(user?.email || 'host@example.com');

  // AI Assistant State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      alert('Please enter a listing title first.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const generated = await generateListingDescription({
        title,
        type: accommodationType,
        neighborhood,
        city,
        governorate,
        bedrooms: parseInt(bedrooms) || 1,
        priceEgp: parseFloat(priceEgp) || 3000,
        amenities: selectedAmenities,
      });
      setDescription(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be signed in to publish a property. Please log in or choose a demo account.');
      return;
    }

    if (!title.trim() || !city.trim() || !priceEgp) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const allImages = [imageUrl.trim(), ...additionalImages.filter((img) => img.trim().length > 0)];
      const parsedRules = rules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
      const parsedLandmarks = nearbyLandmarks
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      // Resolve Cairo coordinates & transit for accurate Map & University distance calculations
      const normCity = city.toLowerCase();
      let resolvedCoords = { lat: 30.0444, lng: 31.2357 };
      let resolvedMetro: any = { name: 'Sadat Station', line: 'Line 1 & 2', walkingMinutes: 8, distanceMeters: 700 };

      if (normCity.includes('dokki') || normCity.includes('mesaha') || normCity.includes('giza')) {
        resolvedCoords = { lat: 30.0382, lng: 31.2115 };
        resolvedMetro = { name: 'Dokki Station', line: 'Line 2 (Red)', walkingMinutes: 5, distanceMeters: 450 };
      } else if (normCity.includes('nasr') || normCity.includes('akkad') || normCity.includes('tayaran')) {
        resolvedCoords = { lat: 30.0578, lng: 31.3392 };
        resolvedMetro = { name: 'Cairo Stadium Station', line: 'Line 3 (Green)', walkingMinutes: 8, distanceMeters: 750 };
      } else if (normCity.includes('new cairo') || normCity.includes('tagamoa') || normCity.includes('settlement')) {
        resolvedCoords = { lat: 30.0131, lng: 31.4721 };
        resolvedMetro = undefined;
      } else if (normCity.includes('shubra') || normCity.includes('kheima') || normCity.includes('shoubra')) {
        resolvedCoords = { lat: 30.1286, lng: 31.2422 };
        resolvedMetro = { name: 'Shubra El-Kheima Station', line: 'Line 2 (Red)', walkingMinutes: 6, distanceMeters: 550 };
      } else if (normCity.includes('zayed') || normCity.includes('october') || normCity.includes('smart')) {
        resolvedCoords = { lat: 30.0489, lng: 30.9855 };
        resolvedMetro = undefined;
      } else if (normCity.includes('benha')) {
        resolvedCoords = { lat: 30.4632, lng: 31.1812 };
        resolvedMetro = undefined;
      } else if (normCity.includes('maadi') || normCity.includes('degla')) {
        resolvedCoords = { lat: 29.9602, lng: 31.2568 };
        resolvedMetro = { name: 'Maadi Station', line: 'Line 1 (Blue)', walkingMinutes: 7, distanceMeters: 600 };
      }

      const created = storage.createListing(
        {
          userId: user.id,
          title: title.trim(),
          description: description.trim() || 'Clean, comfortable accommodation in Greater Cairo.',
          accommodationType,
          governorate,
          city: city.trim(),
          neighborhood: neighborhood.trim(),
          address: address.trim(),
          priceEgp: parseFloat(priceEgp),
          depositEgp: depositEgp ? parseFloat(depositEgp) : undefined,
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseInt(bathrooms) || 1,
          isFurnished,
          amenities: selectedAmenities,
          images: allImages,
          coordinates: resolvedCoords,
          nearestMetro: resolvedMetro,
          status: 'AVAILABLE',
          rules: parsedRules,
          nearbyLandmarks: parsedLandmarks,
          user: {
            id: user.id,
            fullName: user.fullName,
            phoneNumber: hostPhone.trim(),
            email: hostEmail.trim(),
            createdAt: user.createdAt || new Date().toISOString(),
            isVerifiedHost: false,
          },
        },
        user
      );

      navigate(`/listings/${created.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save listing.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          Property Provider Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Publish Property or Room in Greater Cairo
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Reach thousands of university students and relocating professionals looking for dependable accommodation.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Trust Notice Info Box */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 flex items-start gap-3 text-xs text-stone-700">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-stone-900">Feel at Home Verification Standard:</strong> New user-submitted listings are published as <span className="font-semibold text-stone-900">&quot;Not Verified Yet&quot;</span> until physical inspection or ownership deed documentation is completed. We never display fake verification badges.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-8 text-xs">
        {/* Section 1: Basic Classification */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            1. Property Category & Title
          </h3>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quiet Furnished Room for Student — 5 Mins to Cairo University & Dokki Metro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Accommodation Type *
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
              >
                <option value="PRIVATE_ROOM">Private Room</option>
                <option value="PRIVATE_APARTMENT">Private Apartment</option>
                <option value="SHARED_APARTMENT">Shared Apartment</option>
                <option value="SHARED_ROOM">Shared Room (Bed)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Furnishing Status *</label>
              <div className="flex gap-4 pt-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furnished"
                    checked={isFurnished}
                    onChange={() => setIsFurnished(true)}
                    className="text-amber-600"
                  />
                  <span>Furnished</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furnished"
                    checked={!isFurnished}
                    onChange={() => setIsFurnished(false)}
                    className="text-amber-600"
                  />
                  <span>Unfurnished</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Location in Greater Cairo */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            2. Greater Cairo Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Governorate *</label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
              >
                <option value="Cairo">Cairo Governorate</option>
                <option value="Giza">Giza Governorate</option>
                <option value="Qalyubia">Qalyubia Governorate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">City / Municipality *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dokki, Nasr City, Shubra El-Kheima"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Neighborhood / District *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mesaha Square, 7th District"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Full Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 14 Al-Mesaha Street, Dokki, Giza"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* Section 3: Pricing & Rooms */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            3. Pricing & Layout
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Monthly Rent (EGP) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 3500"
                value={priceEgp}
                onChange={(e) => setPriceEgp(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-amber-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Security Deposit (EGP)
              </label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={depositEgp}
                onChange={(e) => setDepositEgp(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
            4. Available Amenities & Facilities
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {allAmenities.map((am) => {
              const checked = selectedAmenities.includes(am);
              return (
                <button
                  type="button"
                  key={am}
                  onClick={() => toggleAmenity(am)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                    checked
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{am}</span>
                  {checked && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Description with AI Assistant */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              5. Description
            </h3>

            <button
              type="button"
              onClick={handleGenerateAiDescription}
              disabled={isGeneratingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold text-[11px] shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingAi ? 'Drafting with AI...' : 'Draft / Enhance with AI'}
            </button>
          </div>

          <textarea
            rows={5}
            required
            placeholder="Describe the unit, lighting, student-friendly atmosphere, public transit convenience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
          />
        </div>

        {/* Section 6: Photo URLs & Presets */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              6. Property Photos (Authentic Egyptian Themes)
            </h3>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>📸 Pick / Generate Egyptian Photos</span>
            </button>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Primary Photo URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          {/* Photo Preview & Quick Egyptian Presets */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700">
                Selected Photo Preview:
              </span>
              <span className="text-[10px] text-amber-800 font-medium">
                Tip: Egyptian student rooms with study desks, balconies, and tile floors attract 3x more students
              </span>
            </div>
            <div className="h-36 rounded-xl overflow-hidden border border-stone-200 bg-stone-200">
              <img
                src={imageUrl}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>

        <EgyptianPhotoGenerator
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSelectPhoto={(url) => setImageUrl(url)}
        />


        {/* Section 7: House Rules & Landmarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              House Rules (One per line)
            </label>
            <textarea
              rows={3}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Nearby Landmarks (One per line)
            </label>
            <textarea
              rows={3}
              value={nearbyLandmarks}
              onChange={(e) => setNearbyLandmarks(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* Section 8: Host Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Host Phone *</label>
            <input
              type="text"
              required
              value={hostPhone}
              onChange={(e) => setHostPhone(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Host Email *</label>
            <input
              type="email"
              required
              value={hostEmail}
              onChange={(e) => setHostEmail(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <p className="text-[11px] text-stone-400">
            By publishing, you confirm that you hold legal authority to lease this premises.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Accommodation'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
