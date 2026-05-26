"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { FaComments, FaImage, FaTrash, FaEdit, FaCheck, FaTimes, FaUser, FaPaperPlane } from "react-icons/fa";
import { toastNotify } from "@/components/Toast";
import { FeedbackType, formatDate, getPhotoName } from "./FeedbackCard";
import SelectCustom from "@/components/SelectCustom";

type CommentsListModalProps = {
  feedback: FeedbackType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

const CommentsListModal = ({
  feedback,
  isOpen,
  onClose,
  onUpdated,
}: CommentsListModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<"CHUA_XU_LY" | "DANG_XU_LY" | "DA_XU_LY">(
    feedback?.trang_thai || "CHUA_XU_LY"
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Pinned feedback coordinates visual overlay refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imgSize, setImgSize] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  // Check if feedback coordinate is pinned (different from default 50, 50)
  const isPinned = !!(feedback && (
    feedback.toa_do_X !== 50 ||
    feedback.toa_do_Y !== 50 ||
    feedback.phan_tram_chieu_rong !== 10 ||
    feedback.phan_tram_chieu_cao !== 10
  ));

  const updateImageRect = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const containerWidth = parentRect.width;
    const containerHeight = parentRect.height;

    const imgW = imageRef.current.naturalWidth;
    const imgH = imageRef.current.naturalHeight;

    if (!imgW || !imgH) return;

    const r_img = imgW / imgH;
    const r_cont = containerWidth / containerHeight;

    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;

    if (r_img > r_cont) {
      width = containerWidth;
      height = containerWidth / r_img;
      left = 0;
      top = (containerHeight - height) / 2;
    } else {
      height = containerHeight;
      width = containerHeight * r_img;
      left = (containerWidth - width) / 2;
      top = 0;
    }

    setImgSize({ width, height, left, top });
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
    updateImageRect();
  };

  // Full-screen visual preview state and refs
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const fullScreenImageRef = useRef<HTMLImageElement | null>(null);
  const [fullScreenImgSize, setFullScreenImgSize] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  const updateFullScreenImageRect = useCallback(() => {
    if (!fullScreenContainerRef.current || !fullScreenImageRef.current) return;
    const parentRect = fullScreenContainerRef.current.getBoundingClientRect();
    const containerWidth = parentRect.width;
    const containerHeight = parentRect.height;

    const imgW = fullScreenImageRef.current.naturalWidth;
    const imgH = fullScreenImageRef.current.naturalHeight;

    if (!imgW || !imgH) return;

    const r_img = imgW / imgH;
    const r_cont = containerWidth / containerHeight;

    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;

    if (r_img > r_cont) {
      width = containerWidth;
      height = containerWidth / r_img;
      left = 0;
      top = (containerHeight - height) / 2;
    } else {
      height = containerHeight;
      width = containerHeight * r_img;
      left = (containerWidth - width) / 2;
      top = 0;
    }

    setFullScreenImgSize({ width, height, left, top });
  }, []);

  const handleFullScreenImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    fullScreenImageRef.current = e.currentTarget;
    updateFullScreenImageRect();
  };

  useEffect(() => {
    setImgSize(null);
    imageRef.current = null;
    setFullScreenImgSize(null);
    fullScreenImageRef.current = null;
    setIsFullScreenOpen(false);
    if (feedback) {
      setCurrentStatus(feedback.trang_thai);
    }
  }, [feedback, isOpen]);

  useEffect(() => {
    if (!isOpen || !feedback?.hinh_anh) return;

    const handleResize = () => {
      updateImageRect();
    };

    window.addEventListener("resize", handleResize);
    // Add timeouts to handle layout settling and transition reflows
    const t1 = setTimeout(updateImageRect, 50);
    const t2 = setTimeout(updateImageRect, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen, feedback, updateImageRect]);

  useEffect(() => {
    if (!isFullScreenOpen || !feedback?.hinh_anh) return;

    const handleResize = () => {
      updateFullScreenImageRect();
    };

    window.addEventListener("resize", handleResize);
    // Add timeouts to handle layout settling and transition reflows
    const t1 = setTimeout(updateFullScreenImageRect, 50);
    const t2 = setTimeout(updateFullScreenImageRect, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFullScreenOpen, feedback, updateFullScreenImageRect]);

  const handleStatusChange = async (newStatus: "CHUA_XU_LY" | "DANG_XU_LY" | "DA_XU_LY") => {
    if (!feedback || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_phan_hoi: feedback.ma_phan_hoi,
          trang_thai: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã cập nhật trạng thái xử lý.");
        setCurrentStatus(newStatus);
        onUpdated(); // Refresh parent list
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật trạng thái.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!feedback || !isOpen) return null;

  const photoName = feedback.hinh_anh
    ? getPhotoName(feedback.hinh_anh.url_anh)
    : "Ảnh đã bị xóa";

  // Combine parent comment and replies in chronological order
  const allComments = [
    {
      ma_phan_hoi: feedback.ma_phan_hoi,
      ma_hinh_anh: feedback.ma_hinh_anh,
      ma_tho_anh: feedback.ma_tho_anh,
      nguoi_binh_luan: feedback.nguoi_binh_luan,
      phan_hoi: feedback.phan_hoi,
      ngay_tao: feedback.ngay_tao,
      isParent: true,
      tho_anh: null,
    },
    ...feedback.replies.map((r) => ({
      ma_phan_hoi: r.ma_phan_hoi,
      ma_hinh_anh: r.ma_hinh_anh,
      ma_tho_anh: r.ma_tho_anh,
      nguoi_binh_luan: r.tho_anh?.ho_va_ten || r.nguoi_binh_luan,
      phan_hoi: r.phan_hoi,
      ngay_tao: r.ngay_tao,
      isParent: false,
      tho_anh: r.tho_anh,
    })),
  ].sort(
    (a, b) => new Date(a.ngay_tao).getTime() - new Date(b.ngay_tao).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_hinh_anh: feedback.ma_hinh_anh,
          phan_hoi: commentText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã gửi phản hồi mới.");
        setCommentText("");
        onUpdated(); // Refresh dashboard list
      } else {
        toastNotify.error("Thất bại", data.message || "Lỗi khi gửi phản hồi.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleEditSave = async (id: string) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_phan_hoi: id,
          phan_hoi: editText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã cập nhật nhận xét.");
        setEditingId(null);
        onUpdated();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối khi chỉnh sửa.");
    }
  };

  // Handle delete comment confirm trigger
  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDeleteComment = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    try {
      const res = await fetch(`/api/admin/feedbacks?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã xóa nhận xét.");
        onUpdated();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể xóa nhận xét.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối khi xóa.");
    }
  };

  return (
    <Modal
      title="Nhận xét ảnh"
      kicker=""
      onClose={onClose}
      widthClass="w-[min(600px,100%)]"
    >
      <div className="flex flex-col gap-4">
        {/* Photo preview */}
        {feedback.hinh_anh ? (
          <div
            ref={containerRef}
            onClick={() => setIsFullScreenOpen(true)}
            className="relative w-full h-[240px] rounded-[14px] overflow-hidden bg-black/50 border border-white/10 group flex items-center justify-center cursor-zoom-in"
          >
            <Image
              src={feedback.hinh_anh.url_anh}
              alt={photoName}
              fill
              sizes="(max-width: 600px) 100vw, 560px"
              className="object-contain"
              onLoad={handleImageLoad}
            />

            {/* Drawing/Feedback Overlay */}
            {imgSize && isPinned && (
              <div
                style={{
                  position: "absolute",
                  left: `${imgSize.left}px`,
                  top: `${imgSize.top}px`,
                  width: `${imgSize.width}px`,
                  height: `${imgSize.height}px`,
                }}
                className="absolute z-20 pointer-events-none"
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${feedback.toa_do_X}%`,
                    top: `${feedback.toa_do_Y}%`,
                    width: `${feedback.phan_tram_chieu_rong}%`,
                    height: `${feedback.phan_tram_chieu_cao}%`,
                  }}
                  className="border-2 border-dashed border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.7)] flex items-center justify-center animate-pulse"
                >
                  <span className="text-[14px] drop-shadow-md">📌</span>
                </div>
              </div>
            )}

            {/* Soft gradient overlay at the bottom */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 flex items-end justify-between z-30">
              <div className="flex flex-col gap-1 min-w-0 pr-4">
                <span className="text-[13.5px] text-white font-bold truncate drop-shadow-md">
                  {photoName}
                </span>
                {feedback.hinh_anh.album && (
                  <span className="text-[11.5px] text-slate-300 drop-shadow-md truncate">
                    {feedback.hinh_anh.album.du_an.ten_du_an} / {feedback.hinh_anh.album.ten_alb}
                  </span>
                )}
              </div>
              <a
                href={feedback.hinh_anh.url_anh}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 bg-white/10 hover:bg-[#10b981] hover:text-white border border-white/10 px-3 py-1.5 rounded-[8px] text-[12px] text-slate-200 transition-all duration-300 flex items-center gap-1.5 font-medium backdrop-blur-sm shadow-lg hover:shadow-[#10b981]/25 z-40"
              >
                <FaImage size={11} />
                Mở ảnh
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-slate-800/30 border border-white/5 rounded-[12px] text-[13.5px] text-slate-500 font-medium">
            <span>Ảnh đã bị xóa hoặc không khả dụng</span>
          </div>
        )}

        {/* Status updater custom select */}
        <div className="flex items-center justify-between p-3.5 border border-white/5 bg-white/[0.015] rounded-[16px] text-[13.5px] mt-1 gap-4">
          <div className="flex flex-col flex-grow">
            <span className="text-white font-bold block">Trạng thái xử lý hậu kỳ</span>
            <span className="text-[11.5px] text-slate-400 block mt-0.5">
              Cập nhật tiến độ chỉnh sửa ảnh cho khách hàng xem.
            </span>
          </div>
          <div className="w-[200px] flex-shrink-0">
            <SelectCustom
              name="phan_hoi_status"
              label=""
              value={currentStatus}
              onChange={(val) => handleStatusChange(val as any)}
              values={[
                { value: "Chưa xử lý (Mới)", name: "CHUA_XU_LY" },
                { value: "Đang xử lý (Đang sửa)", name: "DANG_XU_LY" },
                { value: "Đã xử lý (Hoàn thành)", name: "DA_XU_LY" },
              ]}
            />
          </div>
        </div>

        {/* Previous comments */}
        <div>
          <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <FaComments className="text-[#34d399]" />
            Các nhận xét trước đó:
          </h4>

          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar mb-2">
            {allComments.map((comment) => (
              <div
                key={comment.ma_phan_hoi}
                className="p-3.5 rounded-[12px] bg-white/[0.02] border border-white/5 text-[13.5px]"
              >
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[#34d399] font-bold">
                      {comment.nguoi_binh_luan[0]?.toUpperCase() || "K"}
                    </div>
                    <strong className="text-[#34d399] text-[13px]">
                      {comment.nguoi_binh_luan}
                      {comment.tho_anh?.vai_tro === "ADMIN" && (
                        <span className="text-[9.5px] bg-[#10b981]/15 text-[#34d399] py-0.5 px-1.5 rounded-[4px] ml-1.5 uppercase font-bold">
                          Admin
                        </span>
                      )}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[var(--muted)]">
                      {formatDate(comment.ngay_tao)}
                    </span>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(comment.ma_phan_hoi, comment.phan_hoi)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-150"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.ma_phan_hoi)}
                        className="text-slate-400 hover:text-red-400 transition-colors duration-150"
                        title="Xóa nhận xét"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {editingId === comment.ma_phan_hoi ? (
                  <div className="flex gap-2 items-center mt-2 pl-6">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow h-[34px] px-3 bg-[rgba(255,255,255,0.035)] border border-[var(--line)] rounded-[8px] text-[13px] text-white outline-none focus:border-[var(--line-green)]"
                      placeholder="Sửa bình luận..."
                    />
                    <button
                      type="button"
                      onClick={() => handleEditSave(comment.ma_phan_hoi)}
                      className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-[6px] transition-colors"
                    >
                      <FaCheck size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-[6px] transition-colors"
                    >
                      <FaTimes size={13} />
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-200 mt-1 pl-6 leading-relaxed break-words">
                    {comment.phan_hoi}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comment/Reply form */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 pt-4 mt-1">
          <div className="flex flex-col gap-3">
            <textarea
              placeholder="Nhập nhận xét của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full h-[80px] p-3 bg-[rgba(255,255,255,0.035)] border border-[var(--line)] rounded-[12px] text-[13.5px] text-white outline-none focus:border-[var(--line-green)] transition-all resize-none"
              required
            />
            <div className="flex justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                className="min-h-[38px] px-4 rounded-[10px] text-[13px]"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="min-h-[38px] px-5 rounded-[10px] text-[13px] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={11} />
                    Gửi
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
        {/* CUSTOM CONFIRM DELETE COMMENT MODAL */}
        {confirmDeleteId && (
          <Modal
            title="Xác nhận xóa nhận xét"
            kicker="CẢNH BÁO"
            onClose={() => setConfirmDeleteId(null)}
            widthClass="w-[min(420px,100%)]"
          >
            <div className="flex flex-col gap-4 text-[14px] p-1">
              <p className="text-slate-300 leading-relaxed">
                Bạn có chắc chắn muốn xóa nhận xét này?
              </p>
              <p className="text-red-400/90 text-[12px] leading-relaxed">
                * Nhận xét và toàn bộ nội dung trao đổi đi kèm sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                <Button
                  variant="secondary"
                  onClick={() => setConfirmDeleteId(null)}
                  className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                >
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmDeleteComment}
                  className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700"
                >
                  Đồng ý xóa
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      {/* Full-screen inspector */}
      {isFullScreenOpen && feedback.hinh_anh && (
        <div
          className="fixed inset-0 z-[200000] bg-black/95 flex flex-col justify-between select-none animate-fade-in"
          onClick={() => setIsFullScreenOpen(false)}
        >
          {/* Header Bar */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#050706]/60 backdrop-blur-md z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-white font-extrabold text-[15px] truncate max-w-[280px] sm:max-w-md">
                {photoName}
              </h3>
              <p className="text-[12px] text-slate-400 font-semibold mt-0.5">
                Nhận xét từ {feedback.nguoi_binh_luan}
              </p>
            </div>

            <button
              onClick={() => setIsFullScreenOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-red-950/40 hover:bg-red-950/10 hover:text-red-400 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </header>

          {/* Image Workspace Canvas */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-12 relative overflow-hidden" onClick={() => setIsFullScreenOpen(false)}>
            <div
              ref={fullScreenContainerRef}
              className="relative w-full h-full max-w-[85%] max-h-[85%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={feedback.hinh_anh.url_anh}
                alt={photoName}
                fill
                sizes="100vw"
                className="object-contain select-none"
                onLoad={handleFullScreenImageLoad}
              />

              {/* Highlight Coordinates Box */}
              {fullScreenImgSize && isPinned && (
                <div
                  style={{
                    position: "absolute",
                    left: `${fullScreenImgSize.left}px`,
                    top: `${fullScreenImgSize.top}px`,
                    width: `${fullScreenImgSize.width}px`,
                    height: `${fullScreenImgSize.height}px`,
                  }}
                  className="absolute z-20 pointer-events-none"
                >
                  <div
                    style={{
                      position: "absolute",
                      left: `${feedback.toa_do_X}%`,
                      top: `${feedback.toa_do_Y}%`,
                      width: `${feedback.phan_tram_chieu_rong}%`,
                      height: `${feedback.phan_tram_chieu_cao}%`,
                    }}
                    className="border-2 border-dashed border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.7)] flex items-center justify-center animate-pulse"
                  >
                    <span className="text-[18px] drop-shadow-md">📌</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Context Banner */}
          <footer className="border-t border-white/5 bg-[#050706]/85 backdrop-blur-md p-5 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#34d399] bg-[#10b981]/15 border border-[#10b981]/25 px-3 py-1 rounded-full">
                Yêu cầu sửa từ {feedback.nguoi_binh_luan}
              </span>
              <p className="text-slate-200 mt-3 text-[14.5px] leading-relaxed italic font-semibold">
                "{feedback.phan_hoi}"
              </p>
            </div>
          </footer>
        </div>
      )}
    </Modal>
  );
};

export default CommentsListModal;
