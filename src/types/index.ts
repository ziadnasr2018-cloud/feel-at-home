export type Role = 'SEEKER' | 'PROVIDER';

export type AccommodationType =
  | 'PRIVATE_APARTMENT'
  | 'PRIVATE_ROOM'
  | 'SHARED_APARTMENT'
  | 'SHARED_ROOM';

export type Governorate = 'Cairo' | 'Giza' | 'Qalyubia';

export type VerificationStatus =
  | 'NOT_VERIFIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED';

export type ListingStatus = 'AVAILABLE' | 'RENTED' | 'HIDDEN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
  isLookingForRoommate: boolean;
  avatarUrl?: string;
  bio?: string;
  occupationOrUni?: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
  verificationDocumentType?: 'NATIONAL_ID' | 'PASSPORT' | 'STUDENT_ID' | 'ENROLLMENT_LETTER' | 'DEED';
  verificationDocumentNumber?: string;
  verificationSubmittedAt?: string;
  verificationReviewedAt?: string;
  originLocation?: string;
  studentType?: 'UPPER_EGYPT' | 'INTERNATIONAL' | 'LOCAL';
}

export interface NearestMetro {
  name: string;
  line: string;
  distanceMeters: number;
  walkingMinutes: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FamilyHostDetails {
  familyName: string;
  familyMembersOverview: string;
  mealsProvided: 'ALL_MEALS' | 'DINNER_ONLY' | 'BREAKFAST_AND_DINNER' | 'OPTIONAL_HOME_COOKING' | 'NONE';
  languagesSpoken: string[];
  welcomingCategories: ('UPPER_EGYPT' | 'INTERNATIONAL_STUDENT' | 'FRESH_GRADUATE' | 'FEMALE_STUDENT' | 'MALE_STUDENT')[];
  mentorshipNotes: string;
  curfewOrFamilyHabits?: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  accommodationType: AccommodationType;
  governorate: Governorate;
  city: string;
  neighborhood: string;
  address: string;
  priceEgp: number;
  depositEgp?: number;
  bedrooms: number;
  bathrooms: number;
  isFurnished: boolean;
  amenities: string[];
  images: string[];
  status: ListingStatus;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
  createdAt: string;
  viewsCount?: number;
  coordinates: Coordinates;
  nearestMetro?: NearestMetro;
  isFamilyHomestay?: boolean;
  familyHostDetails?: FamilyHostDetails;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    isVerifiedHost?: boolean;
    verificationStatus?: VerificationStatus;
  };
  rules?: string[];
  nearbyLandmarks?: string[];
}

export interface CampusTarget {
  id: string;
  name: string;
  shortName: string;
  governorate: Governorate;
  coordinates: Coordinates;
  landmark: string;
  faculties: string;
}

export interface RoommateProfile {
  id: string;
  userId: string;
  displayName: string;
  age?: number;
  gender?: 'Female' | 'Male' | 'Any';
  occupationOrUni: string;
  preferredArea: string;
  governorate: Governorate;
  budgetEgp: number;
  preferredType: AccommodationType;
  targetMoveInDate: string;
  bio: string;
  avatarUrl?: string;
  lifestyleHabits: {
    sleepSchedule: string;
    cleanliness: string;
    smoking: string;
    guests: string;
  };
  contactPhone: string;
  contactEmail: string;
  isDemo?: boolean;
  createdAt: string;
  verificationStatus: VerificationStatus;
  originCategory?: 'UPPER_EGYPT' | 'INTERNATIONAL' | 'LOCAL';
  originLocation?: string;
  isInterestedInFamilyHomestay?: boolean;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  seekerId: string;
  providerId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  moveInDate?: string;
  status: 'NEW' | 'CONTACTED' | 'ARCHIVED';
  createdAt: string;
}

export interface FamilyAdoptionRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  hostFamilyName: string;
  hostUserId: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  originCategory: 'UPPER_EGYPT' | 'INTERNATIONAL' | 'OTHER_GOVERNORATE';
  originLocation: string;
  universityAndFaculty: string;
  studyYearOrDegree: string;
  introductionStory: string;
  dietaryPreferences: string;
  targetMoveInDate: string;
  stayDurationMonths: number;
  status: 'PENDING_FAMILY_REVIEW' | 'ACCEPTED_FOR_MEETING' | 'DECLINED';
  createdAt: string;
}

export interface Report {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details: string;
  reporterEmail?: string;
  createdAt: string;
}

export interface FilterOptions {
  governorate?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  isFurnished?: string;
  amenity?: string;
  query?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'match_desc';
  targetCampusId?: string;
  familyHomestayOnly?: boolean;
  verificationFilter?: string;
}

