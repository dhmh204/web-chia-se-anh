"use client";

import React, { useState } from "react";
import Panel from "@/app/(dashboard)/components/Panel";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SelectCustom from "@/components/SelectCustom";
import { formatTrangThaiDuAn, getBadgeVariantForProject } from "@/lib/format";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaRegCircle, FaImages, FaClock, FaChevronRight } from "react-icons/fa";

type ProjectProgressType = {
  ma_du_an: string;
  ten_du_an: string;
  trang_thai: "MOI" | "DANG_CHON" | "DANG_SUA" | "HOAN_THANH";
  ngay_chup: string;
  khach_hang: {
    ho_va_ten: string;
    so_dien_thoai: string;
  } | null;
  originalPhotosCount: number;
  finalPhotosCount: number;
  favoritesCount: number;
  totalFeedbackCount: number;
  resolvedFeedbackCount: number;
};

type Props = {
  projects: ProjectProgressType[];
};

const STATUS_OPTIONS = [
  { value: "Mới (Upload ảnh gốc)", name: "MOI" },
  { value: "Khách đang chọn ảnh", name: "DANG_CHON" },
  { value: "Đang sửa ảnh hậu kỳ", name: "DANG_SUA" },
  { value: "Đã hoàn thành bàn giao", name: "HOAN_THANH" },
];

const ProgressClient = ({ projects: initialProjects }: Props) => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectProgressType[]>(initialProjects);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const handleStatusChange = async (maDuAn: string, nextStatus: string) => {
    setUpdatingId(maDuAn);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_du_an: maDuAn,
          trang_thai: nextStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã cập nhật trạng thái tiến độ!");
        // Update local state
        setProjects((prev) =>
          prev.map((p) =>
            p.ma_du_an === maDuAn
              ? { ...p, trang_thai: nextStatus as any }
              : p
          )
        );
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật trạng thái.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối máy chủ.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Panel
      kicker="HẬU KỲ & TIẾN ĐỘ"
      title="Quản lý tiến độ sản xuất ảnh"
      description="Xem quy trình và cập nhật trạng thái công việc của các dự án được giao"
    >
      <div className="grid gap-6 mt-4">
        {projects.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)] text-[14px] bg-[rgba(255,255,255,0.01)] rounded-[16px] border border-dashed border-white/10">
            Bạn không có dự án nào đang được xử lý tiến độ.
          </div>
        ) : (
          projects.map((project) => {
            // Steps status check
            const step1Done = project.originalPhotosCount > 0;
            const step2Done = project.favoritesCount > 0;
            const step3Done = project.totalFeedbackCount > 0 && project.resolvedFeedbackCount === project.totalFeedbackCount;
            const step4Done = project.trang_thai === "HOAN_THANH" || project.finalPhotosCount > 0;

            return (
              <div
                key={project.ma_du_an}
                className="border border-[var(--line)] rounded-[20px] bg-[var(--surface-2)] p-6 flex flex-col gap-6"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-white mb-1">
                      {project.ten_du_an}
                    </h3>
                    <p className="text-[12px] text-[var(--muted)] font-semibold">
                      Khách hàng: <span className="text-slate-200">{project.khach_hang?.ho_va_ten || "Chưa có"}</span>
                      {project.khach_hang?.so_dien_thoai && ` (${project.khach_hang.so_dien_thoai})`}
                      {" · "}
                      Ngày chụp: <span className="text-slate-200">{formatDate(project.ngay_chup)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="min-w-[200px]">
                      <SelectCustom
                        label=""
                        name={`status-${project.ma_du_an}`}
                        values={STATUS_OPTIONS}
                        value={project.trang_thai}
                        onChange={(val) => handleStatusChange(project.ma_du_an, val)}
                        disabled={updatingId === project.ma_du_an}
                      />
                    </div>
                    <Badge
                      variant={getBadgeVariantForProject(project.trang_thai)}
                      label={formatTrangThaiDuAn(project.trang_thai)}
                      className="h-[32px] px-3.5"
                    />
                  </div>
                </div>

                {/* Steps Visual Tracker */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {/* Step 1 */}
                  <div className="flex gap-3 items-start relative z-10">
                    <div className="mt-0.5">
                      {step1Done ? (
                        <FaCheckCircle className="text-[#34d399] text-[20px]" />
                      ) : (
                        <FaRegCircle className="text-[var(--muted)] text-[20px]" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-bold mb-1 ${step1Done ? "text-white" : "text-[var(--muted)]"}`}>
                        1. Ảnh gốc
                      </h4>
                      <p className="text-[11.5px] text-[var(--muted-2)] leading-normal">
                        {project.originalPhotosCount > 0
                          ? `Đã upload ${project.originalPhotosCount} ảnh gốc`
                          : "Chưa upload ảnh gốc"}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3 items-start relative z-10">
                    <div className="mt-0.5">
                      {step2Done ? (
                        <FaCheckCircle className="text-[#34d399] text-[20px]" />
                      ) : (
                        <FaRegCircle className="text-[var(--muted)] text-[20px]" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-bold mb-1 ${step2Done ? "text-white" : "text-[var(--muted)]"}`}>
                        2. Khách chọn ảnh
                      </h4>
                      <p className="text-[11.5px] text-[var(--muted-2)] leading-normal">
                        {project.favoritesCount > 0
                          ? `Khách đã chọn ${project.favoritesCount} ảnh yêu thích`
                          : "Khách chưa chọn ảnh yêu thích"}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3 items-start relative z-10">
                    <div className="mt-0.5">
                      {step3Done ? (
                        <FaCheckCircle className="text-[#34d399] text-[20px]" />
                      ) : (
                        <FaRegCircle className="text-[var(--muted)] text-[20px]" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-bold mb-1 ${step3Done ? "text-white" : "text-[var(--muted)]"}`}>
                        3. Hậu kỳ & Sửa ảnh
                      </h4>
                      <p className="text-[11.5px] text-[var(--muted-2)] leading-normal">
                        {project.totalFeedbackCount > 0
                          ? `Đã xử lý ${project.resolvedFeedbackCount}/${project.totalFeedbackCount} yêu cầu`
                          : "Chưa có nhận xét chỉnh sửa"}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3 items-start relative z-10">
                    <div className="mt-0.5">
                      {step4Done ? (
                        <FaCheckCircle className="text-[#34d399] text-[20px]" />
                      ) : (
                        <FaRegCircle className="text-[var(--muted)] text-[20px]" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-bold mb-1 ${step4Done ? "text-white" : "text-[var(--muted)]"}`}>
                        4. Bàn giao final
                      </h4>
                      <p className="text-[11.5px] text-[var(--muted-2)] leading-normal">
                        {project.finalPhotosCount > 0
                          ? `Đã upload ${project.finalPhotosCount} ảnh final`
                          : "Chưa upload ảnh final bàn giao"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick actions for project */}
                <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                  <Button
                    variant="secondary"
                    href={`/photographer/albums?ma_du_an=${project.ma_du_an}`}
                    className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                  >
                    Xem Album
                  </Button>
                  <Button
                    variant="primary"
                    href={`/photographer/photos?ma_du_an=${project.ma_du_an}`}
                    className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                  >
                    Quản lý ảnh & Feedback
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
};

export default ProgressClient;
