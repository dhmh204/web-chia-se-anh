"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Panel from "@/app/(dashboard)/components/Panel";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import FeedbackCard, { FeedbackType } from "./FeedbackCard";
import CommentsListModal from "./CommentsListModal";

type FeedbacksClientProps = {
  initialFeedbacks: FeedbackType[];
};

type TabType = "all" | "pending" | "progress" | "completed" | "pinned";

const FeedbacksClient = ({ initialFeedbacks }: FeedbacksClientProps) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>(initialFeedbacks);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Modal triggers
  const [repliesModalFeedback, setRepliesModalFeedback] = useState<FeedbackType | null>(null);
  
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  useEffect(() => {
    if (focusId && feedbacks.length > 0) {
      const target = feedbacks.find((f) => f.ma_phan_hoi === focusId);
      if (target) {
        setRepliesModalFeedback(target);
      }
    }
  }, [focusId, feedbacks]);
  const [statusModalFeedback, setStatusModalFeedback] = useState<FeedbackType | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState<"CHUA_XU_LY" | "DANG_XU_LY" | "DA_XU_LY" | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/admin/feedbacks");
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);

        // Sync currently open replies modal if applicable
        if (repliesModalFeedback) {
          const fresh = data.find(
            (f: FeedbackType) => f.ma_phan_hoi === repliesModalFeedback.ma_phan_hoi
          );
          if (fresh) {
            setRepliesModalFeedback(fresh);
          }
        }
      }
    } catch (err) {
      console.error("Error refetching feedbacks:", err);
    }
  };

  // Filter feedbacks based on active tab
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return fb.trang_thai === "CHUA_XU_LY";
      if (activeTab === "progress") return fb.trang_thai === "DANG_XU_LY";
      if (activeTab === "completed") return fb.trang_thai === "DA_XU_LY";
      if (activeTab === "pinned") {
        // Pinned if coordinates are not default center center (50, 50)
        return (
          fb.toa_do_X !== 50 ||
          fb.toa_do_Y !== 50 ||
          fb.phan_tram_chieu_rong !== 10 ||
          fb.phan_tram_chieu_cao !== 10
        );
      }
      return true;
    });
  }, [feedbacks, activeTab]);

  const handleOpenStatusModal = (fb: FeedbackType) => {
    setStatusModalFeedback(fb);
    setTempStatus(fb.trang_thai);
  };

  const handleSaveStatus = async () => {
    if (!statusModalFeedback || !tempStatus || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_phan_hoi: statusModalFeedback.ma_phan_hoi,
          trang_thai: tempStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật trạng thái xử lý thành công.");
        setStatusModalFeedback(null);
        fetchFeedbacks();
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

  return (
    <div className="flex flex-col gap-6">
      <Panel
        kicker="PHẢN HỒI ẢNH"
        title="Quản lý nhận xét / yêu cầu chỉnh sửa"
        description="Mỗi phản hồi là một nhận xét trên ảnh, có thể kèm vùng ghim và trạng thái xử lý."
      >
        <div className="flex flex-col gap-5 mt-2">
          {/* Tabs Filter Bar */}
          <div className="flex flex-wrap gap-2 pb-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "pending", label: "Chưa xử lý" },
              { id: "progress", label: "Đang xử lý" },
              { id: "completed", label: "Đã xử lý" },
              { id: "pinned", label: "Có ghim vùng ảnh" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`h-[36px] px-4 rounded-[999px] text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 font-bold"
                    : "text-[var(--muted)] hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feedback list */}
          <div className="flex flex-col gap-4 mt-1">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-20 text-[var(--muted)] text-[14px] bg-[rgba(255,255,255,0.01)] rounded-[16px] border border-dashed border-white/10">
                Chưa có phản hồi nào trong bộ lọc này.
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.ma_phan_hoi}
                  feedback={feedback}
                  onOpenReplies={setRepliesModalFeedback}
                  onOpenStatusChange={handleOpenStatusModal}
                />
              ))
            )}
          </div>
        </div>
      </Panel>

      {/* Replies/Comments list Modal */}
      <CommentsListModal
        feedback={repliesModalFeedback}
        isOpen={!!repliesModalFeedback}
        onClose={() => setRepliesModalFeedback(null)}
        onUpdated={fetchFeedbacks}
      />

      {/* Change Status Modal */}
      {statusModalFeedback && (
        <Modal
          title="Đổi trạng thái xử lý"
          kicker="TRẠNG THÁI"
          onClose={() => setStatusModalFeedback(null)}
          widthClass="w-[min(480px,100%)]"
        >
          <div className="flex flex-col gap-5">
            <p className="text-[13.5px] text-slate-300">
              Chọn trạng thái xử lý cho phản hồi của khách{" "}
              <strong className="text-white">{statusModalFeedback.nguoi_binh_luan}</strong>:
            </p>

            {/* Status Selection Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  id: "CHUA_XU_LY",
                  label: "Chưa xử lý",
                  desc: "Nhận xét mới của khách hàng, chưa được thợ ảnh phân tích.",
                  colorClass: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
                  activeClass: "border-indigo-500 bg-indigo-500/10 text-indigo-300",
                },
                {
                  id: "DANG_XU_LY",
                  label: "Đang xử lý",
                  desc: "Thợ ảnh đang tiến hành chỉnh sửa hoặc đang note thông tin.",
                  colorClass: "hover:border-amber-500/50 hover:bg-amber-500/5",
                  activeClass: "border-amber-500 bg-amber-500/10 text-amber-300",
                },
                {
                  id: "DA_XU_LY",
                  label: "Đã xử lý",
                  desc: "Yêu cầu chỉnh sửa đã hoàn tất và ảnh đã được upload lại.",
                  colorClass: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                  activeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
                },
              ].map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setTempStatus(status.id as any)}
                  className={`p-3.5 rounded-[15px] border text-left cursor-pointer transition-all duration-200 flex flex-col gap-1 ${
                    tempStatus === status.id
                      ? status.activeClass
                      : `border-[var(--line)] bg-[var(--field-bg)] text-slate-300 ${status.colorClass}`
                  }`}
                >
                  <strong className="text-[14px] font-bold">{status.label}</strong>
                  <span className="text-[11.5px] opacity-80 leading-normal">{status.desc}</span>
                </button>
              ))}
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-2.5 mt-3 border-t border-white/5 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="min-h-[38px] px-4 rounded-[10px] text-[13px]"
                onClick={() => setStatusModalFeedback(null)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isUpdatingStatus || tempStatus === statusModalFeedback.trang_thai}
                className="min-h-[38px] px-5 rounded-[10px] text-[13px] bg-[#10b981] hover:bg-[#059669] text-black font-semibold"
                onClick={handleSaveStatus}
              >
                {isUpdatingStatus ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FeedbacksClient;
