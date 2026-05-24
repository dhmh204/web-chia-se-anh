"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  FaCalendarAlt, 
  FaUser, 
  FaPhone, 
  FaLock, 
  FaFileAlt, 
  FaEdit, 
  FaPlus, 
  FaTrash, 
  FaCog, 
  FaExternalLinkAlt, 
  FaCopy, 
  FaCheck, 
  FaArrowLeft, 
  FaImages, 
  FaCommentDots 
} from "react-icons/fa";
import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import MultiSelectCustom from "@/components/MultiSelectCustom";
import DatePickerInput from "@/components/DatePickerInput";
import Modal from "@/components/Modal";
import Panel from "@/app/(dashboard)/components/Panel";
import Badge from "@/components/Badge";
import { toastNotify } from "@/components/Toast";
import FormCreateAlb from "@/app/(dashboard)/admin/albums/components/FormCreateAlb";

type AlbumSummary = {
  ma_album: string;
  ten_alb: string;
  loai_alb: string;
  quyen_download: boolean;
  photoCount: number;
  ngay_tao: string;
};

type ProjectSummary = {
  ma_du_an: string;
  ten_du_an: string;
  ngay_chup: string;
  link_anh_bia: string | null;
  mat_khau: string | null;
  trang_thai: string;
  ghi_chu: string;
  khach_hang: {
    ma_khach_hang: string;
    ho_va_ten: string;
    so_dien_thoai: string;
  } | null;
  su_phan_cong: {
    ma_nguoi_dung: string;
    ho_va_ten: string;
  }[];
  albums: AlbumSummary[];
};

type ProjectDetailClientProps = {
  project: ProjectSummary;
  photographers: { name: string; value: string }[];
  stats: {
    totalPhotos: number;
    totalFeedback: number;
    pendingFeedback: number;
  };
};

const STATUS_OPTIONS = [
  { value: "Mới", name: "MOI" },
  { value: "Đang chọn", name: "DANG_CHON" },
  { value: "Đang sửa", name: "DANG_SUA" },
  { value: "Hoàn thành", name: "HOAN_THANH" },
];

