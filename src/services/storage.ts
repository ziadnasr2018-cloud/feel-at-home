import {
  Listing,
  RoommateProfile,
  Inquiry,
  Report,
  User,
  FilterOptions,
  FamilyAdoptionRequest,
  VerificationStatus,
} from '../types';
import { GREATER_CAIRO_CAMPUSES, calculateLocationMatch } from './locationMatch';

const STORAGE_KEYS = {
  LISTINGS: 'feel_at_home_listings_v3_egypt',
  ROOMMATES: 'feel_at_home_roommates_v3_egypt',
  SAVED_LISTINGS: 'feel_at_home_saved_v3_egypt',
  INQUIRIES: 'feel_at_home_inquiries_v3_egypt',
  FAMILY_REQUESTS: 'feel_at_home_family_requests_v3_egypt',
  REPORTS: 'feel_at_home_reports_v3_egypt',
  SELECTED_CAMPUS: 'feel_at_home_target_campus_v3',
  USERS: 'feel_at_home_users_v3_egypt',
};


// Realistic Greater Cairo Seed Data with Verification Badges & Student Origins
export const SEED_USERS: User[] = [
  {
    id: 'user-family-mama-nadia',
    email: 'mama.nadia@cairo-family.eg',
    fullName: 'Mama Nadia & El-Ghazaly Family',
    phoneNumber: '+20 10 7788 9900',
    role: 'PROVIDER',
    isLookingForRoommate: false,
    bio: 'Warm Egyptian family in Dokki. Opening our home to adopt and host university students from Upper Egypt and foreign countries. Home-cooked traditional meals and family support.',
    createdAt: '2024-01-10T10:00:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'DEED',
    verificationDocumentNumber: 'EGY-DOC-GIZA-88219',
    verificationReviewedAt: '2024-01-12T14:00:00Z',
  },
  {
    id: 'user-provider-cairo',
    email: 'ahmed.mostafa@cairo-homes.eg',
    fullName: 'Ahmed Mostafa',
    phoneNumber: '+20 10 1234 5678',
    role: 'PROVIDER',
    isLookingForRoommate: false,
    bio: 'Property host managing student flats in Nasr City and New Cairo for over 6 years.',
    createdAt: '2024-03-15T10:00:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'DEED',
    verificationDocumentNumber: 'EGY-DEED-NCR-40192',
    verificationReviewedAt: '2024-03-16T12:00:00Z',
  },
  {
    id: 'user-provider-giza',
    email: 'tarek.gammal@giza-apartments.eg',
    fullName: 'Tarek El-Gammal',
    phoneNumber: '+20 11 9876 5432',
    role: 'PROVIDER',
    isLookingForRoommate: false,
    bio: 'Architect offering student rooms and flats in Dokki and Sheikh Zayed.',
    createdAt: '2024-06-20T14:30:00Z',
    verificationStatus: 'VERIFICATION_PENDING',
    verificationDocumentType: 'NATIONAL_ID',
    verificationDocumentNumber: '28904150102938',
    verificationSubmittedAt: '2024-06-21T09:00:00Z',
  },
  {
    id: 'user-provider-qalyubia',
    email: 'sayed.shubra@gmail.com',
    fullName: 'Hajji Sayed Mahmoud',
    phoneNumber: '+20 12 4455 6677',
    role: 'PROVIDER',
    isLookingForRoommate: false,
    bio: 'Local family host with clean shared flats for students near Shubra Metro Station.',
    createdAt: '2024-08-10T09:15:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'DEED',
    verificationDocumentNumber: 'EGY-SHUBRA-PROP-1102',
    verificationReviewedAt: '2024-08-12T10:00:00Z',
  },
  {
    id: 'user-seeker-sarah',
    email: 'sarah.adel@cairo.edu.eg',
    fullName: 'Sarah Adel',
    phoneNumber: '+20 12 3344 5566',
    role: 'SEEKER',
    isLookingForRoommate: true,
    occupationOrUni: 'Pharmacy Student at Cairo University',
    bio: '3rd year pharmacy student looking for quiet flatmates in Dokki or Giza near faculties.',
    createdAt: '2024-09-01T12:00:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'STUDENT_ID',
    verificationDocumentNumber: 'CU-PHARM-2022-0941',
    verificationReviewedAt: '2024-09-03T11:00:00Z',
    studentType: 'LOCAL',
    originLocation: 'Giza, Greater Cairo',
  },
  {
    id: 'user-seeker-omar',
    email: 'omar.sherif@techhub.eg',
    fullName: 'Omar Sherif',
    phoneNumber: '+20 10 5566 7788',
    role: 'SEEKER',
    isLookingForRoommate: true,
    occupationOrUni: 'Junior Software Engineer at Smart Village',
    bio: 'Relocated from Alexandria for work. Looking to share a flat in Sheikh Zayed or Dokki.',
    createdAt: '2024-09-12T16:45:00Z',
    verificationStatus: 'VERIFICATION_PENDING',
    verificationDocumentType: 'NATIONAL_ID',
    verificationDocumentNumber: '29811200201844',
    verificationSubmittedAt: '2024-09-14T08:00:00Z',
    studentType: 'LOCAL',
    originLocation: 'Alexandria',
  },
  {
    id: 'user-seeker-ibrahim',
    email: 'ibrahim.assiut@cu.edu.eg',
    fullName: 'Ibrahim Abdel-Rahman',
    phoneNumber: '+20 11 4433 2211',
    role: 'SEEKER',
    isLookingForRoommate: true,
    occupationOrUni: '2nd Year Medicine at Cairo University (Kasr Al-Ainy)',
    bio: 'Medical student relocated from Assiut (Upper Egypt). Respectful, focused on studies, seeking quiet room or adoption by caring Egyptian family.',
    createdAt: '2024-09-15T10:00:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'ENROLLMENT_LETTER',
    verificationDocumentNumber: 'MED-KASR-ASSIUT-2023',
    verificationReviewedAt: '2024-09-16T15:00:00Z',
    studentType: 'UPPER_EGYPT',
    originLocation: 'Assiut (الصعيد), Upper Egypt',
  },
  {
    id: 'user-seeker-tariq',
    email: 'tariq.razak@azhar.edu.eg',
    fullName: 'Tariq Bin Razak',
    phoneNumber: '+20 15 8899 0011',
    role: 'SEEKER',
    isLookingForRoommate: true,
    occupationOrUni: 'Islamic Jurisprudence Student at Al-Azhar University',
    bio: 'International student from Malaysia studying in Cairo. Friendly, loves Egyptian culture, looking for welcoming Egyptian family homestay or student roommates.',
    createdAt: '2024-09-20T11:00:00Z',
    verificationStatus: 'VERIFIED',
    verificationDocumentType: 'PASSPORT',
    verificationDocumentNumber: 'MYS-PASS-A8940122',
    verificationReviewedAt: '2024-09-21T16:00:00Z',
    studentType: 'INTERNATIONAL',
    originLocation: 'Kuala Lumpur, Malaysia',
  },
];


