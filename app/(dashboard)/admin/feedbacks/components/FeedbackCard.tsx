"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export type FeedbackType = {
  ma_phan_hoi: string;
  ma_hinh_anh: string;
  ma_tho_anh: string | null;
  nguoi_binh_luan: string;
  phan_hoi: string;
  trang_thai: "CHUA_XU_LY" | "DANG_XU_LY" | "DA_XU_LY";
  toa_do_X: number;
  toa_do_Y: number;
  phan_tram_chieu_rong: number;
  phan_tram_chieu_cao: number;
  ngay_tao: string;
  hinh_anh: {
    ma_hinh_anh: string;
    url_anh: string;
    ma_album: string;
    album: {
      ten_alb: string;
      du_an: {
        ten_du_an: string;
      };
    };
  } | null;
  replies: {
    ma_phan_hoi: string;
    ma_hinh_anh: string;
    ma_tho_anh: string | null;
    nguoi_binh_luan: string;
    phan_hoi: string;
    trang_thai: string;
    toa_do_X: number;
    toa_do_Y: number;
    phan_tram_chieu_rong: number;
    phan_tram_chieu_cao: number;
    ngay_tao: string;
    tho_anh: {
      ho_va_ten: string;
      vai_tro: string;
    } | null;
  }[];
};

type FeedbackCardProps = {
  feedback: FeedbackType;
  onOpenReplies: (feedback: FeedbackType) => void;
  onOpenStatusChange: (feedback: FeedbackType) => void;
};

export const getPhotoName = (url: string) => {
  try {
    const parts = url.split("/");
    const name = parts[parts.length - 1];
    return name.split("?")[0];
  } catch {
    return "image.jpg";
  }
};

export const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } catch {
    return dateStr;
  }
};

const FeedbackCard = ({
  feedback,
  onOpenReplies,
  onOpenStatusChange,
}: FeedbackCardProps) => {
  const photoName = feedback.hinh_anh
    ? getPhotoName(feedback.hinh_anh.url_anh)
    : "Ảnh đã bị xóa";

  let statusLabel = "Chưa xử lý";
  let badgeVariant: "completed" | "editing" | "new" | "pending" = "pending";
  let badgeOverrideClass = "";

  if (feedback.trang_thai === "CHUA_XU_LY") {
    statusLabel = "Chưa xử lý";
    badgeVariant = "new";
    // Custom purple classes to override default new (blue) styling
    badgeOverrideClass =
      "text-[#c084fc] bg-[rgba(168,85,247,0.12)] border border-[rgba(168,85,247,0.22)]";
  } else if (feedback.trang_thai === "DANG_XU_LY") {
    statusLabel = "Đang xử lý";
    badgeVariant = "editing";
  } else if (feedback.trang_thai === "DA_XU_LY") {
    statusLabel = "Đã xử lý";
    badgeVariant = "completed";
  }

  return (
    <div
      onClick={() => onOpenReplies(feedback)}
      className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-5 flex flex-col md:flex-row gap-5 items-start justify-between hover:border-[#10b981]/30 transition-all duration-300 cursor-pointer select-none"
    >
      <div className="flex gap-4 items-start flex-1 w-full">
        {/* Photo Thumbnail */}
        <div className="w-[80px] h-[80px] rounded-[12px] relative overflow-hidden bg-black/40 border border-white/5 flex-shrink-0">
          {feedback.hinh_anh ? (
            <Image
              fill
              src={feedback.hinh_anh.url_anh}
              alt={photoName}
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
              Không có ảnh
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-white font-bold text-[14.5px] tracking-tight truncate">
              {photoName}
            </h3>
            <span className="text-[13px] text-[var(--muted)]">-</span>
            <span className="text-[13.5px] text-slate-300 font-medium">
              <strong className="text-white font-semibold">
                {feedback.nguoi_binh_luan}
              </strong>
            </span>
            {feedback.hinh_anh?.album && (
              <span className="text-[12px] text-slate-400 bg-white/5 py-0.5 px-2 rounded-[6px] border border-white/5">
                {feedback.hinh_anh.album.du_an.ten_du_an} /{" "}
                {feedback.hinh_anh.album.ten_alb}
              </span>
            )}
          </div>

          <p className="text-[13.5px] text-slate-200 mt-2 italic leading-relaxed break-words">
            "{feedback.phan_hoi}"
          </p>

          {/* replies list inside the card */}
          {feedback.replies.length > 0 && (
            <div className="mt-3.5 flex flex-col gap-2.5">
              {feedback.replies.map((reply) => (
                <div
                  key={reply.ma_phan_hoi}
                  className="p-3.5 rounded-r-[12px] rounded-l-[4px] bg-white/[0.02] border-l-2 border-[#10b981] pl-4 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-[13.5px] text-white font-bold">
                      {reply.tho_anh?.ho_va_ten || reply.nguoi_binh_luan}
                      {reply.tho_anh?.vai_tro === "ADMIN" && (
                        <span className="text-[9.5px] bg-[#10b981]/15 text-[#34d399] py-0.5 px-1.5 rounded-[4px] ml-1.5 uppercase font-bold">
                          Admin
                        </span>
                      )}
                    </strong>
                    <span className="text-[11px] text-[var(--muted)]">
                      {formatDate(reply.ngay_tao)}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed break-words">
                    {reply.phan_hoi}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons on the right */}
      <div className="flex md:flex-col items-end gap-3 justify-between md:justify-start w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
        <Badge
          label={statusLabel}
          variant={badgeVariant}
          className={`${badgeOverrideClass} text-[11px] h-[26px]`}
        />

        <div className="flex  gap-2 w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="secondary"
            className="flex-1 md:w-[130px] min-h-[34px] text-[12.5px] rounded-[10px] border-white/5 hover:border-white/20 text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              onOpenReplies(feedback);
            }}
          >
            Thêm phản hồi
          </Button>

          <Button
            variant="secondary"
            className="flex-1 md:w-[130px] min-h-[34px] text-[12.5px] rounded-[10px] border-white/5 hover:border-white/20 text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStatusChange(feedback);
            }}
          >
            Đổi trạng thái
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
