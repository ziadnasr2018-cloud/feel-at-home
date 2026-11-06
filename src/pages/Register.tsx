import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('SEEKER');
  const [isLookingForRoommate, setIsLookingForRoommate] = useState(true);
  const [occupationOrUni, setOccupationOrUni] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    register({
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      role,
      isLookingForRoommate,
      occupationOrUni: occupationOrUni.trim() || undefined,
      verificationStatus: 'NOT_VERIFIED',
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-14 space-y-6 text-xs">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Join Feel at Home
        </h1>
        <p className="text-stone-500">
          Create an account to discover safe housing or list accommodation in Greater Cairo.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        {/* Account Role Selector */}
        <div>
          <label className="block font-bold text-stone-800 mb-2">Account Type *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('SEEKER')}
              className={`p-3 rounded-2xl border text-left transition ${
                role === 'SEEKER'
                  ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-1 ring-amber-500'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <span className="font-bold block text-sm">Accommodation Seeker</span>
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                Student, jobholder, or roommate seeker
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`p-3 rounded-2xl border text-left transition ${
                role === 'PROVIDER'
                  ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-1 ring-amber-500'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <span className="font-bold block text-sm">Property Host / Owner</span>
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                Apartment owner or room provider
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Sarah Adel"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. sarah@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
            <input
              type="text"
              required
              placeholder="+20 10..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            University / Workplace (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Cairo University Faculty of Pharmacy"
            value={occupationOrUni}
            onChange={(e) => setOccupationOrUni(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
          />
        </div>

        {role === 'SEEKER' && (
          <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isLookingForRoommate}
              onChange={(e) => setIsLookingForRoommate(e.target.checked)}
              className="text-amber-600 rounded"
            />
            <span className="text-stone-700 font-medium">
              I am also interested in finding compatible roommates
            </span>
          </label>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Complete Registration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-stone-500 text-xs">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-amber-700 underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
