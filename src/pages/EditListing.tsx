import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { Listing, Governorate, AccommodationType } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export const EditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceEgp, setPriceEgp] = useState('');
  const [depositEgp, setDepositEgp] = useState('');
  const [status, setStatus] = useState<'AVAILABLE' | 'RENTED'>('AVAILABLE');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const found = storage.getListingById(id);
    if (found) {
      setListing(found);
      setTitle(found.title);
      setDescription(found.description);
      setPriceEgp(found.priceEgp.toString());
      setDepositEgp(found.depositEgp ? found.depositEgp.toString() : '');
      setStatus(found.status === 'AVAILABLE' ? 'AVAILABLE' : 'RENTED');
    }
  }, [id]);

  if (!listing) {
    return <div className="py-24 text-center text-xs text-stone-500">Listing not found.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      storage.updateListing(
        listing.id,
        {
          title,
          description,
          priceEgp: parseFloat(priceEgp),
          depositEgp: depositEgp ? parseFloat(depositEgp) : undefined,
          status,
        },
        user.id
      );
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update listing.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 text-xs">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Edit Property Details</h1>
          <p className="text-stone-500 mt-0.5">
            Update pricing, description, or availability for &ldquo;{listing.title}&rdquo;
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Monthly Rent (EGP) *</label>
              <input
                type="number"
                required
                value={priceEgp}
                onChange={(e) => setPriceEgp(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
              >
                <option value="AVAILABLE">Available for Rent</option>
                <option value="RENTED">Marked as Rented</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description *</label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
