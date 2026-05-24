"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PhotoType, getFileName } from "./PhotoCard";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

type PhotoLightboxProps = {
  photos: PhotoType[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onLikeToggle?: (photo: PhotoType) => void;
};

const PhotoLightbox = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onLikeToggle,
}: PhotoLightboxProps) => {
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goPrev, goNext, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !photo) return null;

  const fileName = getFileName(photo.url_anh);
  const hasThumbs = photos.length > 1;

  const content = (
    <div
      className="fixed inset-0 z-[99999] flex flex-col bg-black/[0.94]"
      onClick={onClose}
    >
      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 h-[52px] flex items-center justify-between px-5"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-slate-400 text-[13px] font-medium">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          title="Đóng (Esc)"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-200"
        >
          <FaTimes size={15} />
        </button>
      </div>

      {/* ── Image area ── */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onClick={onClose}
      >
        {/* Prev button */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            title="Ảnh trước (←)"
            className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          >
            <FaChevronLeft size={16} />
          </button>
        )}

        {/* Image — fills the flex area */}
        <div
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            key={photo.url_anh}
            src={photo.url_anh}
            alt={fileName}
            fill
            sizes="100vw"
            className={`object-contain transition-opacity duration-300 select-none ${
              photo.bi_mo ? "blur-[6px]" : ""
            }`}
            priority
          />
        </div>

        {/* Next button */}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            title="Ảnh tiếp theo (→)"
            className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          >
            <FaChevronRight size={16} />
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {hasThumbs && (
        <div
          className="flex-shrink-0 h-[88px] flex items-center justify-center gap-2 px-6 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((p, idx) => (
            <button
              key={p.ma_hinh_anh}
              onClick={() => onNavigate(idx)}
              title={`Ảnh ${idx + 1}`}
              className={`flex-shrink-0 w-[60px] h-[44px] rounded-[8px] overflow-hidden border-2 cursor-pointer transition-all duration-200 relative p-0 bg-transparent ${
                idx === currentIndex
                  ? "border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30 opacity-100"
                  : "border-white/15 opacity-50 hover:opacity-90 hover:border-white/40"
              }`}
            >
              <Image
                src={p.url_anh}
                alt={`thumb-${idx}`}
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Info bar ── */}
      <div
        className="flex-shrink-0 h-[64px] flex items-center justify-between px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden">
          <p className="text-white text-[13px] font-semibold truncate">
            {fileName}
          </p>
          <p className="text-slate-500 text-[11.5px] mt-0.5">
            {photo.album?.ten_alb}
            {photo.phan_hoi?.length > 0 &&
              ` · ${photo.phan_hoi.length} phản hồi`}
            {photo.bi_mo && (
              <span className="text-red-400 font-medium ml-1">
                · AI cảnh báo mờ
              </span>
            )}
          </p>
        </div>

        {onLikeToggle && (
          <button
            onClick={() => onLikeToggle(photo)}
            title={photo.yeu_thich ? "Bỏ yêu thích" : "Yêu thích"}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/8 hover:bg-white/15 border-none text-white text-[13px] font-semibold cursor-pointer transition-all duration-200"
          >
            {photo.yeu_thich ? (
              <FaHeart size={13} className="text-red-500" />
            ) : (
              <FaRegHeart size={13} />
            )}
            {photo.yeu_thich ? "Đã thích" : "Yêu thích"}
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default PhotoLightbox;
