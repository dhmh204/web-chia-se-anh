"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import DatePickerInput from "@/components/DatePickerInput";
import SelectCustom from "@/components/SelectCustom";
import MultiSelectCustom from "@/components/MultiSelectCustom";
import { formatTrangThaiDuAn, getBadgeVariantForProject } from "@/lib/format";
import CopyProjectLinkButton from "./CopyProjectLinkButton";
import { useRouter } from "next/navigation";
import { toastNotify } from "@/components/Toast";

type ProjectType = {
  ma_du_an: string;
  ten_du_an: string;
  ngay_chup: string;
  trang_thai: "MOI" | "DANG_CHON" | "DANG_SUA" | "HOAN_THANH";
  ma_chia_se: string;
  ghi_chu: string | null;
  mat_khau: string | null;
  khach_hang: {
    ma_khach_hang: string;
    ho_va_ten: string;
    so_dien_thoai: string;
  } | null;
  su_phan_cong: {
    nguoi_dung: {
      ma_nguoi_dung: string;
      ho_va_ten: string;
    };
  }[];
};

type TableProjectsProps = {
  initialProjects: ProjectType[];
};

const headers = [
  "Dự án",
  "Khách",
  "Thợ ảnh",
  "Ngày chụp",
  "Trạng thái",
  "Thao tác",
];

const STATUS_OPTIONS = [
  { value: "Mới", name: "MOI" },
  { value: "Đang chọn", name: "DANG_CHON" },
  { value: "Đang sửa", name: "DANG_SUA" },
  { value: "Hoàn thành", name: "HOAN_THANH" },
];

