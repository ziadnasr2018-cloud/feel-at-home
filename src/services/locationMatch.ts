import { CampusTarget, Coordinates, Listing, NearestMetro } from '../types';

export const GREATER_CAIRO_CAMPUSES: CampusTarget[] = [
  {
    id: 'cairo-univ',
    name: 'Cairo University (جامعة القاهرة)',
    shortName: 'Cairo Univ',
    governorate: 'Giza',
    coordinates: { lat: 30.0261, lng: 31.2118 },
    landmark: 'Giza / Dokki, Metro Line 2',
    faculties: 'Pharmacy, Engineering, Medicine, Science, Arts, Commerce',
  },
  {
    id: 'ain-shams',
    name: 'Ain Shams University (جامعة عين شمس)',
    shortName: 'Ain Shams Univ',
    governorate: 'Cairo',
    coordinates: { lat: 30.0771, lng: 31.2859 },
    landmark: 'Abbaseya / Al-Zaafaran Palace, Metro Line 3',
    faculties: 'Medicine, Engineering, Science, Computer Science, Law',
  },
  {
    id: 'guc',
    name: 'German University in Cairo — GUC (الجامعة الألمانية)',
    shortName: 'GUC',
    governorate: 'Cairo',
    coordinates: { lat: 29.9869, lng: 31.4414 },
    landmark: 'New Cairo 3rd/5th Settlement, El-Nasr Axis',
    faculties: 'Engineering, Applied Arts, Pharmacy, Management',
  },
  {
    id: 'auc',
    name: 'American University in Cairo — AUC (الجامعة الأمريكية)',
    shortName: 'AUC',
    governorate: 'Cairo',
    coordinates: { lat: 30.0195, lng: 31.4988 },
    landmark: 'New Cairo 5th Settlement, AUC Avenue',
    faculties: 'Business, Global Affairs, Sciences & Engineering',
  },
  {
    id: 'shoubra-eng',
    name: 'Shoubra Faculty of Engineering (هندسة شبرا - جامعة بنها)',
    shortName: 'Shoubra Engineering',
    governorate: 'Qalyubia',
    coordinates: { lat: 30.0682, lng: 31.2467 },
    landmark: 'Shoubra / Shubra El-Kheima border, Metro Line 2',
    faculties: 'Architectural, Civil, Mechanical, Electrical Engineering',
  },
  {
    id: 'benha-univ',
    name: 'Benha University Main Campus (جامعة بنها)',
    shortName: 'Benha Univ',
    governorate: 'Qalyubia',
    coordinates: { lat: 30.4660, lng: 31.1853 },
    landmark: 'Fareed Nada Street, Benha',
    faculties: 'Medicine, Nursing, Science, Arts, Education',
  },
  {
    id: 'smart-village',
    name: 'Smart Village Corporate Tech Hub (القرية الذكية)',
    shortName: 'Smart Village',
    governorate: 'Giza',
    coordinates: { lat: 30.0733, lng: 31.0181 },
    landmark: 'Cairo-Alex Desert Rd, Sheikh Zayed / 6th of October',
    faculties: 'Tech & Engineering Internships, Software Companies',
  },
  {
    id: 'cairo-downtown',
    name: 'Downtown Cairo / Tahrir Hub (وسط البلد)',
    shortName: 'Downtown / Tahrir',
    governorate: 'Cairo',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    landmark: 'Sadat Metro Interchange Line 1 & 2',
    faculties: 'Central Transit Hub, Research Libraries, Language Institutes',
  },
];

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Estimate student commute duration in minutes
export function estimateCommuteTime(distanceKm: number, hasDirectMetro: boolean): {
  minutes: number;
  mode: 'Walk' | 'Metro' | 'Microbus';
  label: string;
} {
  if (distanceKm <= 1.2) {
    const mins = Math.max(4, Math.round(distanceKm * 12));
    return {
      minutes: mins,
      mode: 'Walk',
      label: `${mins} min walk`,
    };
  } else if (hasDirectMetro || distanceKm <= 5.0) {
    const mins = Math.max(12, Math.round(distanceKm * 3.5 + 8));
    return {
      minutes: mins,
      mode: 'Metro',
      label: `${mins} mins via Metro`,
    };
  } else {
    const mins = Math.max(20, Math.round(distanceKm * 3 + 12));
    return {
      minutes: mins,
      mode: 'Microbus',
      label: `${mins} mins via Microbus / Transit`,
    };
  }
}