// Egyptian student themed photos: Authentic student rooms with study desks, Cairo balconies, warm tiles, natural sunlight, ceiling fans, Cairo architecture
export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'cairo-homestay-nadia-01',
    userId: 'user-family-mama-nadia',
    title: 'Warm Egyptian Family Homestay & Mentorship — Mama Nadia’s Home (Dokki / Cairo Univ)',
    description:
      'A loving, respectful, and safe Egyptian family home opening its doors to "adopt" and host university students from Upper Egypt (صعيد مصر) or foreign international students. Located in quiet, green Dokki only 6 minutes walk from Cairo University and Metro Line 2. The student enjoys a private, bright bedroom with classic Cairo tile floors, wooden study desk, bookshelf, and wrought-iron balcony overlooking a quiet residential street. Includes daily home-cooked traditional Egyptian meals (breakfast & dinner with authentic molokhia, mahshi, and baked rice), laundry assistance, and supportive family mentorship. Feel at home as a true daughter/son of our family.',
    accommodationType: 'PRIVATE_ROOM',
    governorate: 'Giza',
    city: 'Dokki',
    neighborhood: 'Al-Mesaha & Iran Street',
    address: '19 Iran Street, Dokki, Giza',
    priceEgp: 3600,
    depositEgp: 3600,
    bedrooms: 1,
    bathrooms: 2,
    isFurnished: true,
    isFamilyHomestay: true,
    familyHostDetails: {
      familyName: 'Mama Nadia & El-Ghazaly Family',
      familyMembersOverview: 'Retired high school biology teacher & civil engineer couple. Two grown children who graduated from engineering and pharmacy. Warm, quiet, academic family.',
      mealsProvided: 'BREAKFAST_AND_DINNER',
      welcomingCategories: ['UPPER_EGYPT', 'INTERNATIONAL_STUDENT', 'FEMALE_STUDENT'],
      languagesSpoken: ['Arabic (Egyptian / Standard)', 'English'],
      mentorshipNotes: 'We treat our student as our own child. We assist with university enrollment, Cairo public transit orientation, doctor appointments if sick, and home-cooked family dinners.',
      curfewOrFamilyHabits: 'Family dinner together at 8:00 PM; quiet study hours after 10:30 PM; female student preferred.',
    },
    coordinates: { lat: 30.0384, lng: 31.2132 },
    nearestMetro: {
      name: 'Dokki Metro Station',
      line: 'Line 2 (Red)',
      distanceMeters: 400,
      walkingMinutes: 5,
    },
    amenities: [
      'High-speed WiFi',
      'Air Conditioning',
      'Natural Gas',
      'Washing Machine',
      'Elevator',
      'Near Metro Station',
      'Quiet Study Area',
      'Balcony',
      'Kitchen Appliances',
    ],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    isDemo: true,
    createdAt: '2025-01-08T10:00:00Z',
    viewsCount: 780,
    user: {
      id: 'user-family-mama-nadia',
      fullName: 'Mama Nadia & El-Ghazaly Family',
      phoneNumber: '+20 10 7788 9900',
      email: 'mama.nadia@cairo-family.eg',
      createdAt: '2024-01-10',
      isVerifiedHost: true,
      verificationStatus: 'VERIFIED',
    },
    rules: [
      'Welcomes students from Upper Egypt (الصعيد) and international students',
      'Family home atmosphere: respectful conduct and quiet study hours',
      'Non-smoking home',
    ],
    nearbyLandmarks: [
      'Cairo University Main Gate & Faculties — 6 min walk',
      'Dokki Metro Station (Line 2) — 5 min walk',
      'Mesaha Square & bookstores — 3 min walk',
    ],
  },
  {
    id: 'cairo-homestay-azhar-02',
    userId: 'user-provider-cairo',
    title: 'Traditional Egyptian Family Homestay in Nasr City — Hajji Mahmoud Family (Near Al-Azhar & Ain Shams)',
    description:
      'Caring Egyptian family home in Nasr City 7th District welcoming foreign Islamic/Arabic scholars and Upper Egypt students (Assiut, Sohag, Qena). Private study room with high-speed internet, air conditioning, and Egyptian patterned rug. Includes traditional home-cooked evening dinner with the family, weekend cultural outings, and a supportive environment away from loneliness.',
    accommodationType: 'PRIVATE_ROOM',
    governorate: 'Cairo',
    city: 'Nasr City',
    neighborhood: 'District 7 (Near Tayaran St)',
    address: '38 Tayaran Street, Nasr City, Cairo',
    priceEgp: 3200,
    depositEgp: 3200,
    bedrooms: 1,
    bathrooms: 2,
    isFurnished: true,
    isFamilyHomestay: true,
    familyHostDetails: {
      familyName: 'Hajji Mahmoud & Om Ahmed Family',
      familyMembersOverview: 'Respected senior couple living in a spacious 4-bedroom flat. Experienced with hosting Al-Azhar international students and Upper Egypt undergraduates.',
      mealsProvided: 'DINNER_ONLY',
      welcomingCategories: ['UPPER_EGYPT', 'INTERNATIONAL_STUDENT', 'MALE_STUDENT'],
      languagesSpoken: ['Arabic (Standard / Egyptian)', 'Basic English'],
      mentorshipNotes: 'We treat our student as our son. Full guidance on Cairo transport, neighborhood safety, and wholesome home meals every evening.',
      curfewOrFamilyHabits: 'Respectful home; study priority; male student preferred.',
    },
    coordinates: { lat: 30.0578, lng: 31.3392 },
    nearestMetro: {
      name: 'Cairo Stadium Station',
      line: 'Line 3 (Green)',
      distanceMeters: 750,
      walkingMinutes: 9,
    },
    amenities: [
      'High-speed WiFi',
      'Air Conditioning',
      'Near Metro Station',
      'Quiet Study Area',
      'Balcony',
      'Building Security',
      'Elevator',
    ],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ae1b46d3383e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    isDemo: true,
    createdAt: '2025-01-09T14:00:00Z',
    viewsCount: 520,
    user: {
      id: 'user-provider-cairo',
      fullName: 'Ahmed Mostafa (Rep. Mahmoud Family)',
      phoneNumber: '+20 10 1234 5678',
      email: 'ahmed.mostafa@cairo-homes.eg',
      createdAt: '2024-03-15',
      isVerifiedHost: true,
      verificationStatus: 'VERIFIED',
    },
    rules: [
      'Students from Upper Egypt and foreign countries warmly welcomed',
      'Quiet studying after 11 PM',
      'Shared family meals and cleanliness respected',
    ],
    nearbyLandmarks: [
      'Al-Azhar University Main Faculties — 8 min commute',
      'Ain Shams University — 12 min via Metro Line 3',
      'Abbas El-Akkad Commercial Strip — 4 min walk',
    ],
  },
  {
    id: 'cairo-dokki-01',
    userId: 'user-provider-giza',
    title: 'Sunny Furnished Student Room in Dokki — 5 Mins to Cairo Univ & Metro',
    description:
      'Authentic Dokki student room on quiet residential street by Mesaha Square. Features high ceilings, classic Cairo balcony with wrought iron railing, sturdy wooden student desk with reading lamp, bookshelf, single bed, wardrobe, and high-speed Wi-Fi. Shared renovated kitchen with natural gas stove and automatic washing machine. Female student or young doctor preferred.',
    accommodationType: 'PRIVATE_ROOM',
    governorate: 'Giza',
    city: 'Dokki',
    neighborhood: 'Mesaha Square & Tahrir St',
    address: '14 Al-Mesaha Street, Dokki, Giza',
    priceEgp: 3800,
    depositEgp: 3800,
    bedrooms: 1,
    bathrooms: 2,

    isFurnished: true,
    coordinates: { lat: 30.0384, lng: 31.2132 },
    nearestMetro: {
      name: 'Dokki Metro Station',
      line: 'Line 2 (Red)',
      distanceMeters: 420,
      walkingMinutes: 5,
    },
    amenities: [
      'High-speed WiFi',
      'Air Conditioning',
      'Natural Gas',
      'Washing Machine',
      'Elevator',
      'Near Metro Station',
      'Quiet Study Area',
      'Balcony',
    ],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-10T11:00:00Z',
    viewsCount: 412,
    user: {
      id: 'user-provider-giza',
      fullName: 'Tarek El-Gammal',
      phoneNumber: '+20 11 9876 5432',
      email: 'tarek.gammal@giza-apartments.eg',
      createdAt: '2024-06-20',
      isVerifiedHost: false,
    },
    rules: [
      'No smoking inside bedrooms (balcony permitted)',
      'Quiet study hours respected after 11:00 PM',
      'Egyptian lease agreement with national ID copy',
    ],
    nearbyLandmarks: [
      'Cairo University Main Gate — 7 min walk',
      'Dokki Metro Station (Line 2) — 5 min walk',
      'Faculty of Engineering & Pharmacy — 8 min walk',
    ],
  },
  {
    id: 'cairo-nasr-02',
    userId: 'user-provider-cairo',
    title: 'Spacious 2-Bedroom Student Flat in Nasr City District 7 (Near Abbas El-Akkad)',
    description:
      'Bright and well-ventilated apartment located steps from Abbas El-Akkad and Tayaran Street. Ideal for university students attending Ain Shams or Al-Azhar. Expansive living salon with classic Egyptian woodwork, 2 private study bedrooms, equipped kitchen with natural gas and refrigerator, and 24/7 building doorman.',
    accommodationType: 'PRIVATE_APARTMENT',
    governorate: 'Cairo',
    city: 'Nasr City',
    neighborhood: 'District 7 (Near Abbas El-Akkad)',
    address: '42 Tayaran Street, 7th District, Nasr City, Cairo',
    priceEgp: 7500,
    depositEgp: 7500,
    bedrooms: 2,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.0578, lng: 31.3392 },
    nearestMetro: {
      name: 'Cairo Stadium Station',
      line: 'Line 3 (Green)',
      distanceMeters: 1600,
      walkingMinutes: 18,
    },
    amenities: [
      'Air Conditioning',
      'Building Security',
      'Elevator',
      'Natural Gas',
      'Kitchen Appliances',
      'Balcony',
      'High-speed WiFi',
    ],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ae1b46d3383e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'VERIFICATION_PENDING',
    isDemo: true,
    createdAt: '2025-01-14T08:20:00Z',
    viewsCount: 512,
    user: {
      id: 'user-provider-cairo',
      fullName: 'Ahmed Mostafa',
      phoneNumber: '+20 10 1234 5678',
      email: 'ahmed.mostafa@cairo-homes.eg',
      createdAt: '2024-03-15',
    },
    rules: [
      'Contract minimum: 1 academic semester',
      'Group of students or engineering trainees welcome',
    ],
    nearbyLandmarks: [
      'Abbas El-Akkad Commercial Strip — 3 min walk',
      'Ain Shams Engineering bus link — 4 min walk',
      'City Stars Mall & supermarkets — 6 min drive',
    ],
  },
  {
    id: 'cairo-newcairo-03',
    userId: 'user-provider-cairo',
    title: 'Quiet Student Villa Room in New Cairo near GUC & AUC Campuses',
    description:
      'Private master room inside a quiet residential duplex villa in the 3rd Settlement. Overlooking a sunny private garden with palm trees. Perfect for AUC or GUC students or engineers working in New Cairo business district. Private en-suite bathroom, split AC, study desk, and fiber WiFi included in rent.',
    accommodationType: 'PRIVATE_ROOM',
    governorate: 'Cairo',
    city: 'New Cairo',
    neighborhood: '3rd Settlement (South of 90th St)',
    address: 'Villa 84, Al-Narges Extension, New Cairo',
    priceEgp: 5200,
    depositEgp: 5200,
    bedrooms: 1,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.0082, lng: 31.4285 },
    nearestMetro: {
      name: 'Adly Mansour Transit Hub',
      line: 'Line 3 / LRT connection',
      distanceMeters: 7500,
      walkingMinutes: 45,
    },
    amenities: [
      'High-speed WiFi',
      'Air Conditioning',
      'Quiet Study Area',
      'Balcony',
      'Building Security',
      'Kitchen Appliances',
      'Washing Machine',
    ],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-18T15:00:00Z',
    viewsCount: 289,
    user: {
      id: 'user-provider-cairo',
      fullName: 'Ahmed Mostafa',
      phoneNumber: '+20 10 1234 5678',
      email: 'ahmed.mostafa@cairo-homes.eg',
      createdAt: '2024-03-15',
    },
    rules: [
      'Clean living habits required',
      'Quiet study atmosphere maintained',
      'Single student occupant only',
    ],
    nearbyLandmarks: [
      'German University in Cairo (GUC) — 5 min commute',
      'American University in Cairo (AUC) — 11 min commute',
      'South 90th Street & Concord Plaza — 6 min drive',
    ],
  },
  {
    id: 'qalyubia-shubra-04',
    userId: 'user-provider-qalyubia',
    title: 'Budget Shared Student Bed/Room — 3 Mins Walk to Shubra Metro (Line 2)',
    description:
      'Economical shared student room in a clean apartment directly opposite Shubra El-Kheima Metro station. A lifesaver for students traveling daily to Shoubra Faculty of Engineering (Benha University), Ain Shams University, or downtown institutions without paying high central Cairo rents. Includes natural gas, hot water heater, refrigerator, and shared study desk.',
    accommodationType: 'SHARED_ROOM',
    governorate: 'Qalyubia',
    city: 'Shubra El-Kheima',
    neighborhood: 'Near Metro & 15th of May Street',
    address: '8 Al-Horreya Street, Shubra El-Kheima, Qalyubia',
    priceEgp: 1850,
    depositEgp: 1850,
    bedrooms: 1,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.1226, lng: 31.2449 },
    nearestMetro: {
      name: 'Shubra El-Kheima Metro Station',
      line: 'Line 2 (Red Terminus)',
      distanceMeters: 280,
      walkingMinutes: 3,
    },
    amenities: [
      'Near Metro Station',
      'Natural Gas',
      'Water Heater',
      'Quiet Study Area',
      'Kitchen Appliances',
    ],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-20T09:40:00Z',
    viewsCount: 680,
    user: {
      id: 'user-provider-qalyubia',
      fullName: 'Hajji Sayed Mahmoud',
      phoneNumber: '+20 12 4455 6677',
      email: 'sayed.shubra@gmail.com',
      createdAt: '2024-08-10',
    },
    rules: [
      'Male student or intern flat only',
      'Rent due on the 1st of each month',
      'Shared cleaning rotation',
    ],
    nearbyLandmarks: [
      'Shubra El-Kheima Metro Station — 3 min walk',
      'Shoubra Faculty of Engineering (Benha Univ) — 15 min bus / 4 metro stops',
      'Ramses Central Station — 14 min metro direct',
    ],
  },
  {
    id: 'giza-zayed-05',
    userId: 'user-provider-giza',
    title: 'Modern 1-Bedroom Flat in Sheikh Zayed near Hyper One & Smart Village',
    description:
      'Chic and contemporary 1-bedroom flat in a secure residential neighborhood in Sheikh Zayed. Ideal for young software engineers working at Smart Village, Nile University students, or relocating professionals. Features open-concept kitchen, split AC, study work corner, and sunny terrace overlooking palm gardens.',
    accommodationType: 'PRIVATE_APARTMENT',
    governorate: 'Giza',
    city: 'Sheikh Zayed',
    neighborhood: 'District 1 (Behind Hyper One)',
    address: 'Building 19, District 1, Sheikh Zayed, Giza',
    priceEgp: 8900,
    depositEgp: 8900,
    bedrooms: 1,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.0487, lng: 31.0024 },
    nearestMetro: {
      name: 'Cairo Monorail Zayed Station (Under Const)',
      line: 'West Nile Monorail',
      distanceMeters: 1200,
      walkingMinutes: 14,
    },
    amenities: [
      'High-speed WiFi',
      'Air Conditioning',
      'Building Security',
      'Balcony',
      'Kitchen Appliances',
      'Washing Machine',
      'Elevator',
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-22T13:10:00Z',
    viewsCount: 410,
    user: {
      id: 'user-provider-giza',
      fullName: 'Tarek El-Gammal',
      phoneNumber: '+20 11 9876 5432',
      email: 'tarek.gammal@giza-apartments.eg',
      createdAt: '2024-06-20',
    },
    rules: [
      'Non-smoking preferred indoors',
      'Quiet working environment maintained',
    ],
    nearbyLandmarks: [
      'Hyper One Zayed — 4 min walk',
      'Smart Village Corporate Campus — 10 min drive',
      'Nile University — 7 min drive',
    ],
  },
  {
    id: 'qalyubia-benha-06',
    userId: 'user-provider-qalyubia',
    title: 'Student 3-Bedroom Shared Apartment in Benha near Faculty of Medicine',
    description:
      'Spacious 3-bedroom apartment designed specifically for university students studying at Benha University. Located on main Fareed Nada street with constant microbus availability. Includes 3 separate study bedrooms with desks, full kitchen with natural gas, water heater, and shared dining table. Shared utilities split equally among flatmates.',
    accommodationType: 'SHARED_APARTMENT',
    governorate: 'Qalyubia',
    city: 'Benha',
    neighborhood: 'Fareed Nada Street / Al-Ahram',
    address: 'Fareed Nada Main St, Benha, Qalyubia',
    priceEgp: 3200,
    depositEgp: 3200,
    bedrooms: 3,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.4612, lng: 31.1819 },
    nearestMetro: {
      name: 'Benha Central Train Station',
      line: 'Egypt Railways / Cairo commuter line',
      distanceMeters: 1100,
      walkingMinutes: 12,
    },
    amenities: [
      'Natural Gas',
      'Water Heater',
      'Balcony',
      'Kitchen Appliances',
      'Quiet Study Area',
    ],
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-24T10:15:00Z',
    viewsCount: 220,
    user: {
      id: 'user-provider-qalyubia',
      fullName: 'Hajji Sayed Mahmoud',
      phoneNumber: '+20 12 4455 6677',
      email: 'sayed.shubra@gmail.com',
      createdAt: '2024-08-10',
    },
    rules: [
      'Strictly students of Benha University',
      'Academic focus and mutual respect required',
    ],
    nearbyLandmarks: [
      'Benha University Faculty of Medicine & Science — 6 min walk',
      'Benha Central Train Station — 10 min taxi',
    ],
  },
  {
    id: 'cairo-abbaseya-07',
    userId: 'user-provider-cairo',
    title: 'Student Flat Room in Abbaseya — 4 Mins to Ain Shams Univ & Metro Line 3',
    description:
      'Private bedroom in a friendly 3-student flat in Abbaseya. Only 300 meters from Abbaseya Metro station (Line 3) and 8 minutes walking to Ain Shams University Main Campus & Faculty of Science. Includes single bed, study desk with lamp, clothes wardrobe, and shared high-speed Wi-Fi.',
    accommodationType: 'PRIVATE_ROOM',
    governorate: 'Cairo',
    city: 'Abbaseya',
    neighborhood: 'Near Abbaseya Square & Metro',
    address: '22 Al-Geish Street, Abbaseya, Cairo',
    priceEgp: 2900,
    depositEgp: 2900,
    bedrooms: 1,
    bathrooms: 1,
    isFurnished: true,
    coordinates: { lat: 30.0715, lng: 31.2812 },
    nearestMetro: {
      name: 'Abbaseya Metro Station',
      line: 'Line 3 (Green)',
      distanceMeters: 320,
      walkingMinutes: 4,
    },
    amenities: [
      'Near Metro Station',
      'High-speed WiFi',
      'Natural Gas',
      'Water Heater',
      'Elevator',
      'Quiet Study Area',
    ],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-26T16:20:00Z',
    viewsCount: 450,
    user: {
      id: 'user-provider-cairo',
      fullName: 'Ahmed Mostafa',
      phoneNumber: '+20 10 1234 5678',
      email: 'ahmed.mostafa@cairo-homes.eg',
      createdAt: '2024-03-15',
    },
    rules: [
      'Male student only',
      'Shared cleaning rotation weekly',
    ],
    nearbyLandmarks: [
      'Ain Shams University Main Gate — 8 min walk',
      'Abbaseya Metro (Line 3) — 4 min walk',
      'Al-Demerdash Hospital & Faculty of Medicine — 10 min walk',
    ],
  },
  {
    id: 'cairo-maadi-08',
    userId: 'user-provider-giza',
    title: 'Sunny Unfurnished 2-Bedroom Flat in Maadi Degla near Metro Line 1',
    description:
      'Charming 2-bedroom unfurnished flat on a tranquil tree-lined street in Maadi Degla. Excellent opportunity for long-term tenants who prefer bringing their own furniture. Features high ceilings, solid parquet flooring, renovated bathroom, and a spacious balcony.',
    accommodationType: 'PRIVATE_APARTMENT',
    governorate: 'Cairo',
    city: 'Maadi',
    neighborhood: 'Maadi Degla (Near Road 233)',
    address: 'Road 218, Degla, Maadi, Cairo',
    priceEgp: 6800,
    depositEgp: 13600,
    bedrooms: 2,
    bathrooms: 1,
    isFurnished: false,
    coordinates: { lat: 29.9612, lng: 31.2785 },
    nearestMetro: {
      name: 'Maadi Metro Station',
      line: 'Line 1 (Blue)',
      distanceMeters: 950,
      walkingMinutes: 11,
    },
    amenities: [
      'Balcony',
      'Natural Gas',
      'Building Security',
      'Elevator',
    ],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ae1b46d3383e?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'AVAILABLE',
    verificationStatus: 'NOT_VERIFIED',
    isDemo: true,
    createdAt: '2025-01-28T12:00:00Z',
    viewsCount: 195,
    user: {
      id: 'user-provider-giza',
      fullName: 'Tarek El-Gammal',
      phoneNumber: '+20 11 9876 5432',
      email: 'tarek.gammal@giza-apartments.eg',
      createdAt: '2024-06-20',
    },
    rules: ['1 year minimum lease contract', 'Post-dated checks or formal contract required'],
    nearbyLandmarks: [
      'Degla Square cafes & groceries — 2 min walk',
      'Maadi Metro Station — 11 min walk',
      'Wadi Degla Protectorate — 8 min drive',
    ],
  },
];

