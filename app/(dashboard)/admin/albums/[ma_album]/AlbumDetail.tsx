"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import Checkbox from "@/components/Checkbox";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";
import Panel from "@/app/(dashboard)/components/Panel";
import PhotoCard, {
  PhotoType,
  mapLoaiAlb,
} from "@/app/(dashboard)/admin/photos/components/PhotoCard";
import PhotoDetailsModal from "@/app/(dashboard)/admin/photos/components/PhotoDetailsModal";
import PhotoLightbox from "@/app/(dashboard)/admin/photos/components/PhotoLightbox";
import {
  FaChevronLeft,
  FaImages,
  FaCommentAlt,
  FaRegClock,
} from "react-icons/fa";

type AlbumDetailType = {
  ma_album: string;
  ten_alb: string;
  loai_alb: "ANH_GOC" | "HAU_KY" | "CUOI_CUNG";
  quyen_download: boolean;
  ngay_tao: string;
  du_an: {
    ma_du_an: string;
    ten_du_an: string;
    mat_khau: string;
    trang_thai: string;
  };
  hinh_anh: PhotoType[];
};

type AlbumDetailProps = {
  album: AlbumDetailType;
  stats: {
    totalPhotos: number;
    totalFeedback: number;
    pendingFeedback: number;
  };
};

const typeAlbOptions = [
  { value: "Ảnh gốc", name: "ANH_GOC" },
  { value: "Hậu kỳ", name: "HAU_KY" },
  { value: "Final", name: "CUOI_CUNG" },
];