export interface MatchResult {
  matchPercentage: number;
  distanceKm: number;
  commuteEstimate: {
    minutes: number;
    mode: 'Walk' | 'Metro' | 'Microbus';
    label: string;
  };
  metroProximity: string;
  highlightText: string;
  grade: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'MODERATE';
}

export function calculateLocationMatch(
  listing: Listing,
  targetCampus: CampusTarget,
  userMaxBudget?: number
): MatchResult {
  const distKm = calculateDistanceKm(listing.coordinates, targetCampus.coordinates);
  const hasDirectMetro = Boolean(
    listing.nearestMetro && listing.nearestMetro.walkingMinutes <= 10
  );
  const commute = estimateCommuteTime(distKm, hasDirectMetro);

  // 1. Distance Component (max 60 points)
  let distanceScore = 0;
  if (distKm <= 1.0) {
    distanceScore = 60; // Right beside campus
  } else if (distKm <= 2.5) {
    distanceScore = 55;
  } else if (distKm <= 5.0) {
    distanceScore = 48;
  } else if (distKm <= 8.0) {
    distanceScore = 40;
  } else if (distKm <= 15.0) {
    distanceScore = 30;
  } else if (distKm <= 25.0) {
    distanceScore = 20;
  } else {
    distanceScore = 12;
  }

  // 2. Metro / Transit Component (max 25 points)
  let transitScore = 10;
  if (listing.nearestMetro) {
    if (listing.nearestMetro.walkingMinutes <= 5) {
      transitScore = 25; // 3-5 mins walk to metro is pure gold in Cairo
    } else if (listing.nearestMetro.walkingMinutes <= 10) {
      transitScore = 20;
    } else {
      transitScore = 14;
    }
  }

  // Same Governorate Bonus (max 5 points)
  if (listing.governorate === targetCampus.governorate) {
    transitScore += 5;
  }

  // 3. Budget Component (max 15 points)
  let budgetScore = 15;
  if (userMaxBudget && userMaxBudget > 0) {
    if (listing.priceEgp <= userMaxBudget) {
      budgetScore = 15;
    } else if (listing.priceEgp <= userMaxBudget * 1.15) {
      budgetScore = 10;
    } else {
      budgetScore = 4;
    }
  }

  const total = Math.min(99, Math.max(38, Math.round(distanceScore + transitScore + budgetScore)));

  let grade: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'MODERATE' = 'GOOD';
  if (total >= 90) grade = 'EXCELLENT';
  else if (total >= 80) grade = 'VERY_GOOD';
  else if (total >= 65) grade = 'GOOD';
  else grade = 'MODERATE';

  let highlight = '';
  if (distKm <= 1.5) {
    highlight = `Walking distance (${distKm} km) to ${targetCampus.shortName}`;
  } else if (listing.nearestMetro && listing.nearestMetro.walkingMinutes <= 7) {
    highlight = `${listing.nearestMetro.walkingMinutes} min walk to ${listing.nearestMetro.name} Metro`;
  } else {
    highlight = `${distKm} km commute to ${targetCampus.shortName}`;
  }

  const metroProximity = listing.nearestMetro
    ? `${listing.nearestMetro.walkingMinutes} min walk to ${listing.nearestMetro.name} (${listing.nearestMetro.line})`
    : 'Short microbus ride to nearest transit';

  return {
    matchPercentage: total,
    distanceKm: distKm,
    commuteEstimate: commute,
    metroProximity,
    highlightText: highlight,
    grade,
  };
}
