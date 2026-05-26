import React from "react";
import Image from "next/image";
import { Heart, Maximize2 } from "lucide-react";

export type Feedback = {
  ma_phan_hoi: string;
  phan_hoi: string;
  nguoi_binh_luan: string;
  ngay_tao: string;
  trang_thai: string;
  toa_do_X: number;
  toa_do_Y: number;
  phan_tram_chieu_rong: number;
  phan_tram_chieu_cao: number;
  ma_tho_anh?: string | null;
};

export type Photo = {
  ma_hinh_anh: string;
  url_anh: string;
  bi_mo: boolean;
  yeu_thich: boolean;
  ngay_tao: string;
  phan_hoi: Feedback[];
};

type PhotoCardProps = {
  photo: Photo;
  filename: string;
  status: { label: string; variant: string };
  onOpenLightbox: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
};

const statusBadgeClasses = (variant: string) => {
  switch (variant) {
    case "blue":
      return "bg-blue-950/20 border-blue-900/30 text-blue-400";
    case "yellow":
      return "bg-amber-950/20 border-amber-900/30 text-amber-400";
    case "green":
      return "bg-emerald-950/20 border-emerald-900/30 text-emerald-400";
    default:
      return "bg-slate-900/40 border-slate-800 text-slate-400";
  }
};

export const PhotoCard = ({
  photo,
  filename,
  status,
  onOpenLightbox,
  onToggleFavorite,
}: PhotoCardProps) => {
  return (
    <div
      onClick={onOpenLightbox}
      className="group border border-[var(--line)] rounded-[20px] bg-[var(--surface-2)] overflow-hidden flex flex-col justify-between hover:border-[var(--line-green)] transition-all duration-300 shadow-md relative cursor-pointer"
    >
      {/* Image Thumbnail with Overlay controls */}
      <div className="aspect-[3/2] relative w-full bg-black/30 overflow-hidden">
        <Image
          src={photo.url_anh}
          alt={filename}
          fill
          className="object-cover group-hover:scale-103 transition-transform duration-500"
        />

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between z-10">
          <div className="flex justify-end gap-2">
            {/* Favorite Button */}
            <button
              onClick={onToggleFavorite}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${photo.yeu_thich
                ? "bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-black/45 border-white/10 text-white hover:bg-black/60"
                }`}
            >
              <Heart
                size={14}
                fill={photo.yeu_thich ? "currentColor" : "none"}
              />
            </button>
            {/* Expand View */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox();
              }}
              className="w-8 h-8 rounded-full bg-black/45 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Photo details footer */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-[#050706]/40 backdrop-blur-md border-t border-[var(--line)]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[13.5px] font-bold text-[var(--text)] truncate leading-none flex-grow">
            {filename}
          </span>
          <span
            className={`text-[9.5px] py-0.5 px-2 border rounded-full uppercase font-bold tracking-wider ${statusBadgeClasses(
              status.variant,
            )}`}
          >
            {status.label}
          </span>
        </div>
        <div className="flex justify-between items-center text-[12px] text-[var(--muted)] font-semibold mt-1">
          <span>{photo.phan_hoi.length} phản hồi</span>
        </div>
      </div>
    </div>
  );
};