export const INITIAL_ROOMMATES: RoommateProfile[] = [
  {
    id: 'roommate-sarah',
    userId: 'user-seeker-sarah',
    displayName: 'Sarah Adel',
    age: 21,
    gender: 'Female',
    occupationOrUni: 'Pharmacy Student at Cairo University',
    preferredArea: 'Dokki, Giza or Mohandessin',
    governorate: 'Giza',
    budgetEgp: 3500,
    preferredType: 'PRIVATE_ROOM',
    targetMoveInDate: 'Next Month (Start of Semester)',
    bio: 'Hi! I am a 3rd year pharmacy student at Cairo University. Studious, tidy, and respectful of personal space. I cook light meals and sleep early on weekdays. Looking for a female roommate to share a nice 2-bedroom flat near Cairo University or Dokki Metro.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Early Bird (Sleep 11 PM)',
      cleanliness: 'Daily / Very Strict',
      smoking: 'Non-Smoker strictly',
      guests: 'Occasional female study friends only',
    },
    contactPhone: '+20 12 3344 5566',
    contactEmail: 'sarah.adel@cairo.edu.eg',
    isDemo: true,
    verificationStatus: 'VERIFIED',
    originCategory: 'LOCAL',
    originLocation: 'Giza, Greater Cairo',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'roommate-ibrahim',
    userId: 'user-seeker-ibrahim',
    displayName: 'Ibrahim Abdel-Rahman',
    age: 21,
    gender: 'Male',
    occupationOrUni: '2nd Year Medicine at Kasr Al-Ainy (Cairo Univ)',
    preferredArea: 'Dokki, El-Manial, or Giza (Near Kasr Al-Ainy)',
    governorate: 'Giza',
    budgetEgp: 3000,
    preferredType: 'PRIVATE_ROOM',
    targetMoveInDate: 'Immediate',
    bio: 'Medical student relocated from Assiut (Upper Egypt). Polite, quiet, dedicated to long study hours. Miss home-cooked Egyptian meals and seeking a peaceful flat or Egyptian family homestay where I can focus on medicine.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Midnight / Study Nights',
      cleanliness: 'Very Clean & Orderly',
      smoking: 'Non-Smoker strictly',
      guests: 'Quiet study sessions only',
    },
    contactPhone: '+20 11 4433 2211',
    contactEmail: 'ibrahim.assiut@cu.edu.eg',
    isDemo: true,
    verificationStatus: 'VERIFIED',
    originCategory: 'UPPER_EGYPT',
    originLocation: 'Assiut (الصعيد), Upper Egypt',
    isInterestedInFamilyHomestay: true,
    createdAt: '2025-01-16T11:00:00Z',
  },
  {
    id: 'roommate-tariq',
    userId: 'user-seeker-tariq',
    displayName: 'Tariq Bin Razak',
    age: 22,
    gender: 'Male',
    occupationOrUni: 'Islamic Law & Arabic Student at Al-Azhar University',
    preferredArea: 'Nasr City 7th/10th District or Abbaseya',
    governorate: 'Cairo',
    budgetEgp: 3400,
    preferredType: 'PRIVATE_ROOM',
    targetMoveInDate: 'Within 2 Weeks',
    bio: 'International student from Malaysia studying Islamic Jurisprudence at Al-Azhar. Love Egypt and the welcoming Egyptian people. Respectful, loves learning Egyptian cooking, looking for an Egyptian family host or trustworthy student roommates.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Early Bird (Up for Fajr prayer)',
      cleanliness: 'High Standards',
      smoking: 'Non-Smoker strictly',
      guests: 'Rarely / Study related only',
    },
    contactPhone: '+20 15 8899 0011',
    contactEmail: 'tariq.razak@azhar.edu.eg',
    isDemo: true,
    verificationStatus: 'VERIFIED',
    originCategory: 'INTERNATIONAL',
    originLocation: 'Kuala Lumpur, Malaysia',
    isInterestedInFamilyHomestay: true,
    createdAt: '2025-01-17T09:30:00Z',
  },
  {
    id: 'roommate-omar',
    userId: 'user-seeker-omar',
    displayName: 'Omar Sherif',
    age: 24,
    gender: 'Male',
    occupationOrUni: 'Junior Software Engineer at Smart Village',
    preferredArea: 'Sheikh Zayed, 6th of October, or Dokki',
    governorate: 'Giza',
    budgetEgp: 4500,
    preferredType: 'PRIVATE_ROOM',
    targetMoveInDate: 'Immediate',
    bio: 'Working hybrid schedule (3 days at Smart Village office, 2 days remote). Easygoing, polite, tech enthusiast. Looking for a neat flatmate to split an apartment in Zayed or near Mehwar.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Flexible / Night Owl',
      cleanliness: 'Moderate & Tidy',
      smoking: 'Balcony Only',
      guests: 'Occasional friends on weekends',
    },
    contactPhone: '+20 10 5566 7788',
    contactEmail: 'omar.sherif@techhub.eg',
    isDemo: true,
    verificationStatus: 'VERIFICATION_PENDING',
    originCategory: 'LOCAL',
    originLocation: 'Alexandria',
    createdAt: '2025-01-18T14:30:00Z',
  },
  {
    id: 'roommate-mariam',
    userId: 'user-seeker-mariam',
    displayName: 'Mariam Hassan',
    age: 22,
    gender: 'Female',
    occupationOrUni: 'Media & Mass Comm Senior at Ain Shams',
    preferredArea: 'Nasr City, Heliopolis, or Abbaseya',
    governorate: 'Cairo',
    budgetEgp: 3200,
    preferredType: 'SHARED_APARTMENT',
    targetMoveInDate: 'Within 2 Weeks',
    bio: 'Relocating from Mansoura for my final academic year and graduation project. Friendly, love making coffee, quiet study environment is essential.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Average (Midnight)',
      cleanliness: 'High cleanliness standards',
      smoking: 'Non-Smoker strictly',
      guests: 'Quiet study study-group only',
    },
    contactPhone: '+20 10 9988 7766',
    contactEmail: 'mariam.hassan@ainshams.edu.eg',
    isDemo: true,
    verificationStatus: 'NOT_VERIFIED',
    originCategory: 'LOCAL',
    originLocation: 'Mansoura',
    createdAt: '2025-01-22T11:20:00Z',
  },
  {
    id: 'roommate-youssef',
    userId: 'user-seeker-youssef',
    displayName: 'Youssef Taha',
    age: 20,
    gender: 'Male',
    occupationOrUni: 'Engineering Student at Shoubra (Benha Univ)',
    preferredArea: 'Shubra El-Kheima, Shoubra, or Downtown',
    governorate: 'Qalyubia',
    budgetEgp: 2000,
    preferredType: 'SHARED_ROOM',
    targetMoveInDate: 'Immediate',
    bio: '2nd year mechanical engineering student. Need a shared room close to Metro Line 2 to commute daily without exhaustion. Serious about studying.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    lifestyleHabits: {
      sleepSchedule: 'Early Bird (Up at 6:30 AM)',
      cleanliness: 'Organized & cooperative',
      smoking: 'Non-Smoker',
      guests: 'Rarely',
    },
    contactPhone: '+20 12 1122 3344',
    contactEmail: 'youssef.taha@eng.bu.edu.eg',
    isDemo: true,
    verificationStatus: 'NOT_VERIFIED',
    originCategory: 'LOCAL',
    originLocation: 'Qalyubia',
    createdAt: '2025-01-25T17:00:00Z',
  },
];

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }

  constructor() {
    this.ensureInitialized();
  }

  public ensureInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      this.set(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROOMMATES)) {
      this.set(STORAGE_KEYS.ROOMMATES, INITIAL_ROOMMATES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_LISTINGS)) {
      this.set(STORAGE_KEYS.SAVED_LISTINGS, ['cairo-dokki-01']);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      const sampleInquiries: Inquiry[] = [
        {
          id: 'inq-sample-1',
          listingId: 'cairo-dokki-01',
          listingTitle: 'Sunny Furnished Student Room in Dokki — 5 Mins to Cairo Univ & Metro',
          listingLocation: 'Dokki, Giza',
          seekerId: 'user-seeker-sarah',
          providerId: 'user-provider-giza',
          name: 'Sarah Adel',
          phone: '+20 12 3344 5566',
          email: 'sarah.adel@cairo.edu.eg',
          message:
            'Hello Mr. Tarek, I am a 3rd year pharmacy student at Cairo University. Is the room still available for move-in next semester? I would love to arrange an in-person viewing this Saturday afternoon.',
          moveInDate: '2025-02-15',
          status: 'NEW',
          createdAt: '2025-01-28T14:30:00Z',
        },
      ];
      this.set(STORAGE_KEYS.INQUIRIES, sampleInquiries);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAMILY_REQUESTS)) {
      const sampleFamilyRequests: FamilyAdoptionRequest[] = [
        {
          id: 'fam-req-ibrahim-1',
          listingId: 'cairo-homestay-nadia-01',
          listingTitle: 'Warm Egyptian Family Homestay & Mentorship — Mama Nadia’s Home (Dokki / Cairo Univ)',
          hostFamilyName: 'Mama Nadia & El-Ghazaly Family',
          hostUserId: 'user-family-mama-nadia',
          seekerId: 'user-seeker-ibrahim',
          seekerName: 'Ibrahim Abdel-Rahman',
          seekerEmail: 'ibrahim.assiut@cu.edu.eg',
          seekerPhone: '+20 11 4433 2211',
          originCategory: 'UPPER_EGYPT',
          originLocation: 'Assiut (الصعيد), Upper Egypt',
          universityAndFaculty: 'Cairo University — Kasr Al-Ainy Medicine',
          studyYearOrDegree: '2nd Year Medicine',
          introductionStory: 'Peace be upon you Mama Nadia. I am a medical student relocated from Assiut. My parents were very worried about me living alone in Cairo without guidance or good food. Your home feels like my own family in Assiut, and being close to Kasr Al-Ainy will help me study peacefully.',
          dietaryPreferences: 'Traditional Upper Egypt cuisine, loves molokhia and mahshi, non-smoker.',
          targetMoveInDate: '2025-02-15',
          stayDurationMonths: 10,
          status: 'ACCEPTED_FOR_MEETING',
          createdAt: '2025-01-26T12:00:00Z',
        },
        {
          id: 'fam-req-tariq-2',
          listingId: 'cairo-homestay-azhar-02',
          listingTitle: 'Traditional Egyptian Family Homestay in Nasr City — Hajji Mahmoud Family (Near Al-Azhar & Ain Shams)',
          hostFamilyName: 'Hajji Mahmoud & Om Ahmed Family',
          hostUserId: 'user-provider-cairo',
          seekerId: 'user-seeker-tariq',
          seekerName: 'Tariq Bin Razak',
          seekerEmail: 'tariq.razak@azhar.edu.eg',
          seekerPhone: '+20 15 8899 0011',
          originCategory: 'INTERNATIONAL',
          originLocation: 'Kuala Lumpur, Malaysia',
          universityAndFaculty: 'Al-Azhar University — Faculty of Sharia & Islamic Law',
          studyYearOrDegree: '1st Year Undergraduate',
          introductionStory: 'As-salamu alaykum Hajji Mahmoud. I came from Malaysia to study at Al-Azhar. I want to practice Egyptian Arabic and experience true Egyptian warmth and family traditions instead of staying in an isolated flat.',
          dietaryPreferences: 'Halal meals, fond of Egyptian foul and lentils, quiet student habits.',
          targetMoveInDate: '2025-02-20',
          stayDurationMonths: 12,
          status: 'PENDING_FAMILY_REVIEW',
          createdAt: '2025-01-28T16:00:00Z',
        },
      ];
      this.set(STORAGE_KEYS.FAMILY_REQUESTS, sampleFamilyRequests);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      this.set(STORAGE_KEYS.REPORTS, []);
    }
  }

  // Target Campus Selection for Commute Matching
  public getTargetCampusId(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CAMPUS) || 'cairo-univ';
  }

  public setTargetCampusId(campusId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CAMPUS, campusId);
    } catch {}
  }

  // Listings CRUD with Campus Location Matching
  public getListings(filters?: FilterOptions): Listing[] {
    this.ensureInitialized();
    let listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);

    if (!filters) return listings;

    if (filters.familyHomestayOnly) {
      listings = listings.filter((l) => l.isFamilyHomestay === true);
    }

    if (filters.verificationFilter && filters.verificationFilter !== 'ALL') {
      listings = listings.filter((l) => l.verificationStatus === filters.verificationFilter);
    }


    if (filters.governorate && filters.governorate !== 'ALL') {
      listings = listings.filter((l) => l.governorate === filters.governorate);
    }

    if (filters.city && filters.city !== 'ALL') {
      listings = listings.filter((l) =>
        l.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.type && filters.type !== 'ALL') {
      listings = listings.filter((l) => l.accommodationType === filters.type);
    }

    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      listings = listings.filter((l) => l.priceEgp >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice) && filters.maxPrice > 0) {
      listings = listings.filter((l) => l.priceEgp <= filters.maxPrice!);
    }

    if (filters.bedrooms && filters.bedrooms !== 'ALL') {
      const bCount = parseInt(filters.bedrooms);
      if (bCount === 3) {
        listings = listings.filter((l) => l.bedrooms >= 3);
      } else {
        listings = listings.filter((l) => l.bedrooms === bCount);
      }
    }

    if (filters.isFurnished && filters.isFurnished !== 'ALL') {
      const isFurnished = filters.isFurnished === 'true';
      listings = listings.filter((l) => l.isFurnished === isFurnished);
    }

    if (filters.amenity && filters.amenity !== 'ALL') {
      listings = listings.filter((l) =>
        l.amenities.some((a) =>
          a.toLowerCase().includes(filters.amenity!.toLowerCase())
        )
      );
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.neighborhood.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.governorate.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      );
    }

    // Sort by Match Percentage if requested
    const targetCampus = GREATER_CAIRO_CAMPUSES.find(
      (c) => c.id === (filters.targetCampusId || this.getTargetCampusId())
    ) || GREATER_CAIRO_CAMPUSES[0];

    if (filters.sort === 'match_desc') {
      listings.sort((a, b) => {
        const scoreA = calculateLocationMatch(a, targetCampus, filters.maxPrice).matchPercentage;
        const scoreB = calculateLocationMatch(b, targetCampus, filters.maxPrice).matchPercentage;
        return scoreB - scoreA;
      });
    } else if (filters.sort === 'price_asc') {
      listings.sort((a, b) => a.priceEgp - b.priceEgp);
    } else if (filters.sort === 'price_desc') {
      listings.sort((a, b) => b.priceEgp - a.priceEgp);
    } else {
      listings.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return listings;
  }

  public getListingById(id: string): Listing | null {
    this.ensureInitialized();
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    return listings.find((l) => l.id === id) || null;
  }

  public createListing(
    listingData: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'isDemo' | 'verificationStatus'>,
    currentUser: User
  ): Listing {
    this.ensureInitialized();
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);

    const newListing: Listing = {
      ...listingData,
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: currentUser.id,
      isDemo: false,
      verificationStatus: 'NOT_VERIFIED',
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        isVerifiedHost: false,
      },
    };

    listings.unshift(newListing);
    this.set(STORAGE_KEYS.LISTINGS, listings);
    return newListing;
  }

  public updateListing(id: string, updates: Partial<Listing>, userId: string): Listing {
    this.ensureInitialized();
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const index = listings.findIndex((l) => l.id === id);

    if (index === -1) throw new Error('Listing not found');
    const existing = listings[index];

    if (existing.userId !== userId && !existing.isDemo) {
      throw new Error('Unauthorized: You can only edit your own listings.');
    }

    const updated: Listing = {
      ...existing,
      ...updates,
      id: existing.id,
      userId: existing.userId,
      verificationStatus: existing.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'NOT_VERIFIED',
    };

    listings[index] = updated;
    this.set(STORAGE_KEYS.LISTINGS, listings);
    return updated;
  }

  public deleteListing(id: string, userId: string): boolean {
    this.ensureInitialized();
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const existing = listings.find((l) => l.id === id);

    if (!existing) return false;
    if (existing.userId !== userId && !existing.isDemo) {
      throw new Error('Unauthorized: You can only delete your own listings.');
    }

    const filtered = listings.filter((l) => l.id !== id);
    this.set(STORAGE_KEYS.LISTINGS, filtered);
    return true;
  }

  public toggleListingStatus(id: string, userId: string): Listing {
    this.ensureInitialized();
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Listing not found');

    const item = listings[index];
    item.status = item.status === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE';
    listings[index] = item;
    this.set(STORAGE_KEYS.LISTINGS, listings);
    return item;
  }

  // Saved Listings / Favorites
  public getSavedListingIds(userId: string): string[] {
    this.ensureInitialized();
    const userKey = `${STORAGE_KEYS.SAVED_LISTINGS}_${userId}`;
    return this.get<string[]>(userKey, ['cairo-dokki-01']);
  }

  public toggleSaveListing(userId: string, listingId: string): boolean {
    this.ensureInitialized();
    const userKey = `${STORAGE_KEYS.SAVED_LISTINGS}_${userId}`;
    const saved = this.getSavedListingIds(userId);
    const exists = saved.includes(listingId);

    let updated: string[];
    if (exists) {
      updated = saved.filter((id) => id !== listingId);
    } else {
      updated = [...saved, listingId];
    }

    this.set(userKey, updated);
    return !exists;
  }

  // Roommate Profiles
  public getRoommateProfiles(filters?: { area?: string; budget?: number; type?: string }): RoommateProfile[] {
    this.ensureInitialized();
    let profiles = this.get<RoommateProfile[]>(STORAGE_KEYS.ROOMMATES, INITIAL_ROOMMATES);

    if (filters?.area && filters.area.trim()) {
      const a = filters.area.toLowerCase().trim();
      profiles = profiles.filter(
        (p) =>
          p.preferredArea.toLowerCase().includes(a) ||
          p.governorate.toLowerCase().includes(a)
      );
    }

    if (filters?.budget && filters.budget > 0) {
      profiles = profiles.filter((p) => p.budgetEgp <= filters.budget!);
    }

    if (filters?.type && filters.type !== 'ALL') {
      profiles = profiles.filter((p) => p.preferredType === filters.type);
    }

    return profiles;
  }

  public saveRoommateProfile(
    profileData: Omit<RoommateProfile, 'id' | 'createdAt' | 'isDemo'>,
    currentUser: User
  ): RoommateProfile {
    this.ensureInitialized();
    const profiles = this.get<RoommateProfile[]>(STORAGE_KEYS.ROOMMATES, INITIAL_ROOMMATES);
    const existingIndex = profiles.findIndex((p) => p.userId === currentUser.id);

    const fullProfile: RoommateProfile = {
      ...profileData,
      id: existingIndex !== -1 ? profiles[existingIndex].id : `rm-${Date.now()}`,
      userId: currentUser.id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      profiles[existingIndex] = fullProfile;
    } else {
      profiles.unshift(fullProfile);
    }

    this.set(STORAGE_KEYS.ROOMMATES, profiles);
    return fullProfile;
  }

  public getRoommateProfileByUserId(userId: string): RoommateProfile | null {
    this.ensureInitialized();
    const profiles = this.get<RoommateProfile[]>(STORAGE_KEYS.ROOMMATES, INITIAL_ROOMMATES);
    return profiles.find((p) => p.userId === userId) || null;
  }

  // Inquiries
  public createInquiry(
    inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
  ): Inquiry {
    this.ensureInitialized();
    const inquiries = this.get<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);

    const newInq: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInq);
    this.set(STORAGE_KEYS.INQUIRIES, inquiries);
    return newInq;
  }

  public getInquiriesForProvider(providerId: string): Inquiry[] {
    this.ensureInitialized();
    const inquiries = this.get<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    return inquiries.filter((inq) => inq.providerId === providerId);
  }

  public getInquiriesForSeeker(seekerId: string): Inquiry[] {
    this.ensureInitialized();
    const inquiries = this.get<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    return inquiries.filter((inq) => inq.seekerId === seekerId);
  }

  // Reports
  public createReport(reportData: Omit<Report, 'id' | 'createdAt'>): Report {
    this.ensureInitialized();
    const reports = this.get<Report[]>(STORAGE_KEYS.REPORTS, []);
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    this.set(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  }

  public getReports(): Report[] {
    this.ensureInitialized();
    return this.get<Report[]>(STORAGE_KEYS.REPORTS, []);
  }

  // Egyptian Family Adoption & Homestay Requests
  public getFamilyRequests(): FamilyAdoptionRequest[] {
    this.ensureInitialized();
    return this.get<FamilyAdoptionRequest[]>(STORAGE_KEYS.FAMILY_REQUESTS, []);
  }

  public getFamilyRequestsForSeeker(seekerId: string): FamilyAdoptionRequest[] {
    return this.getFamilyRequests().filter((r) => r.seekerId === seekerId);
  }

  public getFamilyRequestsForHost(hostUserId: string): FamilyAdoptionRequest[] {
    return this.getFamilyRequests().filter((r) => r.hostUserId === hostUserId);
  }

  public createFamilyRequest(
    reqData: Omit<FamilyAdoptionRequest, 'id' | 'createdAt' | 'status'>
  ): FamilyAdoptionRequest {
    this.ensureInitialized();
    const all = this.getFamilyRequests();
    const newReq: FamilyAdoptionRequest = {
      ...reqData,
      id: `fam-req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'PENDING_FAMILY_REVIEW',
      createdAt: new Date().toISOString(),
    };
    all.unshift(newReq);
    this.set(STORAGE_KEYS.FAMILY_REQUESTS, all);
    return newReq;
  }

  public updateFamilyRequestStatus(
    id: string,
    status: 'ACCEPTED_FOR_MEETING' | 'DECLINED'
  ): FamilyAdoptionRequest {
    this.ensureInitialized();
    const all = this.getFamilyRequests();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Request not found');
    all[index] = { ...all[index], status };
    this.set(STORAGE_KEYS.FAMILY_REQUESTS, all);
    return all[index];
  }

  // Account Verification Management
  public updateUserVerification(
    userId: string,
    status: VerificationStatus,
    docType?: any,
    docNumber?: string
  ): void {
    this.ensureInitialized();
    // Update in Listings if host
    const listings = this.get<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    let changedListings = false;
    listings.forEach((l) => {
      if (l.userId === userId) {
        l.verificationStatus = status;
        if (l.user) {
          l.user.verificationStatus = status;
          l.user.isVerifiedHost = status === 'VERIFIED';
        }
        changedListings = true;
      }
    });
    if (changedListings) {
      this.set(STORAGE_KEYS.LISTINGS, listings);
    }

    // Update in Roommates if seeker
    const roommates = this.get<RoommateProfile[]>(STORAGE_KEYS.ROOMMATES, INITIAL_ROOMMATES);
    const rmIndex = roommates.findIndex((r) => r.userId === userId);
    if (rmIndex !== -1) {
      roommates[rmIndex].verificationStatus = status;
      this.set(STORAGE_KEYS.ROOMMATES, roommates);
    }
  }

  // Reset for Demo
  public resetToDefaultData(): void {
    localStorage.removeItem(STORAGE_KEYS.LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.ROOMMATES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.FAMILY_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CAMPUS);
    this.ensureInitialized();
  }
}


export const storage = new StorageService();
