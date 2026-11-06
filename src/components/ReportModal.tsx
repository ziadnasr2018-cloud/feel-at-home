import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

export const ReportModal: React.FC<Props> = ({ isOpen, onClose, listingId, listingTitle }) => {
  const [reason, setReason] = useState('Demands advance transfer before in-person viewing (Vodafone Cash / InstaPay)');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.createReport({
      listingId,
      listingTitle,
      reason,
      details,
      reporterEmail,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Report Received</h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Thank you for keeping our Greater Cairo community safe. Our verification team will review this listing within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-amber-700">
              <Shield className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">Report Listing</h2>
            </div>

            <p className="text-xs text-stone-500">
              Reporting: <span className="font-semibold text-stone-800 line-clamp-1">{listingTitle}</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for report *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Demands advance transfer before in-person viewing (Vodafone Cash / InstaPay)">
                  Demands advance transfer before in-person viewing (Vodafone Cash / InstaPay)
                </option>
                <option value="Misleading or false pricing compared to reality">
                  Misleading or false pricing compared to reality
                </option>
                <option value="Photos are stolen or do not match actual apartment">
                  Photos are stolen or do not match actual apartment
                </option>
                <option value="Property already rented or unavailable">
                  Property already rented or unavailable
                </option>
                <option value="Host was disrespectful or violated terms">
                  Host was disrespectful or violated terms
                </option>
                <option value="Suspicious broker / informal fees requested">
                  Suspicious broker / informal fees requested
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred, e.g., phone conversation details or messages..."
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Email (Optional, for case updates)
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
