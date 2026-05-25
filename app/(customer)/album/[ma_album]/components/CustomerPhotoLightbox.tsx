"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Heart,
  Download,
  MessageSquare,
  PenTool,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Photo, Feedback } from "./PhotoCard";
import { toastNotify } from "@/components/Toast";
import { ImPushpin } from "react-icons/im";

type CustomerPhotoLightboxProps = {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onLikeToggle?: (photoId: string, currentStatus: boolean) => void;
  onAddFeedback?: (photoId: string, newFeedback: Feedback) => void;
  onDeleteFeedback?: (photoId: string, feedbackId: string) => void;
  onEditFeedback?: (photoId: string, updatedFeedback: Feedback) => void;
  albumQuyenDownload?: boolean;
};

const getFileName = (url: string) => {
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart);
  } catch {
    return "IMG_IMAGE.PNG";
  }
};

export const CustomerPhotoLightbox = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onLikeToggle,
  onAddFeedback,
  onDeleteFeedback,
  onEditFeedback,
  albumQuyenDownload = false,
}: CustomerPhotoLightboxProps) => {
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  // UI Panel / Mode states
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [highlightedPinId, setHighlightedPinId] = useState<string | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Image dimension states to map object-contain coordinates exactly
  const [imgSize, setImgSize] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  // Drawing mouse states
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeSelection, setActiveSelection] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Comment inputs
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [generalCommentName, setGeneralCommentName] = useState("");
  const [generalCommentText, setGeneralCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [confirmDeleteFeedbackId, setConfirmDeleteFeedbackId] = useState<
    string | null
  >(null);
  const [myFeedbackIds, setMyFeedbackIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("my_feedbacks");
      if (stored) {
        try {
          setMyFeedbackIds(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset image natural dimensions and inputs when switching images
  useEffect(() => {
    setImgSize(null);
    imageRef.current = null;
    setActiveSelection(null);
    setShowNewCommentForm(false);
    setIsDrawingMode(false);
    setNewCommentText("");
    setEditingCommentId(null);
    setEditingCommentText("");
    setConfirmDeleteFeedbackId(null);
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goPrev, goNext, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Measuring the actual rendered image DOM node directly
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

  // Recalculate on load, resize, and sidebar toggle
  useEffect(() => {
    updateImageRect();
    window.addEventListener("resize", updateImageRect);

    // Add timeouts to handle layout settling and transition reflows
    const t1 = setTimeout(updateImageRect, 50);
    const t2 = setTimeout(updateImageRect, 150);

    return () => {
      window.removeEventListener("resize", updateImageRect);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateImageRect, isCommentsOpen]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
    updateImageRect();
  };

  // Drag and Select Canvas Events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || showNewCommentForm) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragStart({ x, y });
    setDragCurrent({ x, y });
    setActiveSelection(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !dragStart || showNewCommentForm) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    setDragCurrent({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !dragStart || showNewCommentForm) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const endX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const endY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const x = Math.min(dragStart.x, endX);
    const y = Math.min(dragStart.y, endY);
    const w = Math.abs(dragStart.x - endX);
    const h = Math.abs(dragStart.y - endY);

    // If it is just a click or tiny drag, position a default square area centered on the click
    if (w < 10 && h < 10) {
      const defaultSize = Math.min(rect.width, rect.height) * 0.1; // 10% of container size
      const defaultW = Math.max(30, defaultSize);
      const defaultH = Math.max(30, defaultSize);
      const clickX = Math.max(
        0,
        Math.min(rect.width - defaultW, x - defaultW / 2),
      );
      const clickY = Math.max(
        0,
        Math.min(rect.height - defaultH, y - defaultH / 2),
      );
      setActiveSelection({
        x: (clickX / rect.width) * 100,
        y: (clickY / rect.height) * 100,
        w: (defaultW / rect.width) * 100,
        h: (defaultH / rect.height) * 100,
      });
    } else {
      setActiveSelection({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        w: (w / rect.width) * 100,
        h: (h / rect.height) * 100,
      });
    }

    setDragStart(null);
    setDragCurrent(null);
    setShowNewCommentForm(true);
  };

  // Submit Pinned Feedback
  const handleSubmitPinnedComment = async () => {
    if (!newCommentText.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập nội dung nhận xét.");
      return;
    }
    if (!activeSelection) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ma_hinh_anh: photo.ma_hinh_anh,
        phan_hoi: newCommentText,
        nguoi_binh_luan: newCommentName.trim() || "Khách",
        toa_do_X: activeSelection.x,
        toa_do_Y: activeSelection.y,
        phan_tram_chieu_rong: activeSelection.w,
        phan_tram_chieu_cao: activeSelection.h,
      };

      const res = await fetch("/api/client/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Thất bại khi lưu phản hồi");

      const data = await res.json();
      toastNotify.success("Thành công", "Đã lưu phản hồi của bạn.");

      if (data.feedback?.ma_phan_hoi) {
        const nextIds = [...myFeedbackIds, data.feedback.ma_phan_hoi];
        setMyFeedbackIds(nextIds);
        localStorage.setItem("my_feedbacks", JSON.stringify(nextIds));
      }

      if (onAddFeedback) {
        onAddFeedback(photo.ma_hinh_anh, data.feedback);
      }

      setNewCommentText("");
      setActiveSelection(null);
      setShowNewCommentForm(false);
      setIsDrawingMode(false);
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể lưu phản hồi lúc này.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit General Feedback
  const handleSubmitGeneralComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalCommentText.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ma_hinh_anh: photo.ma_hinh_anh,
        phan_hoi: generalCommentText,
        nguoi_binh_luan: generalCommentName.trim() || "Khách",
        toa_do_X: 50.0,
        toa_do_Y: 50.0,
        phan_tram_chieu_rong: 10.0,
        phan_tram_chieu_cao: 10.0,
      };

      const res = await fetch("/api/client/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gửi nhận xét thất bại");

      const data = await res.json();
      toastNotify.success("Thành công", "Đã thêm nhận xét.");

      if (data.feedback?.ma_phan_hoi) {
        const nextIds = [...myFeedbackIds, data.feedback.ma_phan_hoi];
        setMyFeedbackIds(nextIds);
        localStorage.setItem("my_feedbacks", JSON.stringify(nextIds));
      }

      if (onAddFeedback) {
        onAddFeedback(photo.ma_hinh_anh, data.feedback);
      }

      setGeneralCommentText("");
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể gửi nhận xét lúc này.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (feedbackId: string) => {
    setConfirmDeleteFeedbackId(feedbackId);
  };

  const executeDeleteComment = async (feedbackId: string) => {
    try {
      const res = await fetch(`/api/client/feedback?id=${feedbackId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa nhận xét thất bại");

      toastNotify.success("Thành công", "Đã xóa nhận xét.");

      const nextIds = myFeedbackIds.filter((id) => id !== feedbackId);
      setMyFeedbackIds(nextIds);
      localStorage.setItem("my_feedbacks", JSON.stringify(nextIds));

      if (onDeleteFeedback) {
        onDeleteFeedback(photo.ma_hinh_anh, feedbackId);
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể xóa nhận xét lúc này.");
    }
  };

  const handleStartEdit = (fb: Feedback) => {
    setEditingCommentId(fb.ma_phan_hoi);
    setEditingCommentText(fb.phan_hoi);
  };

  const handleSaveEdit = async (feedbackId: string) => {
    if (!editingCommentText.trim()) {
      toastNotify.error("Lỗi", "Nội dung nhận xét không được để trống.");
      return;
    }

    try {
      const res = await fetch("/api/client/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_phan_hoi: feedbackId,
          phan_hoi: editingCommentText,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật nhận xét thất bại");

      const data = await res.json();
      toastNotify.success("Thành công", "Đã cập nhật nhận xét.");

      if (onEditFeedback) {
        onEditFeedback(photo.ma_hinh_anh, data.feedback);
      }

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể cập nhật nhận xét lúc này.");
    }
  };

  const handleCancelDrawing = () => {
    setActiveSelection(null);
    setShowNewCommentForm(false);
  };

  // Image Download handler
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url_anh);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = getFileName(photo.url_anh);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toastNotify.success("Tải xuống", "Bắt đầu tải hình ảnh.");
    } catch (error) {
      console.error("Download fail, opening tab as fallback:", error);
      window.open(photo.url_anh, "_blank");
    }
  };

  if (!isOpen || !photo) return null;

  const fileName = getFileName(photo.url_anh);
  const hasThumbs = photos.length > 1;

  // Dynamic Likes display calculation (uses mock values or is favorite)
  const baseLikes = photo.ma_hinh_anh.charCodeAt(0) || 0;
  const likesCount = photo.yeu_thich ? 1 + (baseLikes % 15) : baseLikes % 10;

  // Filter feedbacks into guest comments and photographer replies
  const commentsList = photo.phan_hoi || [];
  // Pinned comments: not matching default center coordinates (50, 50)
  const pinnedComments = commentsList.filter(
    (fb) =>
      fb.toa_do_X !== 50 ||
      fb.toa_do_Y !== 50 ||
      fb.phan_tram_chieu_rong !== 10 ||
      fb.phan_tram_chieu_cao !== 10,
  );

  const statusBadgeClasses = (status: string) => {
    switch (status) {
      case "DA_XU_LY":
        return "bg-emerald-950/30 text-emerald-400 border border-emerald-500/20";
      case "DANG_XU_LY":
        return "bg-amber-950/30 text-amber-400 border border-amber-500/20";
      default:
        return "bg-slate-900/60 text-slate-400 border border-white/5";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DA_XU_LY":
        return "Đã hoàn thành";
      case "DANG_XU_LY":
        return "Đang xử lý";
      default:
        return "Chưa xử lý";
    }
  };

  const content = (
    <div className="fixed inset-0 z-[99999] flex bg-black/[0.96] text-[#f8fafc] overflow-hidden">
      {/* ── LEFT: Preview workspace ── */}
      <div className="flex-1 flex flex-col relative h-full min-w-0">
        {/* Top Header */}
        <div
          className="flex-shrink-0 h-[52px] flex items-center justify-between px-5 z-10 select-none bg-gradient-to-b from-black/50 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-slate-400 text-[13px] font-bold">
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            onClick={onClose}
            title="Đóng (Esc)"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Workspace Canvas */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden px-12"
          onClick={onClose}
        >
          {/* Previous Arrow */}
          {hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              title="Ảnh trước (←)"
              className="absolute left-6 z-30 w-11 h-11 rounded-full bg-black/45 border border-white/10 text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Actual Image container with absolute overlays */}
          <div
            ref={containerRef}
            className="relative w-full h-full max-w-[85%] max-h-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={photo.url_anh}
              src={photo.url_anh}
              alt={fileName}
              fill
              sizes="100vw"
              className={`object-contain transition-opacity duration-300 select-none pointer-events-none ${
                photo.bi_mo ? "blur-[6px]" : ""
              }`}
              priority
              onLoad={handleImageLoad}
            />

            {/* Drawing/Feedback Overlay */}
            {imgSize && (
              <div
                style={{
                  position: "absolute",
                  left: `${imgSize.left}px`,
                  top: `${imgSize.top}px`,
                  width: `${imgSize.width}px`,
                  height: `${imgSize.height}px`,
                }}
                className={`absolute rounded overflow-visible ${
                  isDrawingMode
                    ? "z-30 cursor-crosshair border border-emerald-500/25 bg-emerald-500/[0.02]"
                    : "z-20 pointer-events-auto"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* 1. Dragging selection rectangle */}
                {isDrawingMode && dragStart && dragCurrent && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${Math.min(dragStart.x, dragCurrent.x)}px`,
                      top: `${Math.min(dragStart.y, dragCurrent.y)}px`,
                      width: `${Math.abs(dragStart.x - dragCurrent.x)}px`,
                      height: `${Math.abs(dragStart.y - dragCurrent.y)}px`,
                    }}
                    className="border-2 border-dashed border-emerald-500 bg-emerald-500/10 pointer-events-none z-40"
                  />
                )}

                {/* 2. Form popup for a newly drawn selection */}
                {showNewCommentForm && activeSelection && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${Math.min(72, Math.max(0, activeSelection.x))}%`,
                      top:
                        activeSelection.y + activeSelection.h + 2 > 70
                          ? `${Math.max(0, activeSelection.y - 35)}%`
                          : `${activeSelection.y + activeSelection.h + 2}%`,
                    }}
                    className="z-45 bg-[#060a0d] border border-emerald-500/40 rounded-xl p-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] w-[260px] flex flex-col gap-2.5 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                      <PenTool size={11} />
                      <span>Khoanh vùng nhận xét</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Tên người nhận xét"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="bg-[#0b1014] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                    />

                    <textarea
                      placeholder="Nhập yêu cầu sửa ảnh..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      rows={3}
                      className="bg-[#0b1014] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 resize-none"
                    />

                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={handleCancelDrawing}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSubmitPinnedComment}
                        disabled={isSubmitting || !newCommentText.trim()}
                        className="px-3 py-1.5 text-[11px] font-bold text-black bg-[#10b981] hover:bg-[#059669] disabled:opacity-40 disabled:hover:bg-[#10b981] rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                      >
                        {isSubmitting ? "Đang gửi..." : "Lưu"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Existing feedback boxes overlay */}
                {!isDrawingMode &&
                  pinnedComments.map((fb) => {
                    const isHovered = hoveredPinId === fb.ma_phan_hoi;
                    const isHighlighted = highlightedPinId === fb.ma_phan_hoi;

                    return (
                      <div
                        key={fb.ma_phan_hoi}
                        style={{
                          position: "absolute",
                          left: `${fb.toa_do_X}%`,
                          top: `${fb.toa_do_Y}%`,
                          width: `${fb.phan_tram_chieu_rong}%`,
                          height: `${fb.phan_tram_chieu_cao}%`,
                        }}
                        className={`group border transition-all duration-300 z-30 flex items-center justify-center cursor-pointer ${
                          isHighlighted || isHovered
                            ? "border-emerald-400 bg-emerald-500/25 shadow-[0_0_15px_rgba(52,211,153,0.7)] scale-[1.02]"
                            : "border-dashed border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400 hover:bg-emerald-500/15"
                        }`}
                        onMouseEnter={() => setHoveredPinId(fb.ma_phan_hoi)}
                        onMouseLeave={() => setHoveredPinId(null)}
                        onClick={() => {
                          setIsCommentsOpen(true);
                          setHighlightedPinId(fb.ma_phan_hoi);
                          // Scroll comment into view
                          setTimeout(() => {
                            const elem = document.getElementById(
                              `comment-${fb.ma_phan_hoi}`,
                            );
                            elem?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 150);
                        }}
                      >
                        {/* Point Marker */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
                            isHighlighted || isHovered
                              ? "bg-emerald-400 text-black scale-110"
                              : "bg-[#10b981] text-black"
                          }`}
                        >
                          <span className="text-[10px] font-black">
                            <ImPushpin size={16} color="red" />
                          </span>
                        </div>

                        {/* Tooltip on Hover */}
                        <div
                          className={`absolute bottom-full mb-2.5 transition-all duration-300 w-56 p-3 bg-[#05070a] border border-emerald-500/30 rounded-xl shadow-2xl z-50 text-left pointer-events-none select-none ${
                            isHovered
                              ? "opacity-100 translate-y-0 visible"
                              : "opacity-0 translate-y-1 invisible"
                          }`}
                        >
                          <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1.5">
                            <span className="text-[11.5px] font-extrabold text-white">
                              {fb.nguoi_binh_luan}
                            </span>
                            <span className="text-[9px] text-slate-500">
                              {new Date(fb.ngay_tao).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-200 leading-relaxed truncate-2-lines">
                            {fb.phan_hoi}
                          </p>
                          <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-white/5">
                            <span
                              className={`text-[8.5px] font-extrabold uppercase py-0.5 px-1.5 rounded ${statusBadgeClasses(
                                fb.trang_thai,
                              )}`}
                            >
                              {getStatusLabel(fb.trang_thai)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Next Arrow */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              title="Ảnh tiếp theo (→)"
              className="absolute right-6 z-30 w-11 h-11 rounded-full bg-black/45 border border-white/10 text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {hasThumbs && !isCommentsOpen && (
          <div
            className="flex-shrink-0 h-[88px] flex items-center justify-center gap-2.5 px-6 overflow-x-auto select-none bg-gradient-to-t from-black/50 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.map((p, idx) => (
              <button
                key={p.ma_hinh_anh}
                onClick={() => onNavigate(idx)}
                className={`flex-shrink-0 w-[60px] h-[42px] rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 relative p-0 bg-transparent ${
                  idx === currentIndex
                    ? "border-[#10b981] scale-105 shadow-md shadow-emerald-500/20 opacity-100"
                    : "border-white/15 opacity-40 hover:opacity-80"
                }`}
              >
                <Image
                  src={p.url_anh}
                  alt={`thumb-${idx}`}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Bottom Floating Bar */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full flex items-center gap-3.5 shadow-2xl transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Favorite heart circle */}
          <button
            onClick={() =>
              onLikeToggle && onLikeToggle(photo.ma_hinh_anh, photo.yeu_thich)
            }
            className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
              photo.yeu_thich
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={photo.yeu_thich ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart size={16} fill={photo.yeu_thich ? "white" : "none"} />
          </button>

          {/* Download button */}
          {albumQuyenDownload && (
            <button
              onClick={handleDownload}
              className="w-9.5 h-9.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Tải ảnh về máy"
            >
              <Download size={16} />
            </button>
          )}

          {/* Comments Toggle */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border ${
              isCommentsOpen
                ? "bg-[#10b981]/15 border-[#10b981] text-[#34d399] shadow-md shadow-emerald-500/10"
                : "bg-white/10 hover:bg-white/20 border-transparent text-white"
            }`}
            title="Nhận xét"
          >
            <MessageSquare size={16} />
          </button>

          {/* Crop Pin tool */}
          <button
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              if (!isDrawingMode) {
                setShowNewCommentForm(false);
                setActiveSelection(null);
              }
            }}
            className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border ${
              isDrawingMode
                ? "bg-[#10b981]/15 border-[#10b981] text-[#34d399]"
                : "bg-white/10 hover:bg-white/20 border-transparent text-white"
            }`}
            title={
              isDrawingMode ? "Hủy khoanh vùng" : "Khoanh vùng và ghim nhận xét"
            }
          >
            <PenTool size={16} />
          </button>

          {/* Likes indicator badge */}
          <div className="h-9.5 px-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5 text-[12.5px] text-white font-bold select-none">
            <span className="text-red-500">❤️</span>
            <span>{likesCount}</span>
          </div>
        </div>

        {/* Prompt banner when drawing mode is active */}
        {isDrawingMode && !showNewCommentForm && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#10b981]/95 text-black px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 select-none z-30 animate-bounce">
            <HelpCircle size={14} />
            <span>
              Kéo và thả chuột trên bức ảnh để khoanh vùng cần phản hồi
            </span>
          </div>
        )}
      </div>

      {/* ── RIGHT: Comments sidebar ── */}
      {isCommentsOpen && (
        <div
          className="w-[360px] max-w-full bg-[#05070a] border-l border-white/10 flex flex-col h-full z-50 animate-slide-in select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 h-[64px] border-b border-white/10 flex items-center justify-between px-5 bg-black/25">
            <div>
              <h3 className="font-extrabold text-[15px] text-white">
                Nhận xét & Phản hồi
              </h3>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {commentsList.length} bình luận trên ảnh
              </p>
            </div>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {commentsList.length === 0 ? (
              <div className="my-auto text-center py-20 text-[var(--muted)] text-[13px] px-6">
                <MessageSquare
                  className="mx-auto mb-3 opacity-20 text-[var(--muted)]"
                  size={32}
                />
                Chưa có phản hồi nào cho ảnh này. Viết nhận xét của bạn bên
                dưới!
              </div>
            ) : (
              commentsList.map((fb) => {
                const isReply =
                  fb.ma_tho_anh !== null && fb.ma_tho_anh !== undefined;
                const isSelected = highlightedPinId === fb.ma_phan_hoi;
                const isHovered = hoveredPinId === fb.ma_phan_hoi;
                const isPinned =
                  fb.toa_do_X !== 50 ||
                  fb.toa_do_Y !== 50 ||
                  fb.phan_tram_chieu_rong !== 10 ||
                  fb.phan_tram_chieu_cao !== 10;

                const isEditing = editingCommentId === fb.ma_phan_hoi;

                return (
                  <div
                    key={fb.ma_phan_hoi}
                    id={`comment-${fb.ma_phan_hoi}`}
                    onMouseEnter={() => {
                      if (isPinned && !isEditing)
                        setHoveredPinId(fb.ma_phan_hoi);
                    }}
                    onMouseLeave={() => {
                      if (isPinned) setHoveredPinId(null);
                    }}
                    onClick={() => {
                      if (isPinned && !isEditing) {
                        setHighlightedPinId(fb.ma_phan_hoi);
                      }
                    }}
                    className={`group p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isReply
                        ? "ml-6 bg-[#0c1411]/50 border-emerald-950/40"
                        : isSelected
                          ? "bg-[#0c1411]/80 border-emerald-500/50 shadow-md shadow-emerald-500/[0.04]"
                          : isHovered
                            ? "bg-white/[0.02] border-emerald-500/30"
                            : "bg-[#060a0d] border-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[12.5px] text-white">
                          {fb.nguoi_binh_luan}
                        </span>
                        {isReply && (
                          <span className="bg-emerald-950 border border-emerald-900/30 text-[#34d399] font-bold text-[8.5px] uppercase px-1.5 py-0.5 rounded">
                            Thợ ảnh
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">
                          {new Date(fb.ngay_tao).toLocaleDateString("vi-VN")}
                        </span>
                        {!isReply &&
                          !isEditing &&
                          myFeedbackIds.includes(fb.ma_phan_hoi) && (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(fb);
                                }}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 cursor-pointer border border-transparent"
                                title="Sửa nhận xét"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(fb.ma_phan_hoi);
                                }}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 cursor-pointer border border-transparent"
                                title="Xóa nhận xét"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div
                        className="flex flex-col gap-2 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
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
                      <p className="text-slate-300 text-[12.5px] leading-relaxed whitespace-pre-wrap">
                        {fb.phan_hoi}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                      <span
                        className={`text-[8.5px] font-extrabold uppercase py-0.5 px-1.5 rounded ${statusBadgeClasses(
                          fb.trang_thai,
                        )}`}
                      >
                        {getStatusLabel(fb.trang_thai)}
                      </span>

                      {isPinned && (
                        <span
                          className={`text-[9.5px] font-extrabold flex items-center gap-0.5 ${
                            isSelected
                              ? "text-emerald-400"
                              : "text-slate-500 hover:text-emerald-400"
                          }`}
                        >
                          📌 Xem vùng ghim
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Form to submit a general comment at bottom of sidebar */}
          <form
            onSubmit={handleSubmitGeneralComment}
            className="flex-shrink-0 p-4 border-t border-white/10 bg-black/20 flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
              <MessageSquare size={12} />
              <span>Gửi nhận xét chung</span>
            </div>

            <input
              type="text"
              placeholder="Tên của bạn (mặc định: Khách)"
              value={generalCommentName}
              onChange={(e) => setGeneralCommentName(e.target.value)}
              className="bg-[#0b1014] text-xs text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 transition-colors w-full"
            />

            <div className="flex gap-2">
              <textarea
                placeholder="Viết nhận xét của bạn..."
                value={generalCommentText}
                onChange={(e) => setGeneralCommentText(e.target.value)}
                rows={2}
                required
                className="flex-1 bg-[#0b1014] text-xs text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting || !generalCommentText.trim()}
                className="w-10 bg-[#10b981] hover:bg-[#059669] disabled:opacity-40 disabled:hover:bg-[#10b981] text-black font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Gửi nhận xét"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
      {confirmDeleteFeedbackId && (
        <div
          className="fixed inset-0 p-6 bg-black/85 backdrop-blur-[8px] z-[100000] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="max-h-[90vh] overflow-y-auto no-scrollbar p-6 border border-red-500/30 rounded-[26px] bg-[#0d0707] shadow-[0_0_90px_rgba(239,68,68,0.15)] w-[min(440px,95%)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-[18px] mb-5">
              <div>
                <p className="text-red-400 text-[11px] font-extrabold tracking-[0.18em] uppercase mb-[7px]">
                  CẢNH BÁO
                </p>
                <h2 className="text-[22px] font-bold mt-[6px] text-white">
                  Xác nhận xóa nhận xét
                </h2>
              </div>
              <button
                type="button"
                className="cursor-pointer flex justify-center items-center w-[38px] h-[38px] rounded-[12px] border border-white/10 bg-white/5 text-white text-[24px] opacity-70 hover:opacity-100 duration-200"
                onClick={() => setConfirmDeleteFeedbackId(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-[14px] p-1">
              <p className="text-slate-350 leading-relaxed">
                Bạn có chắc chắn muốn xóa nhận xét này khỏi hệ thống?
              </p>
              <p className="text-red-400/90 text-[12px] leading-relaxed">
                * Hành động này không thể hoàn tác. Nhận xét và vùng khoanh vùng
                liên quan sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
              </p>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => setConfirmDeleteFeedbackId(null)}
                  className="min-h-[38px] px-4 rounded-[11px] text-[13px] bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    const id = confirmDeleteFeedbackId;
                    setConfirmDeleteFeedbackId(null);
                    await executeDeleteComment(id);
                  }}
                  className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer font-semibold"
                >
                  Đồng ý xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `,
        }}
      />
    </div>
  );

  return createPortal(content, document.body);
};
