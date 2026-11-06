import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Feel at Home</span>
            </div>
            <p className="text-amber-300/90 font-medium text-xs">
              &ldquo;A home easy to find, safe to stay.&rdquo;
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              Greater Cairo&apos;s dedicated housing discovery platform. Helping university students, relocating professionals, and roommates find safe and affordable housing.
            </p>
          </div>

          {/* Greater Cairo Hubs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Greater Cairo Coverage
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <Link to="/listings?governorate=Cairo" className="hover:text-amber-400 transition">
                  • Cairo (Nasr City, New Cairo, Maadi, Abbaseya)
                </Link>
              </li>
              <li>
                <Link to="/listings?governorate=Giza" className="hover:text-amber-400 transition">
                  • Giza (Dokki, Mohandessin, Sheikh Zayed, 6th October)
                </Link>
              </li>
              <li>
                <Link to="/listings?governorate=Qalyubia" className="hover:text-amber-400 transition">
                  • Qalyubia (Shubra El-Kheima, Benha, Obour)
                </Link>
              </li>
              <li>
                <span className="text-stone-500">• More Egyptian governorates coming soon</span>
              </li>
            </ul>
          </div>

          {/* Student Campuses & Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Key University Hubs
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <Link to="/listings?query=Cairo+University" className="hover:text-amber-400 transition">
                  Cairo University (Dokki / Giza)
                </Link>
              </li>
              <li>
                <Link to="/listings?query=Ain+Shams" className="hover:text-amber-400 transition">
                  Ain Shams University (Abbaseya)
                </Link>
              </li>
              <li>
                <Link to="/listings?query=Benha" className="hover:text-amber-400 transition">
                  Benha University (Benha / Shoubra)
                </Link>
              </li>
              <li>
                <Link to="/listings?query=New+Cairo" className="hover:text-amber-400 transition">
                  GUC & AUC Campuses (New Cairo)
                </Link>
              </li>
              <li>
                <Link to="/listings?query=Smart+Village" className="hover:text-amber-400 transition">
                  Smart Village Work Hub (Zayed / 6th Oct)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Safety & Ethics */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Trust & Safe Stay Pledge
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              We never fabricate verification status. Listings are verified only through physical inspection.
            </p>
            <div className="p-2.5 bg-stone-800/80 rounded-lg border border-stone-700/60 text-[11px] text-amber-200/90 leading-tight">
              Notice: Never wire deposits via Vodafone Cash / InstaPay before inspecting in person.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Feel at Home. Built for student and young professional housing discovery.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-stone-300">
              Safety Rules
            </Link>
            <span>•</span>
            <Link to="/roommates" className="hover:text-stone-300">
              Roommate Guidelines
            </Link>
            <span>•</span>
            <Link to="/listings" className="hover:text-stone-300">
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
