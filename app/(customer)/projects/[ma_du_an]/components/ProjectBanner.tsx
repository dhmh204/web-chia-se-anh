import React from "react";
import Image from "next/image";
import { Calendar, Images } from "lucide-react";

type ProjectBannerProps = {
  ten_du_an: string;
  ngay_chup: Date | string;
  link_anh_bia: string | null;
  albumCount: number;
};

const formatDate = (dateStr: Date | string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

export const ProjectBanner = ({
  ten_du_an,
  ngay_chup,
  link_anh_bia,
  albumCount,
}: ProjectBannerProps) => {
  const coverImage = link_anh_bia || "/images/example.jpg";

  return (
    <section className="relative w-full h-[320px] bg-[#050706] overflow-hidden flex items-end">
      <Image
        src={coverImage}
        alt={ten_du_an}
        fill
        className="object-cover opacity-25 blur-[1.5px] scale-105"
        priority
      />
      {/* Blend seamlessly into the page background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />
      <div className="max-w-6xl mx-auto w-full px-6 pb-10 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[var(--green-2)] py-1 px-3.5 rounded-full uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
              Dự án
            </span>

            <h1 className="text-[36px] md:text-[44px] font-black text-[var(--text)] tracking-tight mt-4 leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {ten_du_an}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[var(--muted)] text-[14px] mt-4 font-medium">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-[var(--green-2)]" />
                Ngày chụp: {formatDate(ngay_chup)}
              </span>
              <span className="text-[var(--line)]">•</span>
              <span className="flex items-center gap-2">
                <Images size={15} className="text-[var(--green-2)]" />
                {albumCount} Album ảnh
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
