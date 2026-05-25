"use client";

import React, { useState, useMemo, useRef } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";
import SelectCustom from "@/components/SelectCustom";
import FormCreateProjects from "@/app/(dashboard)/admin/projects/components/FormCreateProjects";
import FormCreateAlb from "@/app/(dashboard)/admin/albums/components/FormCreateAlb";
import Panel from "@/app/(dashboard)/components/Panel";
import PhotoCard, { PhotoType, getFileName, mapLoaiAlb } from "./PhotoCard";
import PhotoDetailsModal from "./PhotoDetailsModal";
import PhotoLightbox from "./PhotoLightbox";

type ProjectOption = {
  ma_du_an: string;
  ten_du_an: string;
};

type AlbumOption = {
  ma_album: string;
  ten_alb: string;
  ma_du_an: string;
  loai_alb: string;
};

type PhotosClientProps = {
  initialPhotos: PhotoType[];
  projects: ProjectOption[];
  albums: AlbumOption[];
};

const PhotosClient = ({
  initialPhotos,
  projects,
  albums,
}: PhotosClientProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoType[]>(initialPhotos);

  // Dynamic list states to support adding items on the fly
  const [projectList, setProjectList] = useState<ProjectOption[]>(projects);
  const [albumList, setAlbumList] = useState<AlbumOption[]>(albums);

  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "all" | "visible" | "hidden" | "blurred" | "favorites"
  >("all");

  // Upload and loading states
  const [isUploading, setIsUploading] = useState(false);
  const [runningAIPhotoId, setRunningAIPhotoId] = useState<string | null>(null);

  // Creation modal states
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);

  // Detail Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType | null>(null);
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<string | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered albums based on selected project
  const filteredAlbums = useMemo(() => {
    if (selectedProject === "all") return albumList;
    return albumList.filter((a) => a.ma_du_an === selectedProject);
  }, [selectedProject, albumList]);

  const projectSelectOptions = useMemo(
    () => [
      { name: "all", value: "-- Tất cả Dự án --" },
      ...projectList.map((p) => ({ name: p.ma_du_an, value: p.ten_du_an })),
    ],
    [projectList],
  );

  const albumSelectOptions = useMemo(
    () => [
      { name: "all", value: "-- Tất cả Album --" },
      ...filteredAlbums.map((a) => ({
        name: a.ma_album,
        value: `${a.ten_alb} (${mapLoaiAlb(a.loai_alb)})`,
      })),
    ],
    [filteredAlbums],
  );

  // Handle case where selected album is no longer valid for the selected project
  const handleProjectChange = (val: string) => {
    setSelectedProject(val);
    setSelectedAlbum("all"); // Reset album selection when project changes
  };

  const handleProjectCreated = (newProj: {
    ma_du_an: string;
    ten_du_an: string;
  }) => {
    setProjectList((prev) => [...prev, newProj]);
    setSelectedProject(newProj.ma_du_an);
    setSelectedAlbum("all");
    setIsCreateProjectOpen(false);
    toastNotify.success(
      "Tạo dự án thành công",
      `Đã chọn dự án mới: ${newProj.ten_du_an}`,
    );
  };

  const handleAlbumCreated = (newAlb: {
    ma_album: string;
    ten_alb: string;
    ma_du_an: string;
    loai_alb: string;
  }) => {
    setAlbumList((prev) => [...prev, newAlb]);
    setSelectedProject(newAlb.ma_du_an);
    setSelectedAlbum(newAlb.ma_album);
    setIsCreateAlbumOpen(false);
    toastNotify.success(
      "Tạo album thành công",
      `Đã chọn album mới: ${newAlb.ten_alb}`,
    );
  };

  // Filtered photos based on project, album, and tab state
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    // Filter by project
    if (selectedProject !== "all") {
      result = result.filter(
        (p) =>
          p.album.du_an.ten_du_an ===
          projectList.find((pr) => pr.ma_du_an === selectedProject)?.ten_du_an,
      );
    }

    // Filter by album
    if (selectedAlbum !== "all") {
      result = result.filter((p) => p.ma_album === selectedAlbum);
    }

    // Filter by Tab
    if (activeTab === "visible") {
      result = result.filter((p) => !p.bi_mo);
    } else if (activeTab === "hidden") {
      result = result.filter((p) => p.bi_mo);
    } else if (activeTab === "blurred") {
      result = result.filter((p) => p.bi_mo);
    } else if (activeTab === "favorites") {
      result = result.filter((p) => p.yeu_thich);
    }

    return result;
  }, [photos, selectedProject, selectedAlbum, activeTab, projectList]);

  // Handle photo upload
  const handleUploadClick = () => {
    if (selectedAlbum === "all") {
      toastNotify.error("Lỗi", "Vui lòng chọn một Album cụ thể để tải ảnh lên");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("ma_album", selectedAlbum);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success(
          "Thành công",
          data.message || "Tải ảnh lên thành công!",
        );

        // Fetch fresh list of photos
        const freshRes = await fetch("/api/admin/photos");
        if (freshRes.ok) {
          const freshPhotos = await freshRes.json();
          setPhotos(freshPhotos);
        }
        router.refresh();
      } else {
        toastNotify.error(
          "Thất bại",
          data.message || "Có lỗi xảy ra khi tải ảnh lên.",
        );
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Không thể gửi dữ liệu lên máy chủ.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Toggle bi_mo status
  const handleToggleStatus = async (photo: PhotoType, type: "bi_mo") => {
    const nextValue = !photo.bi_mo;

    // Optimistic UI update
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.ma_hinh_anh === photo.ma_hinh_anh) {
          return {
            ...p,
            bi_mo: nextValue,
          };
        }
        return p;
      }),
    );

    try {
      const payload = { ma_hinh_anh: photo.ma_hinh_anh, bi_mo: nextValue };

      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Rollback on error
        const data = await res.json();
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể cập nhật trạng thái ảnh.",
        );
        setPhotos(initialPhotos);
      } else {
        // Refresh selectedPhoto if it is open in detail view
        if (selectedPhoto && selectedPhoto.ma_hinh_anh === photo.ma_hinh_anh) {
          setSelectedPhoto((prev: any) => ({
            ...prev,
            bi_mo: nextValue,
          }));
        }
        toastNotify.success("Thành công", "Đã cập nhật trạng thái ảnh.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    }
  };

  // Run AI processing
  const handleRunAI = async (photoId: string) => {
    setRunningAIPhotoId(photoId);

    try {
      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_hinh_anh: photoId, run_ai: true }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("AI xử lý hoàn tất", data.message);

        // Update photos state
        setPhotos((prev) =>
          prev.map((p) =>
            p.ma_hinh_anh === photoId ? { ...p, bi_mo: data.photo.bi_mo } : p,
          ),
        );

        if (selectedPhoto && selectedPhoto.ma_hinh_anh === photoId) {
          setSelectedPhoto((prev: any) => ({
            ...prev,
            bi_mo: data.photo.bi_mo,
          }));
        }
      } else {
        toastNotify.error("Thất bại", data.message || "AI xử lý gặp lỗi.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối dịch vụ AI.");
    } finally {
      setRunningAIPhotoId(null);
    }
  };

  // Delete photo confirm trigger
  const handleDeletePhoto = (photoId: string) => {
    setConfirmDeletePhotoId(photoId);
  };

  const handleConfirmDeletePhoto = async () => {
    if (!confirmDeletePhotoId) return;
    const photoId = confirmDeletePhotoId;
    setConfirmDeletePhotoId(null);

    try {
      const res = await fetch(`/api/admin/photos?id=${photoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toastNotify.success("Thành công", "Đã xóa ảnh thành công.");
        setPhotos((prev) => prev.filter((p) => p.ma_hinh_anh !== photoId));
        if (selectedPhoto?.ma_hinh_anh === photoId) {
          setSelectedPhoto(null);
        }
        router.refresh();
      } else {
        const data = await res.json();
        toastNotify.error("Thất bại", data.message || "Không thể xóa ảnh.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ khi xóa.");
    }
  };

  // Heart/Likes toggle (Toggles yeu_thich boolean)
  const handleLikeToggle = async (photo: PhotoType) => {
    const nextValue = !photo.yeu_thich;

    // Optimistic UI update
    setPhotos((prev) =>
      prev.map((p) =>
        p.ma_hinh_anh === photo.ma_hinh_anh
          ? { ...p, yeu_thich: nextValue }
          : p,
      ),
    );
    if (selectedPhoto && selectedPhoto.ma_hinh_anh === photo.ma_hinh_anh) {
      setSelectedPhoto((prev: any) => ({ ...prev, yeu_thich: nextValue }));
    }

    try {
      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_hinh_anh: photo.ma_hinh_anh,
          yeu_thich: nextValue,
        }),
      });

      if (res.ok) {
        toastNotify.success(
          nextValue ? "Đã thích" : "Đã bỏ thích",
          nextValue
            ? "Đã yêu thích hình ảnh này!"
            : "Đã bỏ yêu thích hình ảnh này.",
        );
      } else {
        // Rollback
        setPhotos(photos);
        toastNotify.error("Thất bại", "Không thể cập nhật lượt yêu thích.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit comment
  // Submit comment
  const handleAddComment = async (
    photoId: string,
    commentText: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/photos/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_hinh_anh: photoId,
          phan_hoi: commentText,
          nguoi_binh_luan: "Quản trị viên",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Đã gửi phản hồi.");

        // Append new feedback locally
        const newFb = {
          ma_phan_hoi: data.feedback.ma_phan_hoi,
          phan_hoi: data.feedback.phan_hoi,
          nguoi_binh_luan: data.feedback.nguoi_binh_luan,
          ngay_tao: data.feedback.ngay_tao,
          toa_do_X: Number(data.feedback.toa_do_X) || 50,
          toa_do_Y: Number(data.feedback.toa_do_Y) || 50,
          phan_tram_chieu_rong: Number(data.feedback.phan_tram_chieu_rong) || 10,
          phan_tram_chieu_cao: Number(data.feedback.phan_tram_chieu_cao) || 10,
          ma_tho_anh: data.feedback.ma_tho_anh,
          trang_thai: data.feedback.trang_thai || "CHUA_XU_LY",
        };

        setPhotos((prev) =>
          prev.map((p) => {
            if (p.ma_hinh_anh === photoId) {
              return { ...p, phan_hoi: [...p.phan_hoi, newFb] };
            }
            return p;
          }),
        );

        setSelectedPhoto((prev) => {
          if (prev && prev.ma_hinh_anh === photoId) {
            return {
              ...prev,
              phan_hoi: [...prev.phan_hoi, newFb],
            };
          }
          return prev;
        });

        return true;
      } else {
        toastNotify.error("Thất bại", data.message || "Lỗi khi gửi phản hồi.");
        return false;
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể gửi phản hồi.");
      return false;
    }
  };

  const handleDeleteComment = async (
    photoId: string,
    feedbackId: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/feedbacks?id=${feedbackId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toastNotify.success("Thành công", "Đã xóa phản hồi.");

        setPhotos((prev) =>
          prev.map((p) => {
            if (p.ma_hinh_anh === photoId) {
              return {
                ...p,
                phan_hoi: p.phan_hoi.filter((fb) => fb.ma_phan_hoi !== feedbackId),
              };
            }
            return p;
          }),
        );

        setSelectedPhoto((prev) => {
          if (prev && prev.ma_hinh_anh === photoId) {
            return {
              ...prev,
              phan_hoi: prev.phan_hoi.filter((fb) => fb.ma_phan_hoi !== feedbackId),
            };
          }
          return prev;
        });

        return true;
      } else {
        const data = await res.json();
        toastNotify.error("Thất bại", data.message || "Không thể xóa phản hồi.");
        return false;
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối máy chủ để xóa phản hồi.");
      return false;
    }
  };

  const handleEditComment = async (
    photoId: string,
    feedbackId: string,
    commentText: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_phan_hoi: feedbackId,
          phan_hoi: commentText,
        }),
      });

      if (res.ok) {
        toastNotify.success("Thành công", "Đã cập nhật phản hồi.");

        setPhotos((prev) =>
          prev.map((p) => {
            if (p.ma_hinh_anh === photoId) {
              return {
                ...p,
                phan_hoi: p.phan_hoi.map((fb) =>
                  fb.ma_phan_hoi === feedbackId ? { ...fb, phan_hoi: commentText } : fb,
                ),
              };
            }
            return p;
          }),
        );

        setSelectedPhoto((prev) => {
          if (prev && prev.ma_hinh_anh === photoId) {
            return {
              ...prev,
              phan_hoi: prev.phan_hoi.map((fb) =>
                fb.ma_phan_hoi === feedbackId ? { ...fb, phan_hoi: commentText } : fb,
              ),
            };
          }
          return prev;
        });

        return true;
      } else {
        const data = await res.json();
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật phản hồi.");
        return false;
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối máy chủ để cập nhật phản hồi.");
      return false;
    }
  };

  return (
    <Panel
      kicker="CLOUDINARY"
      title="Upload và quản lý ảnh"
      textButton="Upload ảnh"
      variant="primary"
      onClick={handleUploadClick}
    >
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Filter Row */}
      <div className="relative z-30 mb-[18px] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)] backdrop-blur-[16px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-end gap-6 flex-1">
            <div className="flex items-end gap-[10px] min-w-[260px] max-w-[320px] w-full">
              <div className="flex-grow">
                <SelectCustom
                  label="Dự án"
                  name="projectFilter"
                  values={projectSelectOptions}
                  value={selectedProject}
                  onChange={handleProjectChange}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="w-[48px] h-[48px] rounded-[15px] border border-[var(--line)] bg-[rgba(255,255,255,.04)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.12)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[20px]"
                title="Tạo dự án mới"
              >
                +
              </button>
            </div>

            <div className="flex items-end gap-[10px] min-w-[260px] max-w-[320px] w-full">
              <div className="flex-grow">
                <SelectCustom
                  label="Album"
                  name="albumFilter"
                  values={albumSelectOptions}
                  value={selectedAlbum}
                  onChange={(val) => setSelectedAlbum(val)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selectedProject === "all") {
                    toastNotify.error(
                      "Thông báo",
                      "Vui lòng chọn một Dự án cụ thể trước khi tạo Album",
                    );
                    return;
                  }
                  setIsCreateAlbumOpen(true);
                }}
                className="w-[48px] h-[48px] rounded-[15px] border border-[var(--line)] bg-[rgba(255,255,255,.04)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.12)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[20px]"
                title="Tạo album mới"
              >
                +
              </button>
            </div>
          </div>

          {selectedAlbum === "all" && (
            <div className="text-[13px] text-amber-400 font-medium flex items-center gap-1.5 py-2 px-4 bg-amber-500/10 border border-amber-500/20 rounded-[12px] h-[48px] self-end mb-[0px]">
              <span>▲</span> Vui lòng chọn một Album cụ thể để tải ảnh lên
            </div>
          )}
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 pb-4">
        {[
          { id: "all", label: "Tất cả" },
          { id: "visible", label: "Ảnh hiển thị" },
          { id: "hidden", label: "Ảnh bị ẩn" },
          { id: "blurred", label: "Ảnh mờ" },
          { id: "favorites", label: "Ảnh được yêu thích" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Grid of Photo Cards */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)] text-[14px] bg-[rgba(255,255,255,0.01)] rounded-[16px] border border-dashed border-white/10">
          Chưa có hình ảnh nào được tải lên hoặc không khớp bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <PhotoCard
              key={photo.ma_hinh_anh}
              photo={photo}
              onLikeToggle={handleLikeToggle}
              onToggleStatus={handleToggleStatus}
              onSelect={setSelectedPhoto}
              onImageClick={() => setLightboxIndex(idx)}
            />
          ))}
        </div>
      )}

      {/* Details & Feedback Modal */}
      <PhotoDetailsModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onLikeToggle={handleLikeToggle}
        onToggleStatus={handleToggleStatus}
        onRunAI={handleRunAI}
        onDelete={handleDeletePhoto}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        runningAIPhotoId={runningAIPhotoId}
      />

      {/* Lightbox */}
      <PhotoLightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        onLikeToggle={handleLikeToggle}
      />

      {/* Create Project Modal */}
      {isCreateProjectOpen && (
        <Modal
          onClose={() => setIsCreateProjectOpen(false)}
          title="Tạo dự án mới"
          kicker="DỰ ÁN"
        >
          <FormCreateProjects onSuccess={handleProjectCreated} />
        </Modal>
      )}

      {/* Create Album Modal */}
      {isCreateAlbumOpen && (
        <Modal
          onClose={() => setIsCreateAlbumOpen(false)}
          title="Tạo album mới"
          kicker="ALBUM"
        >
          <FormCreateAlb
            projects={projectList.map((p) => ({
              value: p.ten_du_an,
              name: p.ma_du_an,
            }))}
            onSuccess={handleAlbumCreated}
            defaultProjectId={selectedProject}
            hideProjectField={true}
          />
        </Modal>
      )}
      {/* CUSTOM CONFIRM DELETE PHOTO MODAL */}
      {confirmDeletePhotoId && (
        <Modal
          title="Xác nhận xóa ảnh"
          kicker="CẢNH BÁO"
          onClose={() => setConfirmDeletePhotoId(null)}
          widthClass="w-[min(440px,100%)]"
        >
          <div className="flex flex-col gap-4 text-[14px] p-1">
            <p className="text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa hình ảnh này khỏi hệ thống?
            </p>
            <p className="text-red-400/90 text-[12px] leading-relaxed">
              * Hành động này không thể hoàn tác. Ảnh sẽ bị xóa vĩnh viễn trên Cloudinary và cơ sở dữ liệu.
            </p>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmDeletePhotoId(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDeletePhoto}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700"
              >
                Đồng ý xóa
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Panel>
  );
};

export default PhotosClient;
