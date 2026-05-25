import React from "react";

type AlbumBannerProps = {
  ten_alb: string;
  totalPhotos: number;
  totalFavorites: number;
  totalFeedback: number;
};

export const AlbumBanner = ({
  ten_alb,
  totalPhotos,
  totalFavorites,
  totalFeedback,
}: AlbumBannerProps) => {
  return (
    <section className="relative w-full py-12 border-b border-[var(--line)] bg-[#050706]/40 backdrop-blur-sm px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--green-2)] uppercase font-bold tracking-widest bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] py-1 px-3.5 rounded-full mb-3">
            Album đã mở khóa
          </span>
          <h1 className="text-[32px] font-black tracking-tight text-white leading-none">
            {ten_alb}
          </h1>
          <p className="text-[14px] text-[var(--muted)] mt-3 leading-relaxed">
            Xem ảnh, tìm kiếm theo ngữ nghĩa/khuôn mặt, lọc ảnh, yêu thích ảnh
            và gửi phản hồi chỉnh sửa trực tiếp cho studio.
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold py-1.5 px-4 bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {totalPhotos} ảnh
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold py-1.5 px-4 bg-blue-950/20 border border-blue-900/40 text-blue-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {totalFavorites} ảnh yêu thích
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold py-1.5 px-4 bg-amber-950/20 border border-amber-900/40 text-amber-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {totalFeedback} phản hồi
          </span>
        </div>
      </div>
    </section>
  );
};
