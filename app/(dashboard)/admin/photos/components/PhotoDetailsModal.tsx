"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { PhotoType, getFileName, mapLoaiAlb } from "./PhotoCard";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";

type PhotoDetailsModalProps = {
  photo: PhotoType | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle: (photo: PhotoType) => void;
  onToggleStatus: (photo: PhotoType, type: "bi_mo") => void;
  onRunAI: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onAddComment: (photoId: string, commentText: string) => Promise<boolean>;
  onDeleteComment?: (photoId: string, commentId: string) => Promise<boolean>;
  onEditComment?: (photoId: string, commentId: string, text: string) => Promise<boolean>;
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
  onDeleteComment,
  onEditComment,
  runningAIPhotoId,
}: PhotoDetailsModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [confirmDeleteFeedbackId, setConfirmDeleteFeedbackId] = useState<string | null>(null);

  const [imgSize, setImgSize] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateImageRect = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const containerWidth = parentRect.width;
    const containerHeight = parentRect.height;
    
    const imgW = imageRef.current.naturalWidth;
    const imgH = imageRef.current.naturalHeight;

    if (!imgW || !imgH) return;

    const maxImgHeight = 400; 
    const r_img = imgW / imgH;

    let width = 0;
    let height = 0;

    const effectiveMaxHeight = Math.min(containerHeight, maxImgHeight);
    
    if (r_img > containerWidth / effectiveMaxHeight) {
      width = containerWidth;
      height = containerWidth / r_img;
    } else {
      height = effectiveMaxHeight;
      width = effectiveMaxHeight * r_img;
    }

    const left = (containerWidth - width) / 2;
    const top = (containerHeight - height) / 2;

    setImgSize({ width, height, left, top });
  }, []);

  useEffect(() => {
    updateImageRect();
    window.addEventListener("resize", updateImageRect);
    return () => window.removeEventListener("resize", updateImageRect);
  }, [updateImageRect]);

  // Reset when photo changes
  useEffect(() => {
    setImgSize(null);
    imageRef.current = null;
    setSelectedPinId(null);
    setHoveredPinId(null);
    setEditingCommentId(null);
    setEditingCommentText("");
    setConfirmDeleteFeedbackId(null);
  }, [photo?.ma_hinh_anh]);

  const handleStartEdit = (fb: any) => {
    setEditingCommentId(fb.ma_phan_hoi);
    setEditingCommentText(fb.phan_hoi);
  };

  const handleSaveEdit = async (feedbackId: string) => {
    if (!photo || !editingCommentText.trim() || !onEditComment) return;
    const success = await onEditComment(photo.ma_hinh_anh, feedbackId, editingCommentText.trim());
    if (success) {
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const handleDeleteComment = (feedbackId: string) => {
    setConfirmDeleteFeedbackId(feedbackId);
  };

  const executeDeleteComment = async (feedbackId: string) => {
    if (!photo || !onDeleteComment) return;
    await onDeleteComment(photo.ma_hinh_anh, feedbackId);
  };

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
    <>
      <Modal
      title={fileName}
      kicker="CHI TIẾT HÌNH ẢNH"
      onClose={onClose}
      widthClass=" w-[60%]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
        {/* Left: Image Frame */}
        <div className="flex flex-col gap-4">
          <div
            ref={containerRef}
            className="w-full bg-black/60 rounded-[15px] overflow-hidden border border-white/10 flex items-center justify-center min-h-[300px] relative"
          >
            <img
              src={photo.url_anh}
              alt="Full preview"
              onLoad={(e) => {
                imageRef.current = e.currentTarget;
                updateImageRect();
              }}
              className={`max-w-full max-h-[400px] object-contain select-none pointer-events-none ${
                photo.bi_mo ? "blur-[5px]" : ""
              }`}
            />
            {photo.bi_mo && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-[8px] shadow-lg tracking-wider text-[12px] uppercase">
                  Hệ thống AI cảnh báo ảnh mờ
                </span>
              </div>
            )}

            {/* Pinned Feedback overlays */}
            {imgSize &&
              photo.phan_hoi &&
              photo.phan_hoi.map((fb) => {
                const isPinned =
                  fb.toa_do_X !== 50 ||
                  fb.toa_do_Y !== 50 ||
                  fb.phan_tram_chieu_rong !== 10 ||
                  fb.phan_tram_chieu_cao !== 10;
                if (!isPinned) return null;

                const isHovered = hoveredPinId === fb.ma_phan_hoi;
                const isSelected = selectedPinId === fb.ma_phan_hoi;

                return (
                  <div
                    key={fb.ma_phan_hoi}
                    style={{
                      position: "absolute",
                      left: `${imgSize.left + (fb.toa_do_X * imgSize.width) / 100}px`,
                      top: `${imgSize.top + (fb.toa_do_Y * imgSize.height) / 100}px`,
                      width: `${(fb.phan_tram_chieu_rong * imgSize.width) / 100}px`,
                      height: `${(fb.phan_tram_chieu_cao * imgSize.height) / 100}px`,
                    }}
                    className={`group/pin border transition-all duration-200 z-20 flex items-center justify-center cursor-pointer ${
                      isHovered || isSelected
                        ? "border-emerald-400 bg-emerald-500/25 shadow-[0_0_12px_rgba(52,211,153,0.7)] scale-[1.02]"
                        : "border-dashed border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400 hover:bg-emerald-500/15"
                    }`}
                    onMouseEnter={() => setHoveredPinId(fb.ma_phan_hoi)}
                    onMouseLeave={() => setHoveredPinId(null)}
                    onClick={() => {
                      setSelectedPinId(fb.ma_phan_hoi);
                      // Scroll comment card into view
                      const element = document.getElementById(`admin-comment-${fb.ma_phan_hoi}`);
                      element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg transition-transform ${
                        isHovered || isSelected
                          ? "bg-emerald-400 text-black scale-110"
                          : "bg-[#10b981] text-black"
                      }`}
                    >
                      📌
                    </div>

                    {/* Tooltip */}
                    <div
                      className={`absolute bottom-full mb-2.5 transition-all duration-300 w-52 p-2.5 bg-[#05070a] border border-emerald-500/30 rounded-xl shadow-2xl z-50 text-left pointer-events-none select-none ${
                        isHovered
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 translate-y-1 invisible"
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1">
                        <strong className="text-[11.5px] text-white truncate max-w-[100px]">
                          {fb.nguoi_binh_luan}
                        </strong>
                        <span className="text-[9px] text-slate-500">
                          {new Date(fb.ngay_tao).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-normal line-clamp-3">
                        {fb.phan_hoi}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                  photo.phan_hoi.map((fb) => {
                    const isPinned =
                      fb.toa_do_X !== 50 ||
                      fb.toa_do_Y !== 50 ||
                      fb.phan_tram_chieu_rong !== 10 ||
                      fb.phan_tram_chieu_cao !== 10;
                    const isSelected = selectedPinId === fb.ma_phan_hoi;
                    const isHovered = hoveredPinId === fb.ma_phan_hoi;

                    return (
                      <div
                        key={fb.ma_phan_hoi}
                        id={`admin-comment-${fb.ma_phan_hoi}`}
                        onMouseEnter={() => {
                          if (isPinned && !editingCommentId) setHoveredPinId(fb.ma_phan_hoi);
                        }}
                        onMouseLeave={() => {
                          if (isPinned) setHoveredPinId(null);
                        }}
                        onClick={() => {
                          if (isPinned && !editingCommentId) setSelectedPinId(fb.ma_phan_hoi);
                        }}
                        className={`p-3 rounded-[10px] border transition-all duration-150 cursor-pointer group/cmt ${
                          isSelected
                            ? "bg-[#0c1411]/80 border-emerald-500/50 shadow-md"
                            : isHovered
                            ? "bg-white/[0.02] border-emerald-500/20"
                            : "bg-white/5 border-white/5"
                        } text-[13px]`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-[#34d399]">
                              {fb.nguoi_binh_luan}
                            </strong>
                            {fb.ma_tho_anh && (
                              <span className="bg-emerald-950/80 border border-emerald-900/30 text-emerald-400 font-bold text-[8.5px] uppercase px-1.5 py-0.5 rounded">
                                Thợ ảnh
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] text-[var(--muted)]">
                              {new Date(fb.ngay_tao).toLocaleDateString("vi-VN")}{" "}
                              {new Date(fb.ngay_tao).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>

                            {(!fb.ma_tho_anh || fb.ma_tho_anh) && editingCommentId !== fb.ma_phan_hoi && (onDeleteComment || onEditComment) && (
                              <div className="flex items-center gap-1.5 opacity-0 group-hover/cmt:opacity-100 transition-opacity duration-150">
                                {onEditComment && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEdit(fb);
                                    }}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 cursor-pointer border border-transparent"
                                    title="Sửa phản hồi"
                                  >
                                    <FaEdit size={11} />
                                  </button>
                                )}
                                {onDeleteComment && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteComment(fb.ma_phan_hoi);
                                    }}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 cursor-pointer border border-transparent"
                                    title="Xóa phản hồi"
                                  >
                                    <FaTrash size={10} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {editingCommentId === fb.ma_phan_hoi ? (
                          <div className="flex flex-col gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                              className="bg-[#0b1014] text-xs text-white border border-emerald-500/50 rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500 resize-none w-full"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingCommentId(null)}
                                className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-white rounded bg-white/5 hover:bg-white/10 cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(fb.ma_phan_hoi)}
                                className="px-2.5 py-1 text-[10px] font-bold text-black bg-[#10b981] hover:bg-[#059669] rounded cursor-pointer"
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-200 leading-relaxed break-words">
                            {fb.phan_hoi}
                          </p>
                        )}

                        {isPinned && (
                          <div className="flex justify-end mt-1.5 pt-1.5 border-t border-white/5">
                            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isSelected ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"}`}>
                              📌 Xem vùng ghim
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
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

      {confirmDeleteFeedbackId && (
        <Modal
          title="Xác nhận xóa phản hồi"
          kicker="CẢNH BÁO"
          onClose={() => setConfirmDeleteFeedbackId(null)}
          widthClass="w-[min(440px,95%)]"
        >
          <div className="flex flex-col gap-4 text-[14px] p-1">
            <p className="text-slate-350 leading-relaxed">
              Bạn có chắc chắn muốn xóa phản hồi này khỏi hệ thống?
            </p>
            <p className="text-red-400/90 text-[12px] leading-relaxed">
              * Hành động này không thể hoàn tác. Bình luận và vùng khoanh vùng liên quan sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
            </p>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmDeleteFeedbackId(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button 
                variant="danger" 
                onClick={async () => {
                  const id = confirmDeleteFeedbackId;
                  setConfirmDeleteFeedbackId(null);
                  await executeDeleteComment(id);
                }}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                Đồng ý xóa
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PhotoDetailsModal;
