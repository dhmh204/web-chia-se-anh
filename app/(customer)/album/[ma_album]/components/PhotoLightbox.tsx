import React from "react";
import { Heart, X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Photo } from "./PhotoCard";

type PhotoLightboxProps = {
  photo: Photo;
  filename: string;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleFavorite: () => void;
};

export const PhotoLightbox = ({
  photo,
  filename,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
  onToggleFavorite,
}: PhotoLightboxProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#03070a]/95 flex flex-col justify-between backdrop-blur-sm select-none animate-fade-in">
      {/* Header Bar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#050706]/60 backdrop-blur-md z-10">
        <div>
          <h3 className="text-white font-extrabold text-[15px] truncate max-w-[280px] sm:max-w-md">
            {filename}
          </h3>
          <p className="text-[12px] text-[var(--muted)] font-semibold mt-0.5">
            Ảnh {currentIndex + 1} / {totalCount}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Fav inside Lightbox */}
          <button
            onClick={onToggleFavorite}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              photo.yeu_thich
                ? "bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-[#060a0d] border-white/10 text-white hover:border-[var(--line-green)]"
            }`}
          >
            <Heart size={16} fill={photo.yeu_thich ? "currentColor" : "none"} />
          </button>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#060a0d] border border-white/10 flex items-center justify-center text-white hover:border-red-950/40 hover:bg-red-950/10 hover:text-red-400 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Core Image Slide View */}
      <div className="flex-grow flex items-center justify-between px-4 sm:px-12 relative">
        {/* Prev Trigger */}
        <button
          onClick={onPrev}
          className="w-12 h-12 rounded-full bg-black/45 border border-white/10 text-white hover:border-[var(--line-green)] hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Main Center Image */}
        <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center">
          <img
            src={photo.url_anh}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Trigger */}
        <button
          onClick={onNext}
          className="w-12 h-12 rounded-full bg-black/45 border border-white/10 text-white hover:border-[var(--line-green)] hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Feedback & Details Bottom Panel */}
      <footer className="border-t border-white/5 bg-[#050706]/80 backdrop-blur-md p-6 max-h-[30vh] overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Feedback Summary Column */}
          <div className="md:w-1/3">
            <h4 className="text-[14px] font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare size={14} className="text-[var(--green-2)]" />
              Ý kiến phản hồi ({photo.phan_hoi.length})
            </h4>
            <p className="text-[12.5px] text-[var(--muted)] mt-2 leading-relaxed">
              Nhận xét đóng góp ý kiến chỉnh sửa chi tiết của khách hàng gửi cho
              thợ ảnh thiết kế.
            </p>
          </div>

          {/* Feedbacks Scroll List Column */}
          <div className="md:w-2/3 flex flex-col gap-3">
            {photo.phan_hoi.length === 0 ? (
              <p className="text-[13px] text-slate-500 italic mt-1">
                Chưa có phản hồi chỉnh sửa nào cho hình ảnh này.
              </p>
            ) : (
              photo.phan_hoi.map((fb) => (
                <div
                  key={fb.ma_phan_hoi}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5"
                >
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                    <span className="text-[12.5px] font-bold text-white">
                      {fb.nguoi_binh_luan}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(fb.ngay_tao).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                    {fb.phan_hoi}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