const TableProjects = ({ initialProjects }: TableProjectsProps) => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);

  // Sync state if initialProjects changes
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [editNameProject, setEditNameProject] = useState("");
  const [editDate, setEditDate] = useState<Date | null>(new Date());
  const [editTelPhone, setEditTelPhone] = useState("");
  const [editNameCustomer, setEditNameCustomer] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editTrangThai, setEditTrangThai] = useState("MOI");
  const [editSelectedPhotographers, setEditSelectedPhotographers] = useState<string[]>([]);
  const [editNote, setEditNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [photographers, setPhotographers] = useState<{ value: string; name: string }[]>([]);

  // Load photographers list once for dropdown
  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const res = await fetch("/api/admin/users?vai_tro=THO_ANH");
        if (res.ok) {
          const data = await res.json();
          if (data?.users) {
            const list = data.users.map((u: any) => ({
              value: u.ho_va_ten,
              name: u.ma_nguoi_dung,
            }));
            setPhotographers(list);
          }
        }
      } catch (err) {
        console.error("Error fetching photographers:", err);
      }
    };
    fetchPhotographers();
  }, []);

  // Debounced check for customer phone number
  useEffect(() => {
    const cleanPhone = editTelPhone.trim();
    if (cleanPhone.length < 10) return;

    const checkPhone = async () => {
      try {
        const res = await fetch(
          `/api/admin/customers/search?phone=${encodeURIComponent(cleanPhone)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            setEditNameCustomer(data.customer.ho_va_ten);
            toastNotify.success(
              "Khách hàng quen",
              `Đã tìm thấy: ${data.customer.ho_va_ten}`
            );
          }
        }
      } catch (err) {
        console.error("Error checking phone:", err);
      }
    };

    const timer = setTimeout(() => {
      checkPhone();
    }, 450);

    return () => clearTimeout(timer);
  }, [editTelPhone]);

  const handleOpenEdit = (project: ProjectType) => {
    setEditingProject(project);
    setEditNameProject(project.ten_du_an);
    setEditDate(project.ngay_chup ? new Date(project.ngay_chup) : new Date());
    setEditTelPhone(project.khach_hang?.so_dien_thoai || "");
    setEditNameCustomer(project.khach_hang?.ho_va_ten || "");
    setEditPassword(project.mat_khau || "");
    setEditTrangThai(project.trang_thai);
    setEditSelectedPhotographers(
      project.su_phan_cong.map((spc) => spc.nguoi_dung.ma_nguoi_dung)
    );
    setEditNote(project.ghi_chu || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || isSaving) return;

    if (!editNameProject.trim()) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập tên dự án");
      return;
    }
    if (!editDate) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn ngày chụp");
      return;
    }
    if (editTelPhone.trim().length < 10) {
      toastNotify.error("Lỗi nhập liệu", "Số điện thoại khách hàng phải từ 10 số");
      return;
    }
    if (!editNameCustomer.trim()) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập tên khách hàng");
      return;
    }
    if (editSelectedPhotographers.length === 0) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn thợ ảnh phụ trách");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_du_an: editingProject.ma_du_an,
          ten_du_an: editNameProject.trim(),
          ngay_chup: editDate.toISOString(),
          telPhone: editTelPhone.trim(),
          nameCustomer: editNameCustomer.trim(),
          photographerIds: editSelectedPhotographers,
          mat_khau: editPassword.trim() || null,
          trang_thai: editTrangThai,
          ghi_chu: editNote.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật dự án thành công!");
        setEditingProject(null);
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Có lỗi xảy ra khi cập nhật dự án.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Không thể gửi dữ liệu tới máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <>
      <Table headers={headers} id="projectsTableBody">
        {projects.map((project) => {
          const photographersStr = project.su_phan_cong
            .map((spc) => spc.nguoi_dung.ho_va_ten)
            .join(", ");

          return (
            <tr key={project.ma_du_an}>
              <td>
                <strong className="block font-semibold text-[14px]">
                  {project.ten_du_an}
                </strong>
              </td>
              <td>{project.khach_hang?.ho_va_ten || "Chưa có"}</td>
              <td>{photographersStr || "Chưa phân công"}</td>
              <td>{formatDate(project.ngay_chup)}</td>
              <td>
                <Badge
                  variant={getBadgeVariantForProject(project.trang_thai)}
                  label={formatTrangThaiDuAn(project.trang_thai)}
                />
              </td>
              <td>
                <div className="flex flex-wrap gap-[12px]">
                  <Button
                    variant="sm"
                    href={`/admin/projects/${project.ma_du_an}`}
                  >
                    Chi tiết
                  </Button>
                  <CopyProjectLinkButton ma_du_an={project.ma_du_an} />
                  <Button variant="sm" onClick={() => handleOpenEdit(project)}>
                    Sửa
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <Modal
          title="Cập nhật dự án"
          kicker="DỰ ÁN"
          onClose={() => setEditingProject(null)}
        >
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-[16px]">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tên dự án"
                placeholder="Nhập tên dự án"
                name="nameProject"
                value={editNameProject}
                onChange={(e) => setEditNameProject(e.target.value)}
                required
              />
              <DatePickerInput
                label="Ngày chụp"
                name="date"
                placeholder="Chọn ngày chụp"
                maxDate={new Date()}
                defaultValue={editDate || undefined}
                onChange={setEditDate}
              />
              <Input
                label="Số điện thoại"
                placeholder="VD: 0905 xxx xxx"
                name="telPhone"
                type="tel"
                value={editTelPhone}
                onChange={(e) => setEditTelPhone(e.target.value)}
                required
              />
              <Input
                label="Tên khách hàng"
                placeholder="Nhập tên khách hàng"
                name="nameCustomer"
                type="text"
                value={editNameCustomer}
                onChange={(e) => setEditNameCustomer(e.target.value)}
                required
              />
              <Input
                label="Mật khẩu dự án"
                placeholder="Nhập mật khẩu truy cập (tùy chọn)"
                name="mat_khau"
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
              <SelectCustom
                label="Trạng thái dự án"
                name="trang_thai"
                values={STATUS_OPTIONS}
                value={editTrangThai}
                onChange={setEditTrangThai}
              />
            </div>
            <MultiSelectCustom
              label="Thợ ảnh phụ trách"
              name="photographer"
              values={photographers}
              value={editSelectedPhotographers}
              onChange={setEditSelectedPhotographers}
            />
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="note"
                className="text-[#d1d5db] text-[13px] font-semibold"
              >
                Ghi chú
              </label>
              <textarea
                name="note"
                id="note"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="VD: Khách thích chụp tone ấm,..."
                className="h-[116px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px] outline-none transition-all duration-200 focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingProject(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px]"
              >
                {isSaving ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default TableProjects;
