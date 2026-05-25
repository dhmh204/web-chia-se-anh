import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Download, Eye, ChevronRight } from "lucide-react";
import Button from "@/components/Button";

export type AlbumSummary = {
  ma_album: string;
  ten_alb: string;
  loai_alb: string;
  quyen_download: boolean;
  coverImage: string;
  photoCount: number;
};

type AlbumCardProps = {
  album: AlbumSummary;
};

const getAlbumTypeConfig = (type: string) => {
  switch (type) {
    case "ANH_GOC":
      return {
        label: "Ảnh gốc",
        classes: "bg-[rgba(16,185,129,0.08)] border-[rgba(16,185,129,0.22)] text-[var(--green-2)]",
      };
    case "HAU_KY":
      return {
        label: "Hậu kỳ",
        classes: "bg-[rgba(251,191,36,0.08)] border-[rgba(251,191,36,0.22)] text-[#fcd34d]",
      };
    case "CUOI_CUNG":
      return {
        label: "Final",
        classes: "bg-[rgba(96,165,250,0.08)] border-[rgba(96,165,250,0.22)] text-[#93c5fd]",
      };
    default:
      return {
        label: "Khác",
        classes: "bg-white/5 border-white/10 text-white",
      };
  }
};

export const AlbumCard = ({ album }: AlbumCardProps) => {
  const typeConfig = getAlbumTypeConfig(album.loai_alb);

  return (
    <div className="group border border-[var(--line)] rounded-[24px] bg-[var(--surface-2)] backdrop-blur-[12px] overflow-hidden flex flex-col justify-between hover:border-[var(--line-green)] hover:-translate-y-1.5 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      
      {/* Album Cover Thumbnail */}
      <div className="h-[190px] relative w-full bg-black/30 overflow-hidden">
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt={album.ten_alb}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <ImageIcon size={32} className="text-slate-700" />
          </div>
        )}
        
        {/* Badge type */}
        <span className={`absolute top-4 left-4 text-[10px] py-1 px-3 border rounded-full uppercase font-bold tracking-widest shadow-lg ${typeConfig.classes}`}>
          {typeConfig.label}
        </span>
      </div>

      {/* Album Info */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div className="mb-5">
          <h3 className="text-[17px] font-extrabold text-[var(--text)] truncate leading-tight group-hover:text-[var(--green-2)] transition-colors duration-300">
            {album.ten_alb}
          </h3>
          <p className="text-[13px] text-[var(--muted)] mt-1.5 font-medium">
            {album.photoCount} hình ảnh
          </p>
          
          <div className="mt-3.5">
            {album.quyen_download ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--green-2)] bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.18)] rounded-md px-2.5 py-1">
                <Download size={11} /> Cho phép tải về
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] bg-white/5 border border-white/5 rounded-md px-2.5 py-1">
                <Eye size={11} /> Xem trực tuyến
              </span>
            )}
          </div>
        </div>

        <div>
          <Button
            href={`/album/${album.ma_album}`}
            variant="secondary"
            className="w-full min-h-[42px] rounded-[13px] text-[13.5px] font-bold text-[var(--text)] transition-all duration-300"
          >
            Vào xem album
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1 duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};
