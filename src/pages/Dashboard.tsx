import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Inbox,
  User,
  PlusCircle,
  Trash2,
  Edit,
  Repeat,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Users,
  Eye,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileText,
  UtensilsCrossed,
  Globe2,
  Send,
  XCircle,
  GraduationCap,
} from 'lucide-react';
import { storage } from '../services/storage';
import { Listing, Inquiry, RoommateProfile, FamilyAdoptionRequest, VerificationStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { ListingCard } from '../components/ListingCard';
import { VerificationBadge } from '../components/VerificationBadge';

export const Dashboard: React.FC = () => {
  const { user, role, switchRole, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my_listings' | 'saved' | 'inquiries' | 'family_adoption' | 'verification'>('saved');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [myRoommateProfile, setMyRoommateProfile] = useState<RoommateProfile | null>(null);
  const [familyRequests, setFamilyRequests] = useState<FamilyAdoptionRequest[]>([]);

  // Verification form state
  const [docType, setDocType] = useState<'NATIONAL_ID' | 'PASSPORT' | 'STUDENT_ID' | 'ENROLLMENT_LETTER' | 'DEED'>('NATIONAL_ID');
  const [docNumber, setDocNumber] = useState(user?.verificationDocumentNumber || '');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const loadData = () => {
    if (!user) return;

    // Load listings created by user (or demo provider listings if logged in as provider)
    const all = storage.getListings();
    if (role === 'PROVIDER') {
      const owned = all.filter((l) => l.userId === user.id || (user.id === 'user-provider-cairo' && l.userId === 'user-provider-cairo'));
      setMyListings(owned);
      const inqs = storage.getInquiriesForProvider(user.id);
      // Also include general provider inquiries if evaluating with demo host
      if (inqs.length === 0 && user.id.includes('provider')) {
        setReceivedInquiries(storage.getInquiriesForProvider('user-provider-giza'));
      } else {
        setReceivedInquiries(inqs);
      }
    }

    // Load saved favorites
    const savedIds = storage.getSavedListingIds(user.id);
    const savedItems = all.filter((l) => savedIds.includes(l.id));
    setSavedListings(savedItems);

    // Load sent inquiries for seeker
    const sent = storage.getInquiriesForSeeker(user.id);
    setSentInquiries(sent);

    // Load roommate profile
    const rm = storage.getRoommateProfileByUserId(user.id);
    setMyRoommateProfile(rm);

    // Load family adoption requests
    if (role === 'PROVIDER') {
      const famReqs = storage.getFamilyRequestsForHost(user.id);
      if (famReqs.length === 0) {
        setFamilyRequests(storage.getFamilyRequests());
      } else {
        setFamilyRequests(famReqs);
      }
    } else {
      const seekerFamReqs = storage.getFamilyRequestsForSeeker(user.id);
      if (seekerFamReqs.length === 0) {
        setFamilyRequests(storage.getFamilyRequests());
      } else {
        setFamilyRequests(seekerFamReqs);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Set appropriate default tab based on role
    if (role === 'PROVIDER') {
      setActiveTab('my_listings');
    } else {
      setActiveTab('saved');
    }
    loadData();
  }, [user, role]);

  const handleDeleteListing = (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this listing? This action is permanent.')) {
      try {
        storage.deleteListing(id, user.id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Cannot delete listing.');
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    if (!user) return;
    try {
      storage.toggleListingStatus(id, user.id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Cannot change status.');
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (!user) return;
    storage.toggleSaveListing(user.id, id);
    loadData();
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!docNumber.trim()) {
      alert('Please enter your document identification number.');
      return;
    }
    const newStatus: VerificationStatus = 'VERIFICATION_PENDING';
    storage.updateUserVerification(user.id, newStatus, docType, docNumber.trim());
    updateProfile({
      verificationStatus: newStatus,
      verificationDocumentType: docType,
      verificationDocumentNumber: docNumber.trim(),
      verificationSubmittedAt: new Date().toISOString(),
    });
    setVerificationSuccess(true);
    setTimeout(() => setVerificationSuccess(false), 4000);
    loadData();
  };

  const handleSetVerificationState = (targetStatus: VerificationStatus) => {
    if (!user) return;
    storage.updateUserVerification(user.id, targetStatus);
    updateProfile({
      verificationStatus: targetStatus,
      verificationReviewedAt: targetStatus === 'VERIFIED' ? new Date().toISOString() : undefined,
    });
    loadData();
  };

  const handleFamilyRequestAction = (id: string, action: 'ACCEPTED_FOR_MEETING' | 'DECLINED') => {
    storage.updateFamilyRequestStatus(id, action);
    loadData();
  };


  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{user.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                {role === 'PROVIDER' ? 'Property Host' : 'Accommodation Seeker'}
              </span>
              <VerificationBadge status={user.verificationStatus || 'NOT_VERIFIED'} />
              {user.studentType === 'UPPER_EGYPT' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-900 text-amber-100 border border-amber-800">
                  🌾 صعيد مصر ({user.originLocation || 'Upper Egypt'})
                </span>
              )}
              {user.studentType === 'INTERNATIONAL' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-100 border border-emerald-800">
                  🌍 International ({user.originLocation || 'Foreign Student'})
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {user.email} • {user.phoneNumber}
            </p>
            {user.occupationOrUni && (
              <p className="text-xs text-amber-800 font-medium mt-0.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                {user.occupationOrUni}
              </p>
            )}
          </div>
        </div>

        {/* Demo Role Switcher Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={switchRole}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 transition cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5 text-amber-700" />
            Switch to {role === 'PROVIDER' ? 'Seeker View' : 'Host View'}
          </button>

          {role === 'PROVIDER' && (
            <Link
              to="/create-listing"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" /> Add New Listing
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-bold overflow-x-auto pb-1">
        {role === 'PROVIDER' && (
          <button
            onClick={() => setActiveTab('my_listings')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'my_listings'
                ? 'border-b-2 border-amber-600 text-amber-800'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-4 h-4" /> My Published Properties ({myListings.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'saved'
              ? 'border-b-2 border-amber-600 text-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Favorites ({savedListings.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-b-2 border-amber-600 text-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          {role === 'PROVIDER' ? 'Tenant Inquiries' : 'Sent Inquiries'} (
          {role === 'PROVIDER' ? receivedInquiries.length : sentInquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('family_adoption')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'family_adoption'
              ? 'border-b-2 border-amber-600 text-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          Family Homestay & Adoption ({familyRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'verification'
              ? 'border-b-2 border-amber-600 text-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verification Status
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            user.verificationStatus === 'VERIFIED'
              ? 'bg-emerald-100 text-emerald-800'
              : user.verificationStatus === 'VERIFICATION_PENDING'
              ? 'bg-amber-100 text-amber-900'
              : 'bg-stone-200 text-stone-600'
          }`}>
            {user.verificationStatus === 'VERIFIED'
              ? 'Verified'
              : user.verificationStatus === 'VERIFICATION_PENDING'
              ? 'Pending'
              : 'Not Verified'}
          </span>
        </button>

        {role === 'SEEKER' && (
          <Link
            to="/roommates"
            className="pb-3 flex items-center gap-2 text-stone-500 hover:text-stone-800 whitespace-nowrap"
          >
            <Users className="w-4 h-4" /> Roommate Profile
          </Link>
        )}
      </div>

      {/* Tab 1: Provider Managed Listings */}
      {activeTab === 'my_listings' && role === 'PROVIDER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Managed Accommodations</h2>
            <Link
              to="/create-listing"
              className="text-xs text-amber-700 hover:text-amber-800 font-bold underline"
            >
              + Publish Another Flat
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Home className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900">No properties published yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                List your private room, shared apartment, or whole flat to connect with students across Greater Cairo.
              </p>
              <Link
                to="/create-listing"
                className="inline-block px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Create First Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">{listing.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            listing.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        {listing.neighborhood}, {listing.city} ({listing.governorate}) •{' '}
                        <strong className="text-stone-800">{listing.priceEgp.toLocaleString()} EGP</strong> / mo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
                    <Link
                      to={`/listings/${listing.id}`}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-stone-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>

                    <Link
                      to={`/listings/${listing.id}/edit`}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-stone-700 flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(listing.id)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-stone-700"
                    >
                      {listing.status === 'AVAILABLE' ? 'Mark Rented' : 'Mark Available'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteListing(listing.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Listings / Favorites */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Saved Accommodations</h2>
            <Link to="/listings" className="text-xs text-amber-700 font-bold underline">
              Browse More Housing
            </Link>
          </div>

          {savedListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Heart className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900">No saved favorites yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Click the heart icon on any listing in Greater Cairo to bookmark it here for easy comparison.
              </p>
              <Link
                to="/listings"
                className="inline-block px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Explore Cairo Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedListings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  isSaved={true}
                  onToggleSave={handleRemoveFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Inquiries (Provider or Seeker) */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            {role === 'PROVIDER' ? 'Incoming Tenant Inquiries' : 'Inquiries You Have Sent'}
          </h2>

          {role === 'PROVIDER' ? (
            receivedInquiries.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
                No inquiries received yet. Once seekers request in-person viewings, they will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {receivedInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">{inq.name}</span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-medium text-amber-800">
                      Property: <strong>{inq.listingTitle}</strong> ({inq.listingLocation})
                    </p>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-800 italic leading-relaxed">
                      &ldquo;{inq.message}&rdquo;
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
                      <div className="flex items-center gap-4 text-stone-600">
                        <span className="flex items-center gap-1 font-semibold text-stone-800">
                          <Phone className="w-3.5 h-3.5 text-amber-700" /> {inq.phone}
                        </span>
                        {inq.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-amber-700" /> {inq.email}
                          </span>
                        )}
                        {inq.moveInDate && (
                          <span>Target Move-in: <strong>{inq.moveInDate}</strong></span>
                        )}
                      </div>

                      <a
                        href={`tel:${inq.phone}`}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition"
                      >
                        Call Tenant
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : sentInquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              You haven&apos;t sent any inquiries yet. Open any property details page to contact a host.
            </div>
          ) : (
            <div className="space-y-3">
              {sentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{inq.listingTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      Sent to Host
                    </span>
                  </div>
                  <p className="text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Sent on {new Date(inq.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Family Homestay & Adoption (استضافة وتبني الطلاب) */}
      {activeTab === 'family_adoption' && (
        <div className="space-y-6">
          {/* Informational Hero Card */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                برنامج الاستضافة والتبني الأسري للطلاب في القاهرة الكبرى
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                Egyptian Family Adoption & Mentorship Program
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                A warm home away from home. Caring Egyptian families host students relocating from Upper Egypt (صعيد مصر) or abroad (الطلاب الوافدون), offering safe accommodation, traditional home-cooked meals (Mahshi, Molokhia, Feteer), family guidance, and a supportive study atmosphere.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                  🌾 طلاب صعيد مصر (أسيوط، سوهاج، قنا، أسوان)
                </span>
                <span className="text-[11px] font-semibold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                  🌍 International Students (Malaysia, Nigeria, France, etc.)
                </span>
                <span className="text-[11px] font-semibold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                  🍲 Home-Cooked Breakfast & Dinner Included
                </span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Role-Specific Request View */}
          {role === 'PROVIDER' ? (
            /* Host Family View: Incoming Student Adoption Applications */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Incoming Student Applications</h3>
                  <p className="text-xs text-stone-500">
                    Review students requesting homestay and family adoption in your residence.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                  {familyRequests.length} Applications
                </span>
              </div>

              {familyRequests.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs space-y-2">
                  <UtensilsCrossed className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-semibold text-stone-800">No student homestay applications yet</p>
                  <p>When students apply to stay with your family, their details and academic credentials will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {familyRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-base">{req.seekerName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {req.originCategory === 'UPPER_EGYPT' ? '🌾 طالب صعيدي' : req.originCategory === 'INTERNATIONAL' ? '🌍 طالب وافد' : 'طالب مغترب'}
                            </span>
                            <span className="text-xs text-stone-500 font-medium">
                              From: <strong>{req.originLocation}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                            {req.universityAndFaculty} • {req.studyYearOrDegree}
                          </p>
                          <p className="text-xs text-stone-500">
                            Requested Accommodation: <span className="font-semibold text-stone-800">{req.listingTitle}</span>
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {req.status === 'PENDING_FAMILY_REVIEW' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Pending Your Review
                            </span>
                          )}
                          {req.status === 'ACCEPTED_FOR_MEETING' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted for Family Tea Meeting
                            </span>
                          )}
                          {req.status === 'DECLINED' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Declined
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Student Message / Story */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/70 space-y-2 text-xs">
                        <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider block">
                          Student&apos;s Message to the Family (رسالة الطالب للأسرة الكريمة):
                        </span>
                        <p className="text-stone-700 italic leading-relaxed">
                          &ldquo;{req.introductionStory}&rdquo;
                        </p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                        <div>
                          <span className="text-stone-500 block text-[10px]">Expected Move-in:</span>
                          <strong className="text-stone-800">{req.targetMoveInDate}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px]">Duration:</span>
                          <strong className="text-stone-800">{req.stayDurationMonths} months</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px]">Student Phone:</span>
                          <strong className="text-stone-800">{req.seekerPhone}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px]">Student Email:</span>
                          <strong className="text-stone-800">{req.seekerEmail}</strong>
                        </div>
                      </div>

                      {/* Action Buttons for Host */}
                      {req.status === 'PENDING_FAMILY_REVIEW' && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => handleFamilyRequestAction(req.id, 'ACCEPTED_FOR_MEETING')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            الموافقة ودعوة الطالب لجلسة تعارف أسرية (Accept for Family Meeting)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFamilyRequestAction(req.id, 'DECLINED')}
                            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            اعتذار بلطف (Decline)
                          </button>
                          <a
                            href={`tel:${req.seekerPhone}`}
                            className="px-3.5 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold ml-auto flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-amber-700" />
                            Call Student
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Seeker View: My Family Homestay Applications */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">My Sent Family Homestay Applications</h3>
                  <p className="text-xs text-stone-500">
                    Track requests you sent to Egyptian families welcoming Upper Egypt & international students.
                  </p>
                </div>
                <Link
                  to="/listings"
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold underline"
                >
                  Browse More Family Homestays
                </Link>
              </div>

              {familyRequests.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs space-y-3">
                  <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-sm">No homestay applications sent yet</h4>
                  <p className="max-w-md mx-auto">
                    Are you coming from Upper Egypt (صعيد مصر) or abroad? You can apply to be hosted by warm Egyptian families who provide a private room, home-cooked Egyptian meals, and mentorship.
                  </p>
                  <Link
                    to="/listings"
                    className="inline-block px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700"
                  >
                    Explore Family Homestays in Cairo & Giza
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {familyRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-base">{req.hostFamilyName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              عائلة مصرية مستضيفة
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            Accommodation: <strong>{req.listingTitle}</strong>
                          </p>
                          <p className="text-[11px] text-stone-400 mt-1">
                            Application sent on {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status */}
                        <div>
                          {req.status === 'PENDING_FAMILY_REVIEW' && (
                            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-600" />
                              <span>قيد مراجعة الأسرة (Pending Family Review)</span>
                            </div>
                          )}
                          {req.status === 'ACCEPTED_FOR_MEETING' && (
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>تمت الموافقة على جلسة التعارف الأسرية!</span>
                            </div>
                          )}
                          {req.status === 'DECLINED' && (
                            <div className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold flex items-center gap-1.5">
                              <XCircle className="w-4 h-4" />
                              <span>عذراً، الأسرة مكتملة العدد حالياً</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {req.status === 'ACCEPTED_FOR_MEETING' && (
                        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
                          <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Next Step: Family Tea Session (قعدة شاي للتعارف والاطمئنان)
                          </p>
                          <p className="text-emerald-800 text-[11px] leading-relaxed">
                            The family has approved your application! You are invited to contact the family head to arrange a meeting at the residence to see the room and meet the family before signing the contract.
                          </p>
                        </div>
                      )}

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600">
                        <span className="font-semibold text-stone-800">Your Introduction: </span>
                        &ldquo;{req.introductionStory}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Account & Trust Verification (توثيق الحساب) */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Status Overview Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  Account Verification & Safety Status
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Official badge verification prevents scams, assures fellow roommates, and unlocks verified Egyptian host properties.
                </p>
              </div>
              <VerificationBadge status={user.verificationStatus || 'NOT_VERIFIED'} />
            </div>

            {/* Explanation based on current status */}
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              user.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : user.verificationStatus === 'VERIFICATION_PENDING'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {user.verificationStatus === 'VERIFIED' && (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>حسابك موثّق رسمياً (Officially Verified Account)</span>
                  </>
                )}
                {user.verificationStatus === 'VERIFICATION_PENDING' && (
                  <>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>طلب التوثيق قيد المراجعة الفنية (Under Verification Review)</span>
                  </>
                )}
                {(!user.verificationStatus || user.verificationStatus === 'NOT_VERIFIED') && (
                  <>
                    <ShieldAlert className="w-4 h-4 text-stone-500" />
                    <span>حسابك غير موثّق حتى الآن (Account Not Yet Verified)</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {user.verificationStatus === 'VERIFIED'
                  ? 'Your national identity and student/property credentials have been reviewed. A verified shield is displayed across all your listings, roommate searches, and inquiries.'
                  : user.verificationStatus === 'VERIFICATION_PENDING'
                  ? 'Our community safety team is validating your submitted document with official university/government registers. Reviews usually conclude within 12-24 hours.'
                  : 'Submit your Egyptian National ID, Student Card, or Passport below to protect our community against deceptive posts and gain trust with landlords and roommates.'}
              </p>
            </div>

            {/* 🛠️ COMPETITION JUDGE / REVIEWER DEMO SWITCHER */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Judge & Reviewer Live State Switcher (اختبار حالات الحساب الثلاثة):
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  Interactive Demo Control
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                As requested, you can test all 3 states live: <strong>Verified</strong>, <strong>Verification Pending</strong>, and <strong>Not Verified</strong>. Click any button below to instantly change your account badge across the entire platform:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSetVerificationState('VERIFIED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    user.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  1. Set to Verified (موثّق)
                </button>

                <button
                  type="button"
                  onClick={() => handleSetVerificationState('VERIFICATION_PENDING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    user.verificationStatus === 'VERIFICATION_PENDING'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  2. Set to Verification Pending (قيد المراجعة)
                </button>

                <button
                  type="button"
                  onClick={() => handleSetVerificationState('NOT_VERIFIED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    user.verificationStatus === 'NOT_VERIFIED' || !user.verificationStatus
                      ? 'bg-stone-700 text-white shadow-xs'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800 border border-stone-300'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  3. Set to Not Verified (غير موثّق)
                </button>
              </div>
            </div>

            {/* Document Submission Form */}
            <form onSubmit={handleVerificationSubmit} className="space-y-4 pt-4 border-t border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                Submit Verification Documents (تقديم أوراق التوثيق الرسمية)
              </h4>

              {verificationSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Documents submitted successfully! Your account status is now updated to Verification Pending.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Document Type (نوع الإثبات الرسمي)
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="NATIONAL_ID">بطاقة الرقم القومي المصري (Egyptian National ID)</option>
                    <option value="STUDENT_ID">كارنيه الكلية الجامعي (University Student ID)</option>
                    <option value="PASSPORT">جواز السفر (Passport - for International Students)</option>
                    <option value="ENROLLMENT_LETTER">شهادة قيد جامعي رسمية (University Enrollment Letter)</option>
                    <option value="DEED">عقد ملكية أو إيجار مثبت (Property Deed / Lease Contract)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Document Number / National ID (الرقم القومي أو رقم الوثيقة)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 29901010101234 or A12345678"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Simulated Document Upload Box */}
              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center space-y-2 bg-stone-50/50 hover:bg-stone-50 transition cursor-pointer">
                <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="text-xs font-semibold text-stone-700">
                  Upload Scanned Document or Clear Photo (صورة واضحة للوجهين)
                </div>
                <p className="text-[11px] text-stone-400">
                  Supported formats: JPG, PNG, PDF (Max 10MB). Watermarked automatically with &quot;Feel at Home Verification&quot; for privacy.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-400">
                  🔒 Encrypted and handled in accordance with Egyptian Data Protection Law.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Submit for Safety Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

