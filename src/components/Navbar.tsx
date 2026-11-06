import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  PlusCircle,
  Shield,
  User,
  LogOut,
  RotateCcw,
  Menu,
  X,
  Repeat,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchRole, loginAsDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleResetData = () => {
    if (confirm('Reset demo data to initial Greater Cairo state?')) {
      storage.resetToDefaultData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-200 text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          Greater Cairo Housing Discovery: <strong>Cairo • Giza • Qalyubia</strong>
        </span>
        <span className="hidden sm:inline text-stone-400">|</span>
        <span className="hidden sm:inline text-amber-300">
          Official Slogan: &ldquo;A home easy to find, safe to stay.&rdquo;
        </span>
        <button
          onClick={handleResetData}
          className="ml-2 text-stone-400 hover:text-white underline text-[10px] flex items-center gap-1 cursor-pointer"
          title="Reset sample data"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Reset Demo
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-orange-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-stone-950 group-hover:text-amber-800 transition">
                Feel at Home
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium tracking-wide -mt-1 hidden sm:block">
              A home easy to find, safe to stay.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-stone-700">
          <Link
            to="/listings"
            className={`transition flex items-center gap-1.5 py-1 ${
              isActive('/listings')
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'hover:text-amber-700'
            }`}
          >
            Find a Home
          </Link>

          <Link
            to="/roommates"
            className={`transition flex items-center gap-1.5 py-1 ${
              isActive('/roommates')
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'hover:text-amber-700'
            }`}
          >
            <Users className="w-4 h-4 text-stone-400" />
            Find a Roommate
          </Link>

          <Link
            to="/create-listing"
            className={`transition flex items-center gap-1.5 py-1 ${
              isActive('/create-listing')
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'hover:text-amber-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-stone-400" />
            List a Property
          </Link>

          <Link
            to="/safety"
            className={`transition flex items-center gap-1.5 py-1 ${
              isActive('/safety')
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'hover:text-amber-700'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            Trust & Safety
          </Link>
        </nav>

        {/* Right CTA / Role Switcher & Account */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 relative">
              {/* Quick Role Switcher for Demonstration */}
              <button
                type="button"
                onClick={switchRole}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition"
                title={`Currently viewing as ${role}. Click to switch view.`}
              >
                <Repeat className="w-3 h-3 text-amber-700" />
                <span>Mode: <strong className="text-amber-800">{role === 'PROVIDER' ? 'Host' : 'Seeker'}</strong></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs text-stone-700 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900">{user.fullName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {role === 'PROVIDER' ? 'Property Host Account' : 'Accommodation Seeker'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 text-stone-800 font-medium"
                    >
                      <User className="w-4 h-4 text-stone-500" />
                      Dashboard & {role === 'PROVIDER' ? 'My Listings' : 'Saved Flats'}
                    </Link>

                    {role === 'PROVIDER' && (
                      <Link
                        to="/create-listing"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 text-stone-800 font-medium"
                      >
                        <PlusCircle className="w-4 h-4 text-stone-500" />
                        Publish New Listing
                      </Link>
                    )}

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemo('SEEKER')}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50"
              >
                Demo Seeker
              </button>
              <button
                onClick={() => loginAsDemo('PROVIDER')}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50"
              >
                Demo Host
              </button>
              <Link
                to="/login"
                className="text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg shadow-xs transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <button
              onClick={switchRole}
              className="px-2 py-1 text-[11px] font-bold rounded bg-amber-100 text-amber-800"
            >
              {role === 'PROVIDER' ? 'Host' : 'Seeker'}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 text-sm">
          <Link
            to="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-stone-800"
          >
            Find a Home
          </Link>
          <Link
            to="/roommates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-stone-800"
          >
            Find a Roommate
          </Link>
          <Link
            to="/create-listing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-stone-800"
          >
            List a Property
          </Link>
          <Link
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-emerald-800"
          >
            Trust & Safety Guidelines
          </Link>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-bold text-amber-700"
                >
                  My Dashboard ({user.fullName})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 font-semibold text-red-600"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      loginAsDemo('SEEKER');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-xs bg-stone-100 font-semibold rounded-lg"
                  >
                    Demo Seeker
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('PROVIDER');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-xs bg-stone-100 font-semibold rounded-lg"
                  >
                    Demo Host
                  </button>
                </div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-xs font-semibold text-white bg-amber-600 rounded-lg"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
