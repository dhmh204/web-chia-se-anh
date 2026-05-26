import React from "react";

type AlbumBannerProps = {
  ten_alb: string;
  totalPhotos: number;
  totalFavorites: number;
  totalFeedback: number;
};

/*margin: 12px 0;
    font-size: 42px;
    letter-spacing: -.05em; */

export const AlbumBanner = ({
  ten_alb,
  totalPhotos,
  totalFavorites,
  totalFeedback,
}: AlbumBannerProps) => {
  return (
    <section className="min-h-[200px] p-[32px] border-[1px] border-[var(--line)] rounded-[30px] bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(3,7,10,0.84)),radial-gradient(circle_at_80%_40%,rgba(52,211,153,0.18),transparent_32%)] shadow-[var(--shadow)] flex  justify-between items-end gap-[28px]">
      <div className="">
        <h1 className=" text-[42px] tracking-[-0.05em] font-bold capitalize">
          {ten_alb}
        </h1>
        <p className="text-[#cbd5e1] leading-[1.7] max-w-[680px] ">
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
    </section>
  );
};