const AlbumDetail = ({ album, stats: initialStats }: AlbumDetailProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<PhotoType[]>(album.hinh_anh);
  const [activeTab, setActiveTab] = useState<
    "all" | "visible" | "hidden" | "blurred" | "favorites"
  >("all");

  const [isUploading, setIsUploading] = useState(false);
  const [runningAIPhotoId, setRunningAIPhotoId] = useState<string | null>(null);

  // Detail Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType | null>(null);
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<
    string | null
  >(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Edit album modal state
  const [isEditAlbOpen, setIsEditAlbOpen] = useState(false);
  const [editAlbName, setEditAlbName] = useState(album.ten_alb);
  const [editAlbType, setEditAlbType] = useState<
    "ANH_GOC" | "HAU_KY" | "CUOI_CUNG"
  >(album.loai_alb);
  const [editAlbDownload, setEditAlbDownload] = useState(album.quyen_download);
  const [isSavingAlb, setIsSavingAlb] = useState(false);

  // Sync state if album photos change
  useEffect(() => {
    setPhotos(album.hinh_anh);
  }, [album.hinh_anh]);

  // Recalculate stats dynamically based on local photos state
  const stats = useMemo(() => {
    const totalPhotos = photos.length;
    const totalFeedback = photos.reduce(
      (acc, p) => acc + (p.phan_hoi?.length || 0),
      0,
    );
    const pendingFeedback = photos.reduce(
      (acc, p) => acc + (p.phan_hoi?.length || 0),
      0,
    );
    return {
      totalPhotos,
      totalFeedback,
      pendingFeedback,
    };
  }, [photos]);

  // Filtered photos based on tab state
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

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
  }, [photos, activeTab]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("ma_album", album.ma_album);
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
        const data = await res.json();
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể cập nhật trạng thái ảnh.",
        );
        router.refresh();
      } else {
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
        router.refresh();
        toastNotify.error("Thất bại", "Không thể cập nhật lượt yêu thích.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
              return { ...p, phan_hoi: [...(p.phan_hoi || []), newFb] };
            }
            return p;
          }),
        );

        setSelectedPhoto((prev) => {
          if (prev && prev.ma_hinh_anh === photoId) {
            return {
              ...prev,
              phan_hoi: [...(prev.phan_hoi || []), newFb],
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
                phan_hoi: (p.phan_hoi || []).filter((fb) => fb.ma_phan_hoi !== feedbackId),
              };
            }
            return p;
          }),
        );

        setSelectedPhoto((prev) => {
          if (prev && prev.ma_hinh_anh === photoId) {
            return {
              ...prev,
              phan_hoi: (prev.phan_hoi || []).filter((fb) => fb.ma_phan_hoi !== feedbackId),
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
                phan_hoi: (p.phan_hoi || []).map((fb) =>
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
              phan_hoi: (prev.phan_hoi || []).map((fb) =>
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

  const formattedAlbumType = mapLoaiAlb(album.loai_alb);
  const displayName = `${formattedAlbumType} - ${album.ten_alb}`;

  const handleOpenEditAlb = () => {
    setEditAlbName(album.ten_alb);
    setEditAlbType(album.loai_alb);
    setEditAlbDownload(album.quyen_download);
    setIsEditAlbOpen(true);
  };

  const handleSaveEditAlb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingAlb) return;

    if (!editAlbName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập tên album.");
      return;
    }

    setIsSavingAlb(true);
    try {
      const res = await fetch("/api/admin/albums", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_album: album.ma_album,
          ten_album: editAlbName.trim(),
          loai_album: editAlbType,
          quyen_download: editAlbDownload,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật album thành công!");
        setIsEditAlbOpen(false);
        router.refresh();
      } else {
        toastNotify.error(
          "Thất bại",
          data.message || "Không thể cập nhật album.",
        );
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    } finally {
      setIsSavingAlb(false);
    }
  };

  return (
    <Panel
      kicker="QUẢN LÝ ALBUM"
      title={displayName}
      description={`Dự án: ${album.du_an.ten_du_an}`}
      textButton="Upload ảnh lên Album"
      variant="primary"
      onClick={handleUploadClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[13px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
        >
          <FaChevronLeft size={10} /> Quay lại
        </button>
        <Button variant="sm" onClick={handleOpenEditAlb}>
          Sửa album
        </Button>
      </div>

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

      {/* Album Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-6">
        <div className="border border-[var(--line)] rounded-[20px] bg-white/[0.02] p-5 flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-[#10b981]/10 flex items-center justify-center text-emerald-400">
            <FaImages size={20} />
          </div>
          <div>
            <span className="block text-[12px] text-[var(--muted)] font-semibold uppercase tracking-wider">
              Tổng số ảnh
            </span>
            <strong className="text-[20px] text-white font-bold">
              {stats.totalPhotos}
            </strong>
          </div>
        </div>

        <div className="border border-[var(--line)] rounded-[20px] bg-white/[0.02] p-5 flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FaCommentAlt size={18} />
          </div>
          <div>
            <span className="block text-[12px] text-[var(--muted)] font-semibold uppercase tracking-wider font-semibold">
              Tổng phản hồi
            </span>
            <strong className="text-[20px] text-white font-bold">
              {stats.totalFeedback}
            </strong>
          </div>
        </div>

        <div className="border border-[var(--line)] rounded-[20px] bg-white/[0.02] p-5 flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-amber-500/10 flex items-center justify-center text-amber-400">
            <FaRegClock size={19} />
          </div>
          <div>
            <span className="block text-[12px] text-[var(--muted)] font-semibold uppercase tracking-wider font-medium">
              Download
            </span>
            <strong className="text-[18px] text-white font-bold uppercase">
              {album.quyen_download ? "BẬT" : "TẮT"}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 pb-4 border-b border-[var(--line)] mb-6">
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
              * Hành động này không thể hoàn tác. Ảnh sẽ bị xóa vĩnh viễn trên
              Cloudinary và cơ sở dữ liệu.
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

      {/* EDIT ALBUM MODAL */}
      {isEditAlbOpen && (
        <Modal
          title="Cập nhật Album"
          kicker="ALBUM"
          onClose={() => setIsEditAlbOpen(false)}
          widthClass="w-[min(520px,100%)]"
        >
          <form
            onSubmit={handleSaveEditAlb}
            className="flex flex-col gap-[16px]"
          >
            <Input
              label="Tên Album"
              name="albumName"
              value={editAlbName}
              onChange={(e) => setEditAlbName(e.target.value)}
              placeholder="Nhập tên album..."
              required
            />

            <SelectCustom
              label="Loại Album"
              name="typeOfAlbum"
              values={typeAlbOptions}
              value={editAlbType}
              onChange={(val) => setEditAlbType(val as any)}
            />

            <Checkbox
              topLabel="Quyền hạn"
              label="Cho phép khách hàng download album"
              name="allowDownload"
              checked={editAlbDownload}
              onChange={(e) => setEditAlbDownload(e.target.checked)}
            />

            <div className="flex justify-end gap-[12px] mt-2 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditAlbOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary" disabled={isSavingAlb}>
                {isSavingAlb ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Panel>
  );
};

export default AlbumDetail;
