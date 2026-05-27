"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { toastNotify } from "@/components/Toast";

import ProjectTopActions from "./ProjectTopActions";
import ProjectInfoPanel from "./ProjectInfoPanel";
import ProjectEditForm from "./ProjectEditForm";
import ProjectAlbumsPanel from "./ProjectAlbumsPanel";
import ProjectStatsPanel from "./ProjectStatsPanel";
import ProjectStatusPanel from "./ProjectStatusPanel";

import CreateAlbumModal from "./CreateAlbumModal";
import AlbumConfigModal from "./AlbumConfigModal";
import DeleteAlbumModal from "./DeleteAlbumModal";

import { AlbumSummary, ProjectStats, ProjectSummary } from "./types";

type ProjectDetailClientProps = {
  project: ProjectSummary;
  photographers: { name: string; value: string }[];
  stats: ProjectStats;
  role?: "admin" | "photographer"
};

const ProjectDetailClient = ({
  project,
  photographers,
  stats,
  role = "admin"
}: ProjectDetailClientProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(project.ten_du_an);
  const [editDate, setEditDate] = useState<Date | null>(
    new Date(project.ngay_chup)
  );
  const [editPhone, setEditPhone] = useState(
    project.khach_hang?.so_dien_thoai || ""
  );
  const [editCustName, setEditCustName] = useState(
    project.khach_hang?.ho_va_ten || ""
  );
  const [editPassword, setEditPassword] = useState(project.mat_khau || "");
  const [editStatus, setEditStatus] = useState(project.trang_thai);
  const [editNote, setEditNote] = useState(project.ghi_chu);
  const [editPhotographers, setEditPhotographers] = useState<string[]>(
    project.su_phan_cong.map((p) => p.ma_nguoi_dung)
  );
  const [isSavingProject, setIsSavingProject] = useState(false);

  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);

  const [selectedAlbumToConfig, setSelectedAlbumToConfig] =
    useState<AlbumSummary | null>(null);
  const [configAlbumName, setConfigAlbumName] = useState("");
  const [configAlbumType, setConfigAlbumType] = useState("");
  const [configAlbumDownload, setConfigAlbumDownload] = useState(false);
  const [isSavingAlbumConfig, setIsSavingAlbumConfig] = useState(false);

  const [confirmDeleteAlbum, setConfirmDeleteAlbum] =
    useState<AlbumSummary | null>(null);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/projects/${project.ma_du_an}`;

    navigator.clipboard.writeText(link);

    toastNotify.success(
      "Thành công",
      "Đã copy link dự án chia sẻ cho khách."
    );
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSavingProject) return;

    if (!editName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập tên dự án.");
      return;
    }

    if (!editPhone.trim() || editPhone.trim().length < 10) {
      toastNotify.error(
        "Lỗi",
        "Vui lòng nhập số điện thoại khách hàng hợp lệ."
      );
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
        headers: {
          "Content-Type": "application/json",
        },
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
        toastNotify.success(
          "Thành công",
          "Cập nhật thông tin dự án thành công."
        );

        setIsEditing(false);
        router.refresh();
      } else {
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể cập nhật dự án."
        );
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleOpenConfigAlbum = (album: AlbumSummary) => {
    setSelectedAlbumToConfig(album);
    setConfigAlbumName(album.ten_alb);
    setConfigAlbumType(album.loai_alb);
    setConfigAlbumDownload(album.quyen_download);
  };

  const handleCloseConfigAlbum = () => {
    setSelectedAlbumToConfig(null);
    setConfigAlbumName("");
    setConfigAlbumType("");
    setConfigAlbumDownload(false);
  };

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
        headers: {
          "Content-Type": "application/json",
        },
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

        handleCloseConfigAlbum();
        router.refresh();
      } else {
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể cập nhật album."
        );
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Có lỗi xảy ra khi cập nhật album.");
    } finally {
      setIsSavingAlbumConfig(false);
    }
  };

  const handleOpenDeleteAlbum = (album: AlbumSummary) => {
    setConfirmDeleteAlbum(album);
  };

  const handleCloseDeleteAlbum = () => {
    setConfirmDeleteAlbum(null);
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
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể xóa album."
        );
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Có lỗi xảy ra khi gửi yêu cầu xóa.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProjectTopActions
        onBack={() => router.back()}
        onCopyLink={handleCopyLink}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProjectInfoPanel
            project={project}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
          >
            <ProjectEditForm
              editName={editName}
              setEditName={setEditName}
              editDate={editDate}
              setEditDate={setEditDate}
              editPhone={editPhone}
              setEditPhone={setEditPhone}
              editCustName={editCustName}
              setEditCustName={setEditCustName}
              editPassword={editPassword}
              setEditPassword={setEditPassword}
              editStatus={editStatus}
              setEditStatus={setEditStatus}
              editNote={editNote}
              setEditNote={setEditNote}
              editPhotographers={editPhotographers}
              setEditPhotographers={setEditPhotographers}
              photographers={photographers}
              isSavingProject={isSavingProject}
              onCancel={() => setIsEditing(false)}
              onSubmit={handleSaveProject}
            />
          </ProjectInfoPanel>

          <ProjectAlbumsPanel
            albums={project.albums}
            onCreateAlbum={() => setIsCreateAlbumOpen(true)}
            onOpenConfig={handleOpenConfigAlbum}
            onDeleteAlbum={handleOpenDeleteAlbum}
            role={role}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProjectStatsPanel stats={stats} />

          <ProjectStatusPanel status={project.trang_thai} />
        </div>
      </div>

      {isCreateAlbumOpen && (
        <CreateAlbumModal
          projectId={project.ma_du_an}
          projectName={project.ten_du_an}
          onClose={() => setIsCreateAlbumOpen(false)}
          onSuccess={() => {
            setIsCreateAlbumOpen(false);
            router.refresh();
          }}
        />
      )}

      {selectedAlbumToConfig && (
        <AlbumConfigModal
          album={selectedAlbumToConfig}
          albumName={configAlbumName}
          albumType={configAlbumType}
          albumDownload={configAlbumDownload}
          isSaving={isSavingAlbumConfig}
          onChangeAlbumName={setConfigAlbumName}
          onChangeAlbumType={setConfigAlbumType}
          onChangeAlbumDownload={setConfigAlbumDownload}
          onClose={handleCloseConfigAlbum}
          onSave={handleSaveAlbumConfig}
        />
      )}

      {confirmDeleteAlbum && (
        <DeleteAlbumModal
          album={confirmDeleteAlbum}
          onClose={handleCloseDeleteAlbum}
          onConfirm={handleConfirmDeleteAlbum}
        />
      )}
    </div>
  );
};

export default ProjectDetailClient;