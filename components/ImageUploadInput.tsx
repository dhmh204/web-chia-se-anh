"use client";

import React, { useRef, useState, useEffect } from "react";

type ImageUploadInputProps = {
  label?: string;
  name: string;
  variant?: "landscape" | "avatar";
  previewUrl?: string | null; // For controlled component usage
  onChange?: (file: File | null) => void;
  onRemove?: () => void;
  error?: string;
  className?: string;
  title?: string; // Descriptive title for avatar variant
  description?: string; // Descriptive subtext for avatar variant
};

const ImageUploadInput = ({
  label,
  name,
  variant = "landscape",
  previewUrl,
  onChange,
  onRemove,
  error,
  className = "",
  title,
  description,
}: ImageUploadInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(
    variant === "landscape" ? "/images/example.jpg" : null,
  );
  const [fileName, setFileName] = useState<string | null>(null);

  const currentPreview =
    previewUrl !== undefined ? previewUrl : internalPreviewUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      if (previewUrl === undefined) {
        setInternalPreviewUrl(url);
      }
      setFileName(file.name);
      onChange?.(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl === undefined) {
      setInternalPreviewUrl(
        variant === "landscape" ? "/images/example.jpg" : null,
      );
    }
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
    if (previewUrl === undefined) {
      onChange?.(null);
    }
  };

  useEffect(() => {
    if (previewUrl === null && fileInputRef.current) {
      fileInputRef.current.value = "";
      setFileName(null);
    }
  }, [previewUrl]);

  if (variant === "avatar") {
    return (
      <div className={`flex flex-col gap-[7px] ${className}`}>
        {label && (
          <label className="text-[#d1d5db] text-[13px] font-semibold">
            {label}
          </label>
        )}

        <div className="flex items-center gap-5 p-4 border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.02)]">
          {/* Avatar frame */}
          <div
            onClick={handleTriggerUpload}
            className="relative w-24 h-24 rounded-[20px] overflow-hidden flex flex-col items-center justify-center border border-[var(--line)] hover:border-[var(--line-green)] cursor-pointer group transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex-shrink-0 bg-[linear-gradient(135deg,#047857,#10b981)]"
          >
            {currentPreview ? (
              <>
                <img
                  src={currentPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity duration-200 gap-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Thay đổi ảnh
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-white/90 gap-1 text-center px-2">
                <svg
                  className="w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  Ảnh đại diện
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name={name}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1">
            {title && (
              <h4 className="text-[14px] font-bold text-white mb-1">{title}</h4>
            )}
            {description && (
              <p className="text-[12px] text-[#94a3b8] leading-relaxed max-w-[320px]">
                {description}
              </p>
            )}
            {currentPreview && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-[12px] text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa ảnh đã chọn
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-[13px] text-red-400 mt-[2px]">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-[7px] ${className}`}>
      {label && (
        <label className="text-[#d1d5db] text-[13px] font-semibold">
          {label}
        </label>
      )}

      <div
        onClick={handleTriggerUpload}
        className="flex items-center gap-5 p-4 border border-dashed border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.02)] hover:border-[var(--line-green)] transition-all duration-200 cursor-pointer group"
      >
        <div className="relative w-[140px] h-[90px] rounded-[14px] overflow-hidden border border-[var(--line)] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex-shrink-0">
          {currentPreview && (
            <img
              src={currentPreview}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity duration-200 gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Thay đổi ảnh
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center text-white text-[10px] font-semibold">
            {fileName ? "Ảnh mới chọn" : "Ảnh bìa hiện tại"}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[var(--line)] hover:border-[var(--line-green)] text-white rounded-[12px] text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm active:scale-95"
          >
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Tải ảnh lên
          </button>

          {fileName ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] text-emerald-400 font-medium">
                Đã chọn: {fileName}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-semibold cursor-pointer"
              >
                (Xóa)
              </button>
            </div>
          ) : (
            <span className="text-[12px] text-yellow-500 font-medium mt-1 leading-relaxed">
              Đã chọn ảnh bìa mặc định. Bạn có thể tải file ảnh khác lên.
            </span>
          )}
        </div>

        {/* Hidden Input File */}
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-[13px] text-red-400 mt-[2px]">{error}</p>}
    </div>
  );
};

export default ImageUploadInput;
