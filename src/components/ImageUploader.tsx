import React, { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (value: string) => void;
  aspectRatio?: 'cover' | 'avatar' | 'logo' | 'banner';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  aspectRatio = 'cover',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [inputUrl, setInputUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: warn if > 3MB to protect localStorage
    if (file.size > 3 * 1024 * 1024) {
      alert('Image file is larger than 3MB. Please select a smaller or compressed image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setInputUrl('');
    }
  };

  const previewClass =
    aspectRatio === 'avatar'
      ? 'w-24 h-24 rounded-full'
      : aspectRatio === 'logo'
      ? 'w-32 h-12 rounded-lg'
      : 'w-28 h-38 rounded-md';

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-[#0A0F1C] border border-[#1E2A44]">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
            {label}
          </label>
          {sublabel && <p className="text-[11px] text-slate-500 font-light">{sublabel}</p>}
        </div>

        <div className="flex items-center gap-1 bg-[#111A2E] p-0.5 rounded-lg border border-[#1E2A44] text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded font-mono transition-colors ${
              activeMode === 'upload' ? 'bg-[#2FD6A0] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded font-mono transition-colors ${
              activeMode === 'url' ? 'bg-[#2FD6A0] text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Preview Section if Image Exists */}
      {value ? (
        <div className="flex items-center gap-4 p-2.5 rounded-lg bg-[#111A2E] border border-[#2FD6A0]/30">
          <div className={`${previewClass} overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center relative shadow-md`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono text-[#2FD6A0] uppercase font-bold block">
              Image Active
            </span>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              {value.startsWith('data:') ? 'Uploaded local image file' : value}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove Image</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Input section when no image is selected */
        <div>
          {activeMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-4 rounded-xl border border-dashed border-[#1E2A44] hover:border-[#2FD6A0]/60 bg-[#111A2E]/50 hover:bg-[#111A2E] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
              >
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#2FD6A0] transition-colors" />
                <span className="text-xs text-slate-300 font-semibold group-hover:text-white">
                  Click to browse & upload image from your device
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  PNG, JPG, WEBP, or SVG supported
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/cover-image.jpg"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111A2E] border border-[#1E2A44] text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#2FD6A0]"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 rounded-lg bg-[#2FD6A0] text-slate-950 font-bold text-xs hover:bg-[#25B586] transition-colors cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
