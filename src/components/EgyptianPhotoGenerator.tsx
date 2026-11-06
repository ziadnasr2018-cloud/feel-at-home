import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Check,
  X,
  Image as ImageIcon,
  Wand2,
  AlertCircle,
} from 'lucide-react';
import {
  generateEgyptianStudentImage,
  EGYPTIAN_STUDENT_PRESET_PHOTOS,
} from '../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (url: string) => void;
}

export const EgyptianPhotoGenerator: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectPhoto,
}) => {
  const [prompt, setPrompt] = useState(
    'Sunny student room in Dokki with study desk, open balcony door overlooking tree-lined Cairo street, and ceiling fan'
  );
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await generateEgyptianStudentImage({
        prompt: prompt.trim(),
        resolution,
      });
      setGeneratedResult(res.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Dokki sunny room with wooden study desk, bookshelf, and wrought-iron balcony',
    'Nasr City shared flat living salon with Egyptian patterned rug and air conditioning',
    'Shubra El-Kheima student bedroom near Metro with twin beds and reading lamps',
    'New Cairo villa master room facing sunny palm garden near GUC campus',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Egyptian Student Accommodation Photos
              </h3>
              <p className="text-[11px] text-stone-500">
                Pick realistic Cairo student flat photos or generate with Gemini AI (nano-banana-2.1).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: AI Prompt Generator */}
        <form onSubmit={handleGenerate} className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Generate with Gemini AI (gemini-nano-banana-2.1)
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-500">Resolution:</span>
              {(['1K', '2K', '4K'] as const).map((res) => (
                <button
                  type="button"
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    resolution === res
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-700 border border-amber-200'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the Egyptian student room you want to visualize..."
            className="w-full p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {samplePrompts.map((sp, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPrompt(sp)}
                  className="text-[10px] bg-white hover:bg-amber-100 text-stone-600 px-2 py-0.5 rounded border border-amber-100 truncate max-w-[200px]"
                >
                  {sp}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Wand2 className="w-3.5 h-3.5" />
              {loading ? 'Generating...' : 'Generate Photo'}
            </button>
          </div>
        </form>

        {/* Generated Image Result */}
        {generatedResult && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span className="font-bold text-xs text-stone-900 block">
              Generated Accommodation Photo:
            </span>
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-stone-300">
              <img
                src={generatedResult}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectPhoto(generatedResult);
                onClose();
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Use This Photo for Listing
            </button>
          </div>
        )}

        {/* Tab 2: Curated Authentic Egyptian Presets */}
        <div className="space-y-3">
          <span className="font-bold text-xs text-stone-900 block uppercase tracking-wider">
            Curated Authentic Greater Cairo Student Photos:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EGYPTIAN_STUDENT_PRESET_PHOTOS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectPhoto(item.url);
                  onClose();
                }}
                className="group relative aspect-[16/10] bg-stone-100 rounded-xl overflow-hidden border border-stone-200 hover:border-amber-500 cursor-pointer transition shadow-xs"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                  <p className="font-bold text-[11px] leading-tight line-clamp-1">{item.title}</p>
                  <p className="text-[9px] text-stone-300 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