const mapLoaiAlb = (type: string) => {
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

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ProjectDetailClient = ({ project, photographers, stats }: ProjectDetailClientProps) => {
  const router = useRouter();

  // Edit project state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.ten_du_an);
  const [editDate, setEditDate] = useState<Date | null>(new Date(project.ngay_chup));
  const [editPhone, setEditPhone] = useState(project.khach_hang?.so_dien_thoai || "");
  const [editCustName, setEditCustName] = useState(project.khach_hang?.ho_va_ten || "");
  const [editPassword, setEditPassword] = useState(project.mat_khau || "");
  const [editStatus, setEditStatus] = useState(project.trang_thai);
  const [editNote, setEditNote] = useState(project.ghi_chu);
  const [editPhotographers, setEditPhotographers] = useState<string[]>(
    project.su_phan_cong.map((p) => p.ma_nguoi_dung)
  );
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Album modals state
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [selectedAlbumToConfig, setSelectedAlbumToConfig] = useState<AlbumSummary | null>(null);
  const [configAlbumName, setConfigAlbumName] = useState("");
  const [configAlbumType, setConfigAlbumType] = useState("");
  const [configAlbumDownload, setConfigAlbumDownload] = useState(false);
  const [isSavingAlbumConfig, setIsSavingAlbumConfig] = useState(false);
  const [confirmDeleteAlbum, setConfirmDeleteAlbum] = useState<AlbumSummary | null>(null);

  // Copy Project Link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/projects/${project.ma_du_an}`;
    navigator.clipboard.writeText(link);
    toastNotify.success("Thành công", "Đã copy link dự án chia sẻ cho khách.");
  };

  // Save project details
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProject) return;

    if (!editName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập tên dự án.");
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 10) {
      toastNotify.error("Lỗi", "Vui lòng nhập số điện thoại khách hàng hợp lệ.");
      return;
    }
    if (!editCustName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập tên khách hàng.");
      return;
    }
    if (editPhotographers.length === 0) {
      toastNotify.error("Lỗi", "Vui lòng chọn ít nhất một thợ ảnh.");
      return;
    }

    setIsSavingProject(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_du_an: project.ma_du_an,
          ten_du_an: editName,
          ngay_chup: editDate ? editDate.toISOString() : undefined,
          telPhone: editPhone,
          nameCustomer: editCustName,
          photographerIds: editPhotographers,
          mat_khau: editPassword,
          trang_thai: editStatus,
          ghi_chu: editNote,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật thông tin dự án thành công.");
        setIsEditing(false);
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật dự án.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setIsSavingProject(false);
    }
  };

  // Open album configuration
  const handleOpenConfig = (album: AlbumSummary) => {
    setSelectedAlbumToConfig(album);
    setConfigAlbumName(album.ten_alb);
    setConfigAlbumType(album.loai_alb);
    setConfigAlbumDownload(album.quyen_download);
  };

  // Save album configuration
  const handleSaveAlbumConfig = async () => {
    if (!selectedAlbumToConfig || isSavingAlbumConfig) return;
    if (!configAlbumName.trim()) {
      toastNotify.error("Lỗi", "Tên album không được để trống.");
      return;
    }

    setIsSavingAlbumConfig(true);
    try {
      const res = await fetch("/api/admin/albums", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_album: selectedAlbumToConfig.ma_album,
          ten_album: configAlbumName,
          loai_album: configAlbumType,
          quyen_download: configAlbumDownload,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật album thành công.");
        setSelectedAlbumToConfig(null);
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật album.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Có lỗi xảy ra khi cập nhật album.");
    } finally {
      setIsSavingAlbumConfig(false);
    }
  };

  // Delete album confirm trigger
  const handleDeleteAlbum = (album: AlbumSummary) => {
    setConfirmDeleteAlbum(album);
  };

  const handleConfirmDeleteAlbum = async () => {
    if (!confirmDeleteAlbum) return;
    const targetAlbum = confirmDeleteAlbum;
    setConfirmDeleteAlbum(null);

    try {
      const res = await fetch(`/api/admin/albums?id=${targetAlbum.ma_album}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã xóa album thành công.");
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể xóa album.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Có lỗi xảy ra khi gửi yêu cầu xóa.");
    }
  };

  // Status mapping
  const currentStatusLabel = STATUS_OPTIONS.find((s) => s.name === project.trang_thai)?.value || "Mới";
  const photographersText = project.su_phan_cong.map((p) => p.ho_va_ten).join(", ");

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb & Link actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[13.5px] font-semibold cursor-pointer"
        >
          <FaArrowLeft size={12} />
          Quay lại
        </button>
        
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={handleCopyLink}
            className="min-h-[38px] px-4 rounded-[11px] text-[13px] border-white/5 hover:border-emerald-500/20 text-slate-200 flex items-center gap-1.5"
          >
            <FaCopy size={11} />
            Copy link khách hàng
          </Button>
          <a 
            href={`/projects/${project.ma_du_an}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="min-h-[38px] px-4 rounded-[11px] text-[13px] border border-[#10b981]/20 bg-[#10b981]/5 text-[#34d399] hover:bg-[#10b981]/15 transition-all flex items-center gap-1.5 font-bold"
          >
            <FaExternalLinkAlt size={10} />
            Xem trang khách hàng
          </a>
        </div>
      </div>

      {/* Main detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column (2/3 width) - Project Info and Albums list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Project Details Panel */}
          <Panel
            kicker="QUẢN LÝ DỰ ÁN"
            title={isEditing ? "Chỉnh sửa dự án" : project.ten_du_an}
            description={isEditing ? "Cập nhật các thông tin cơ bản và thợ ảnh của dự án." : "Thông tin chi tiết dự án ảnh chụp."}
            textButton={isEditing ? undefined : "Chỉnh sửa"}
            onClick={isEditing ? undefined : () => setIsEditing(true)}
          >
            {isEditing ? (
              <form onSubmit={handleSaveProject} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tên dự án"
                    placeholder="Nhập tên dự án"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <DatePickerInput
                    label="Ngày chụp"
                    name="ngay_chup"
                    placeholder="Chọn ngày chụp"
                    defaultValue={editDate || undefined}
                    onChange={setEditDate}
                  />
                  <Input
                    label="Số điện thoại khách hàng"
                    placeholder="Nhập số điện thoại"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Tên khách hàng"
                    placeholder="Nhập tên khách"
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    required
                  />
                  <Input
                    label="Mật khẩu truy cập dự án"
                    placeholder="Nhập mật khẩu (tùy chọn)"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                  />
                  <SelectCustom
                    label="Trạng thái dự án"
                    name="editStatus"
                    values={STATUS_OPTIONS}
                    value={editStatus}
                    onChange={setEditStatus}
                  />
                </div>
                
                <MultiSelectCustom
                  label="Thợ ảnh phụ trách"
                  name="editPhotographers"
                  values={photographers}
                  value={editPhotographers}
                  onChange={setEditPhotographers}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#d1d5db] text-[13px] font-semibold">Ghi chú</label>
                  <textarea
                    placeholder="Nhập ghi chú cho thợ ảnh..."
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="h-[80px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px] outline-none focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                    className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSavingProject}
                    className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-[#10b981] text-white"
                  >
                    {isSavingProject ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-[14px]">
                <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                  <FaUser className="text-emerald-500 w-4" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Khách hàng</span>
                    <strong className="text-white font-bold">{project.khach_hang?.ho_va_ten || "Chưa thiết lập"}</strong>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                  <FaPhone className="text-emerald-500 w-4" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Số điện thoại</span>
                    <strong className="text-white font-bold">{project.khach_hang?.so_dien_thoai || "Chưa thiết lập"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                  <FaCalendarAlt className="text-emerald-500 w-4" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Ngày chụp</span>
                    <strong className="text-white font-bold">{formatDate(project.ngay_chup)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                  <FaLock className="text-emerald-500 w-4" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Mật khẩu truy cập</span>
                    <strong className="text-white font-bold">{project.mat_khau || "Không cài đặt (Công khai)"}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] md:col-span-2">
                  <FaUser className="text-emerald-500 w-4" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Thợ ảnh phụ trách</span>
                    <strong className="text-white font-bold">{photographersText || "Chưa phân công"}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] md:col-span-2">
                  <FaFileAlt className="text-emerald-500 w-4 mt-0.5" />
                  <div>
                    <span className="text-[11.5px] text-slate-400 block">Ghi chú dự án</span>
                    <p className="text-slate-200 mt-1 leading-relaxed">{project.ghi_chu || "Không có ghi chú nào."}</p>
                  </div>
                </div>
              </div>
            )}
          </Panel>

          {/* Albums list inside the project */}
          <Panel
            kicker="ALBUM"
            title="Danh sách album của dự án"
            description="Các thư mục ảnh riêng biệt được chia sẻ cho khách."
            textButton="Tạo album"
            onClick={() => setIsCreateAlbumOpen(true)}
          >
            <div className="flex flex-col gap-3 mt-2">
              {project.albums.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-[13.5px] border border-dashed border-white/10 rounded-[18px]">
                  Dự án này chưa có album nào. Vui lòng bấm "Tạo album" để thêm.
                </div>
              ) : (
                project.albums.map((album) => (
                  <div
                    key={album.ma_album}
                    className="p-4 border border-white/5 rounded-[18px] bg-white/[0.015] flex items-center justify-between flex-wrap gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <strong className="text-white text-[15px] font-bold">{album.ten_alb}</strong>
                        <span className="text-[9.5px] bg-[#10b981]/15 text-[#34d399] py-0.5 px-2 rounded-full uppercase font-bold tracking-wider">
                          {mapLoaiAlb(album.loai_alb)}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-slate-400 mt-1 font-medium">
                        {album.photoCount} ảnh · Tải về:{" "}
                        <span className={album.quyen_download ? "text-emerald-400" : "text-slate-500"}>
                          {album.quyen_download ? "Cho phép" : "Tắt"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="sm"
                        href={`/admin/photos?ma_album=${album.ma_album}`}
                        className="min-h-[30px] rounded-[8px]"
                      >
                        Xem ảnh
                      </Button>
                      <button
                        onClick={() => handleOpenConfig(album)}
                        className="p-1.5 text-slate-400 hover:text-[#10b981] hover:bg-white/5 rounded-[6px] transition-colors cursor-pointer"
                        title="Cấu hình"
                      >
                        <FaCog size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-[6px] transition-colors cursor-pointer"
                        title="Xóa album"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        {/* Right column (1/3 width) - Project Statistics & Client sharing link */}
        <div className="flex flex-col gap-6">
          {/* Quick Stats Panel */}
          <Panel kicker="SỐ LIỆU" title="Thống kê dự án">
            <div className="flex flex-col gap-3 mt-1.5">
              <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FaImages className="text-emerald-400 w-4" />
                  <span className="text-[13.5px] text-slate-300">Tổng số ảnh</span>
                </div>
                <strong className="text-[18px] text-white font-extrabold">{stats.totalPhotos}</strong>
              </div>

              <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FaCommentDots className="text-emerald-400 w-4" />
                  <span className="text-[13.5px] text-slate-300">Tổng phản hồi</span>
                </div>
                <strong className="text-[18px] text-white font-extrabold">{stats.totalFeedback}</strong>
              </div>

              <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FaCommentDots className="text-amber-400 w-4" />
                  <span className="text-[13.5px] text-slate-300">Phản hồi chưa sửa</span>
                </div>
                <strong className="text-[18px] text-amber-400 font-extrabold">{stats.pendingFeedback}</strong>
              </div>
            </div>
          </Panel>

          {/* Project Status Panel */}
          <Panel kicker="TIẾN ĐỘ" title="Trạng thái hiện tại">
            <div className="flex flex-col gap-4 mt-2 items-center text-center p-3">
              <span className="text-[13px] text-slate-400 block font-medium">TIẾN ĐỘ DỰ ÁN</span>
              <strong className="text-[20px] text-white tracking-tight uppercase font-extrabold">
                {currentStatusLabel}
              </strong>
              
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-[#10b981] h-full rounded-full transition-all duration-500"
                  style={{
                    width: project.trang_thai === "HOAN_THANH" ? "100%" :
                           project.trang_thai === "DANG_SUA" ? "75%" :
                           project.trang_thai === "DANG_CHON" ? "50%" : "25%"
                  }}
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* CREATE ALBUM MODAL */}
      {isCreateAlbumOpen && (
        <Modal
          title="Tạo album mới"
          onClose={() => setIsCreateAlbumOpen(false)}
        >
          <FormCreateAlb
            projects={[{ value: project.ten_du_an, name: project.ma_du_an }]}
            defaultProjectId={project.ma_du_an}
            onSuccess={() => {
              setIsCreateAlbumOpen(false);
              router.refresh();
            }}
          />
        </Modal>
      )}

      {/* CONFIGURE ALBUM MODAL */}
      {selectedAlbumToConfig && (
        <Modal
          title="Cấu hình album"
          onClose={() => setSelectedAlbumToConfig(null)}
        >
          <div className="flex flex-col gap-4 p-1">
            <Input
              label="Tên album"
              value={configAlbumName}
              onChange={(e) => setConfigAlbumName(e.target.value)}
              required
            />

            <SelectCustom
              label="Loại album"
              name="configAlbumType"
              values={[
                { value: "Ảnh gốc", name: "ANH_GOC" },
                { value: "Hậu kỳ", name: "HAU_KY" },
                { value: "Final", name: "CUOI_CUNG" },
              ]}
              value={configAlbumType}
              onChange={setConfigAlbumType}
            />

            <div className="flex items-center justify-between p-3.5 border border-white/5 bg-white/[0.02] rounded-[16px] mt-2">
              <div>
                <span className="text-[13.5px] text-white font-bold block">Cho phép tải hình ảnh</span>
                <span className="text-[11.5px] text-slate-400 block mt-0.5">Khách hàng được quyền tải ảnh chất lượng gốc về máy.</span>
              </div>
              <input
                type="checkbox"
                checked={configAlbumDownload}
                onChange={(e) => setConfigAlbumDownload(e.target.checked)}
                className="w-[20px] h-[20px] accent-[#10b981] cursor-pointer rounded-[6px]"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                onClick={() => setSelectedAlbumToConfig(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSaveAlbumConfig}
                disabled={isSavingAlbumConfig}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-[#10b981] text-white"
              >
                {isSavingAlbumConfig ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {/* CUSTOM CONFIRM DELETE ALBUM MODAL */}
      {confirmDeleteAlbum && (
        <Modal
          title="Xác nhận xóa album"
          kicker="CẢNH BÁO"
          onClose={() => setConfirmDeleteAlbum(null)}
          widthClass="w-[min(440px,100%)]"
        >
          <div className="flex flex-col gap-4 text-[14px] p-1">
            <p className="text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa album <strong className="text-white">"{confirmDeleteAlbum.ten_alb}"</strong>?
            </p>
            <p className="text-red-400/90 text-[12px] leading-relaxed">
              * Hành động này không thể hoàn tác. Mọi hình ảnh và nhận xét trong album này cũng sẽ bị xóa vĩnh viễn khỏi Cloudinary và hệ thống.
            </p>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmDeleteAlbum(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDeleteAlbum}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700"
              >
                Đồng ý xóa
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetailClient;
