import React, { useState } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Train,
  GraduationCap,
  Compass,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Listing, CampusTarget } from '../types';
import { calculateDistanceKm, estimateCommuteTime } from '../services/locationMatch';

interface Props {
  listing: Listing;
  targetCampus: CampusTarget;
}

export const GoogleMapsExplorer: React.FC<Props> = ({ listing, targetCampus }) => {
  const [activeMarker, setActiveMarker] = useState<'listing' | 'campus' | 'metro' | null>('listing');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const apiKey =
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
    (import.meta as any).env?.GOOGLE_MAPS_API_KEY ||
    '';

  const distanceKm = calculateDistanceKm(listing.coordinates, targetCampus.coordinates);
  const commute = estimateCommuteTime(
    distanceKm,
    Boolean(listing.nearestMetro && listing.nearestMetro.walkingMinutes <= 10)
  );

  // Center between property and campus
  const centerLat = (listing.coordinates.lat + targetCampus.coordinates.lat) / 2;
  const centerLng = (listing.coordinates.lng + targetCampus.coordinates.lng) / 2;

  // External Google Maps directions URL for students
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${listing.coordinates.lat},${listing.coordinates.lng}&destination=${targetCampus.coordinates.lat},${targetCampus.coordinates.lng}&travelmode=transit`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-700" />
              Live Cairo Campus Transit & Maps
            </h3>
          </div>
          <p className="text-[11px] text-stone-500">
            Real coordinates for Greater Cairo. Route calculated to{' '}
            <strong className="text-stone-800">{targetCampus.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Commute Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Campus Distance
          </span>
          <p className="text-base font-extrabold text-stone-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-700" />
            {distanceKm} km away
          </p>
          <p className="text-[11px] text-stone-500">{targetCampus.shortName}</p>
        </div>

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Estimated Commute
          </span>
          <p className="text-base font-extrabold text-emerald-800 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-600" />
            {commute.label}
          </p>
          <p className="text-[11px] text-stone-500">
            {commute.mode === 'Walk' ? 'Healthy student walk' : 'Via Cairo transit / microbus'}
          </p>
        </div>

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Nearest Cairo Metro
          </span>
          <p className="text-base font-extrabold text-stone-900 flex items-center gap-1.5 truncate">
            <Train className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="truncate">{listing.nearestMetro?.name || 'Local Transit'}</span>
          </p>
          <p className="text-[11px] text-stone-500">
            {listing.nearestMetro
              ? `${listing.nearestMetro.walkingMinutes} mins walk (${listing.nearestMetro.line})`
              : 'Direct microbus on main avenue'}
          </p>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-100">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              defaultCenter={{ lat: centerLat, lng: centerLng }}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeId={mapType}
              className="w-full h-full"
            >
              {/* Property Marker */}
              <AdvancedMarker
                position={listing.coordinates}
                onClick={() => setActiveMarker('listing')}
                title={listing.title}
              >
                <div className="px-2.5 py-1 bg-amber-600 text-white font-bold text-xs rounded-full shadow-lg border-2 border-white flex items-center gap-1 hover:scale-110 transition cursor-pointer">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.priceEgp} EGP</span>
                </div>
              </AdvancedMarker>

              {/* Campus Marker */}
              <AdvancedMarker
                position={targetCampus.coordinates}
                onClick={() => setActiveMarker('campus')}
                title={targetCampus.name}
              >
                <div className="px-2.5 py-1 bg-stone-900 text-white font-bold text-xs rounded-full shadow-lg border-2 border-amber-400 flex items-center gap-1 hover:scale-110 transition cursor-pointer">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{targetCampus.shortName}</span>
                </div>
              </AdvancedMarker>

              {/* Metro Marker (if near) */}
              {listing.nearestMetro && (
                <AdvancedMarker
                  position={{
                    lat: listing.coordinates.lat + 0.003,
                    lng: listing.coordinates.lng + 0.002,
                  }}
                  onClick={() => setActiveMarker('metro')}
                  title={listing.nearestMetro.name}
                >
                  <div className="p-1.5 bg-red-600 text-white rounded-full shadow-md border-2 border-white hover:scale-110 transition cursor-pointer">
                    <Train className="w-3.5 h-3.5" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Info Windows */}
              {activeMarker === 'listing' && (
                <InfoWindow
                  position={listing.coordinates}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 text-xs text-stone-800 space-y-1">
                    <p className="font-bold text-amber-900">{listing.title}</p>
                    <p className="text-[11px] text-stone-600">{listing.address}</p>
                    <p className="font-semibold text-emerald-700">{listing.priceEgp} EGP / month</p>
                  </div>
                </InfoWindow>
              )}

              {activeMarker === 'campus' && (
                <InfoWindow
                  position={targetCampus.coordinates}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 text-xs text-stone-800 space-y-1">
                    <p className="font-bold text-stone-900">{targetCampus.name}</p>
                    <p className="text-[11px] text-stone-600">{targetCampus.faculties}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </APIProvider>
        ) : (
          /* High-Fidelity SVG Interactive Cairo Map Fallback with precise pins and roads */
          <div className="w-full h-full relative bg-gradient-to-tr from-amber-50 via-stone-100 to-amber-100/60 p-4 flex flex-col justify-between select-none">
            {/* Visual SVG Map Art with Cairo Nile and Metro lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Nile River Curve */}
              <path
                d="M 120 0 Q 180 150 160 260 T 210 380"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Metro Line 2 (Red) */}
              <path
                d="M 60 40 L 160 160 L 250 280 L 320 340"
                fill="none"
                stroke="#ef4444"
                strokeWidth="5"
                strokeDasharray="6,4"
              />
              {/* Ring Road Arc */}
              <path
                d="M 30 180 Q 200 60 400 120 T 550 280"
                fill="none"
                stroke="#d97706"
                strokeWidth="4"
                strokeOpacity="0.5"
              />
            </svg>

            {/* Top Overlay Badge */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <span className="px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full font-bold text-stone-800 shadow-sm border border-stone-200 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-700" />
                Greater Cairo Commute Transit Line
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                {distanceKm} km direct line
              </span>
            </div>

            {/* Simulated Cairo Interactive Marker Nodes */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-around gap-4 py-8">
              {/* Property Marker */}
              <div className="p-3 bg-white rounded-2xl border-2 border-amber-600 shadow-lg text-center space-y-1 animate-bounce-subtle">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="font-bold text-stone-900 text-xs">Rental Property</p>
                <p className="text-[10px] text-stone-500">{listing.neighborhood}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
                  {listing.priceEgp} EGP
                </span>
              </div>

              {/* Transit connector line */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-1 text-stone-400">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {commute.label}
                </span>
                <div className="w-32 border-t-2 border-dashed border-amber-500"></div>
                <span className="text-[10px] text-stone-500">
                  {listing.nearestMetro?.name ? `via ${listing.nearestMetro.name}` : 'Direct route'}
                </span>
              </div>

              {/* Campus Marker */}
              <div className="p-3 bg-white rounded-2xl border-2 border-stone-900 shadow-lg text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center mx-auto font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <p className="font-bold text-stone-900 text-xs">{targetCampus.shortName}</p>
                <p className="text-[10px] text-stone-500">{targetCampus.landmark}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                  Destination
                </span>
              </div>
            </div>

            {/* Bottom link */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-600 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-stone-200">
              <span>Coordinates: {listing.coordinates.lat}, {listing.coordinates.lng}</span>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1"
              >
                Inspect Complete Metro Transit in Google Maps &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
