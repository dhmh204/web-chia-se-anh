"use client";

import React from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { TrangThaiDuAn } from "@prisma/client";
import { getBadgeVariantForProject, formatTrangThaiDuAn } from "@/lib/format";
import Image from "next/image";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export type PhotoType = {
  ma_hinh_anh: string;
  ma_album: string;
  url_anh: string;
  bi_mo: boolean;
  yeu_thich: boolean;
  ngay_tao: Date | string;
  album: {
    ten_alb: string;
    loai_alb: string;
    du_an: {
      ten_du_an: string;
      trang_thai: TrangThaiDuAn;
    };
  };
  phan_hoi: {
    ma_phan_hoi: string;
    phan_hoi: string;
    nguoi_binh_luan: string;
    ngay_tao: Date | string;
  }[];
};

export const mapLoaiAlb = (type: string) => {
  switch (type) {
    case "ANH_GOC":
      return "Ảnh gốc";
    case "HAU_KY":
      return "Hậu kỳ";
    case "CUOI_CUNG":
      return "Final";
    default:
      return "Khác";
  }
};

export const getFileName = (url: string) => {
  try {
    const parts = url.split("/");
    const name = parts[parts.length - 1];
    return name.split("?")[0];
  } catch {
    return "image.jpg";
  }
};

type PhotoCardProps = {
  photo: PhotoType;
  onLikeToggle: (photo: PhotoType) => void;
  onToggleStatus: (photo: PhotoType, type: "bi_mo") => void;
  onSelect: (photo: PhotoType) => void;
  onImageClick?: () => void;
};

const PhotoCard = ({
  photo,
  onLikeToggle,
  onToggleStatus,
  onSelect,
  onImageClick,
}: PhotoCardProps) => {
  const fileName = getFileName(photo.url_anh);
  const isBlurred = photo.bi_mo;

  // Render bottom left status badge based on flags
  let badgeLabel = "Hiển thị";
  let badgeVariant: "completed" | "new" | "editing" | "pending" = "completed";

  if (isBlurred) {
    badgeLabel = "Ảnh mờ";
    badgeVariant = "pending"; // red/rose
  } else {
    const projectStatus = photo.album.du_an.trang_thai;
    if (projectStatus === "DANG_SUA") {
      badgeLabel = "Đang sửa";
      badgeVariant = "editing"; // amber
    } else if (projectStatus === "HOAN_THANH") {
      badgeLabel = "Hiển thị";
      badgeVariant = "completed"; // green
    } else {
      badgeLabel = formatTrangThaiDuAn(projectStatus);
      badgeVariant = getBadgeVariantForProject(projectStatus);
    }
  }

  return (
    <div className="border border-[var(--line)] rounded-[20px] bg-[var(--surface-2)] overflow-hidden duration-200 hover:translate-y-[-2px] hover:border-[var(--line-green)] flex flex-col h-full">
      <div
        className={`h-[160px] relative w-full
        bg-[linear-gradient(135deg,rgba(16,185,129,0.22),rgba(2,6,23,0.88)),linear-gradient(45deg,rgb(17,24,39),rgb(2,6,23))]
        before:content-[''] before:absolute before:inset-4 before:border before:border-white/15 before:rounded-[15px] before:z-10
        ${onImageClick ? "cursor-pointer" : ""}`}
        onClick={onImageClick}
      >
        <Image
          fill
          src={photo.url_anh}
          alt={fileName}
          sizes="100%"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            isBlurred ? "blur-[5px] scale-[1.02] brightness-[0.8]" : ""
          }`}
        />
        {isBlurred && (
          <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1 bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-[6px] shadow-lg">
              AI Cảnh Báo Mờ
            </span>
          </div>
        )}

        {/* Heart Quick Action Overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onLikeToggle(photo); }}
          className={` z-50 cursor-pointer absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 `}
          title={photo.yeu_thich ? "Bỏ yêu thích" : "Yêu thích"}
        >
          {photo.yeu_thich ? (
            <IoIosHeart size={16} color="red" />
          ) : (
            <IoIosHeartEmpty size={16} color="white" />
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-white font-semibold text-[14px] truncate"
            title={fileName}
          >
            {fileName}
          </h3>
          <p className="text-[12px] text-[var(--muted)] mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span>
              [{mapLoaiAlb(photo.album.loai_alb)} -{" "}
              {photo.album.du_an.ten_du_an}]
            </span>
            {isBlurred && (
              <span className="text-red-400 font-medium">• AI cảnh báo mờ</span>
            )}
            <span>• {photo.yeu_thich ? "1" : "0"} ♥</span>
            {photo.phan_hoi.length > 0 && (
              <span className="text-[#34d399]">
                • {photo.phan_hoi.length} phản hồi
              </span>
            )}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/5">
          <Badge
            label={badgeLabel}
            variant={badgeVariant}
            className="uppercase font-extrabold tracking-wider text-[9.5px] px-2.5 h-[24px]"
          />

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              className="min-h-[28px] py-1 px-3 rounded-[8px] text-[11.5px] border-white/5 hover:border-white/20 text-slate-300"
              onClick={() => onSelect(photo)}
            >
              Chi tiết
            </Button>

            {isBlurred ? (
              <Button
                variant="secondary"
                className="min-h-[28px] py-1 px-3 rounded-[8px] text-[11.5px] border-[#10b981]/20 bg-[#10b981]/5 text-[#34d399] hover:bg-[#10b981]/15"
                onClick={() => onToggleStatus(photo, "bi_mo")}
              >
                Hiện lại
              </Button>
            ) : (
              <Button
                variant="danger"
                className="min-h-[28px] py-1 px-3 rounded-[8px] text-[11.5px] border-red-500/10 bg-red-500/5 text-red-300 hover:bg-red-500/15"
                onClick={() => onToggleStatus(photo, "bi_mo")}
              >
                Ẩn
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
