import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Check, Sparkles } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presetOptions?: Array<{ label: string; url: string }>;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  presetOptions = [],
  aspectRatio = 'square'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        if (result) onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'banner': return 'aspect-[21/9] sm:aspect-[16/6]';
      case 'video': return 'aspect-[16/9]';
      default: return 'aspect-square max-w-[120px]';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(prev => !prev)}
          className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {isUrlMode ? 'Unggah File Lokal' : 'Gunakan Input URL Web'}
        </button>
      </div>

      {/* Main Preview & Upload Container */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview Container */}
        <div className={`relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center ${getAspectClass()}`}>
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors shadow"
                title="Hapus Gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="p-3 text-center text-slate-400 flex flex-col items-center justify-center">
              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
              <span className="text-[10px] font-mono">Belum ada gambar</span>
            </div>
          )}
        </div>

        {/* Upload & Input Controls */}
        <div className="flex-1 space-y-2 w-full text-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!isUrlMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pilih File dari Komputer / HP</span>
              </button>
              <span className="text-[11px] text-slate-400">JPG, PNG, WebP (Maks 5MB)</span>
            </div>
          ) : (
            <input
              type="text"
              placeholder="https://domain.com/gambar.jpg"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          )}

          {/* Quick preset selector if available */}
          {presetOptions.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Atau pilih koleksi template turnamen HD:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(opt.url)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      value === opt.url
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
