"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { PhotoType, getFileName, mapLoaiAlb } from "./PhotoCard";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

type PhotoDetailsModalProps = {
  photo: PhotoType | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle: (photo: PhotoType) => void;
  onToggleStatus: (photo: PhotoType, type: "bi_mo") => void;
  onRunAI: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onAddComment: (photoId: string, commentText: string) => Promise<boolean>;
  runningAIPhotoId: string | null;
};

const PhotoDetailsModal = ({
  photo,
  isOpen,
  onClose,
  onLikeToggle,
  onToggleStatus,
  onRunAI,
  onDelete,
  onAddComment,
  runningAIPhotoId,
}: PhotoDetailsModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!photo || !isOpen) return null;

  const fileName = getFileName(photo.url_anh);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const success = await onAddComment(photo.ma_hinh_anh, commentText);
    setIsSubmittingComment(false);

    if (success) {
      setCommentText("");
    }
  };

  return (
    <Modal
      title={fileName}
      kicker="CHI TIẾT HÌNH ẢNH"
      onClose={onClose}
      widthClass=" w-[60%]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
        {/* Left: Image Frame */}
        <div className="flex flex-col gap-4">
          <div className="w-full bg-black/60 rounded-[15px] overflow-hidden border border-white/10 flex items-center justify-center min-h-[300px] relative">
            <img
              src={photo.url_anh}
              alt="Full preview"
              className={`max-w-full max-h-[400px] object-contain ${
                photo.bi_mo ? "blur-[5px]" : ""
              }`}
            />
            {photo.bi_mo && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-[8px] shadow-lg tracking-wider text-[12px] uppercase">
                  Hệ thống AI cảnh báo ảnh mờ
                </span>
              </div>
            )}
          </div>

          {/* Heart and Action Buttons inside Modal */}
          <div className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-[12px]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onLikeToggle(photo)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-[18px] transition-all duration-150 scale-100 hover:scale-105 ${
                  photo.yeu_thich
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                }`}
                title={photo.yeu_thich ? "Bỏ yêu thích" : "Yêu thích"}
              >
                <IoIosHeart size={16} color="white" />
              </button>
              <div>
                <span className="text-[13px] text-[var(--muted)] block">
                  Yêu thích
                </span>
                <strong className="text-white text-[15px]">
                  {photo.yeu_thich ? "1" : "0"} lượt thích
                </strong>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="min-h-[36px] px-3.5 text-[12.5px] rounded-[10px]"
                onClick={() => onRunAI(photo.ma_hinh_anh)}
                disabled={runningAIPhotoId !== null}
              >
                {runningAIPhotoId === photo.ma_hinh_anh ? (
                  <span className="flex items-center gap-1.5 animate-pulse">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    AI đang quét...
                  </span>
                ) : (
                  "Kích hoạt AI xử lý"
                )}
              </Button>
              <Button
                variant="danger"
                className="min-h-[36px] px-3.5 text-[12.5px] rounded-[10px] bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onDelete(photo.ma_hinh_anh)}
              >
                Xóa ảnh
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Info and Feedback list */}
        <div className="flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="border-b border-white/10 pb-4 mb-4">
              <h4 className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2.5">
                Thông tin ảnh
              </h4>
              <div className="grid grid-cols-2 gap-y-2.5 text-[13px]">
                <span className="text-slate-400">Dự án:</span>
                <strong className="text-white text-right">
                  {photo.album.du_an.ten_du_an}
                </strong>

                <span className="text-slate-400">Album:</span>
                <strong className="text-white text-right">
                  {photo.album.ten_alb} ({mapLoaiAlb(photo.album.loai_alb)})
                </strong>

                <span className="text-slate-400">Ngày tải lên:</span>
                <span className="text-slate-200 text-right">
                  {new Date(photo.ngay_tao).toLocaleDateString("vi-VN")}
                </span>

                <span className="text-slate-400">Trạng thái:</span>
                <span className="text-right">
                  {photo.bi_mo ? (
                    <span className="text-red-400 font-semibold">
                      Cảnh báo mờ và ẩn (AI)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">
                      Hiển thị công khai
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Feedbacks list */}
            <div>
              <h4 className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2.5">
                Phản hồi & Yêu cầu sửa ({photo.phan_hoi.length})
              </h4>

              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar mb-4">
                {photo.phan_hoi.length === 0 ? (
                  <div className="text-[13px] text-[var(--muted)] italic py-6 text-center bg-white/5 rounded-[8px]">
                    Chưa có phản hồi nào cho ảnh này.
                  </div>
                ) : (
                  photo.phan_hoi.map((fb) => (
                    <div
                      key={fb.ma_phan_hoi}
                      className="p-3 rounded-[10px] bg-white/5 border border-white/5 text-[13px]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-[#34d399]">
                          {fb.nguoi_binh_luan}
                        </strong>
                        <span className="text-[10.5px] text-[var(--muted)]">
                          {new Date(fb.ngay_tao).toLocaleDateString("vi-VN")}{" "}
                          {new Date(fb.ngay_tao).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed break-words">
                        {fb.phan_hoi}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <form
            onSubmit={handleCommentSubmit}
            className="mt-auto border-t border-white/10 pt-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập yêu cầu sửa/phản hồi..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 h-[38px] px-3.5 bg-[rgba(255,255,255,0.035)] border border-[var(--line)] rounded-[10px] text-[13.5px] text-white outline-none focus:border-[var(--line-green)] transition-all"
              />
              <Button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="min-h-[38px] px-4 rounded-[10px] bg-[#10b981] hover:bg-[#059669] text-black font-semibold"
              >
                Gửi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default PhotoDetailsModal;
