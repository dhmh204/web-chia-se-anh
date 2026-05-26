"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { toastNotify } from "@/components/Toast";
import { AlbumBanner } from "./AlbumBanner";
import { AlbumSearchBar } from "./AlbumSearchBar";
import { PeopleGrid, FaceGroup } from "./PeopleGrid";
import { PhotoCard, Photo, Feedback } from "./PhotoCard";
import { CustomerPhotoLightbox } from "./CustomerPhotoLightbox";

type AlbumDetailClientProps = {
  album: {
    ma_album: string;
    ten_alb: string;
    loai_alb: string;
    quyen_download: boolean;
    du_an: {
      ma_du_an: string;
      ten_du_an: string;
    };
    hinh_anh: Photo[];
    khuon_mat: FaceGroup[];
  };
  stats: {
    totalPhotos: number;
    totalFavorites: number;
    totalFeedback: number;
  };
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

const getPhotoStatus = (phan_hoi: Feedback[]) => {
  if (phan_hoi.length === 0) {
    return { label: "Mới", variant: "blue" };
  }
  const hasDangXuLy = phan_hoi.some((f) => f.trang_thai === "DANG_XU_LY");
  if (hasDangXuLy) {
    return { label: "Đang sửa", variant: "yellow" };
  }
  const allDaXuLy = phan_hoi.every((f) => f.trang_thai === "DA_XU_LY");
  if (allDaXuLy) {
    return { label: "Hoàn thành", variant: "green" };
  }
  return { label: "Chưa xử lý", variant: "grey" };
};

const AlbumDetailClient = ({ album, stats }: AlbumDetailClientProps) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "favorites" | "feedback" | "completed" | "people"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const [photos, setPhotos] = useState<Photo[]>(album.hinh_anh);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setPhotos(album.hinh_anh);
  }, [album.hinh_anh]);

  const currentFavoritesCount = photos.filter((p) => p.yeu_thich).length;

  const handleToggleFavorite = async (
    photoId: string,
    currentStatus: boolean,
    e?: React.MouseEvent,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setPhotos((prev) =>
      prev.map((p) =>
        p.ma_hinh_anh === photoId ? { ...p, yeu_thich: !currentStatus } : p,
      ),
    );

    try {
      const res = await fetch("/api/client/albums/favorite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_hinh_anh: photoId,
          yeu_thich: !currentStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
      toastNotify.success(
        "Thành công",
        !currentStatus
          ? "Đã thêm vào mục yêu thích"
          : "Đã xóa khỏi mục yêu thích",
      );
    } catch (err) {
      console.error(err);
      setPhotos((prev) =>
        prev.map((p) =>
          p.ma_hinh_anh === photoId ? { ...p, yeu_thich: currentStatus } : p,
        ),
      );
      toastNotify.error("Lỗi", "Không thể cập nhật lượt yêu thích.");
    }
  };



  const getFilteredPhotos = () => {
    let result = photos;

    if (activeTab === "favorites") {
      result = result.filter((p) => p.yeu_thich);
    } else if (activeTab === "feedback") {
      result = result.filter((p) => p.phan_hoi.length > 0);
    } else if (activeTab === "completed") {
      result = result.filter(
        (p) => getPhotoStatus(p.phan_hoi).label === "Hoàn thành",
      );
    } else if (activeTab === "people" && selectedPersonId) {
      const targetPerson = album.khuon_mat.find(
        (f) => f.ma_nhom === selectedPersonId,
      );
      if (targetPerson) {
        result = result.filter((p) =>
          targetPerson.photoIds.includes(p.ma_hinh_anh),
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        getFileName(p.url_anh).toLowerCase().includes(q),
      );
    }

    return result;
  };

  const filteredPhotos = getFilteredPhotos();

  const handleOpenLightbox = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.ma_hinh_anh === photoId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex !== null && filteredPhotos.length > 0) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
      );
    }
  };

  const handleNextPhoto = () => {
    if (lightboxIndex !== null && filteredPhotos.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const activeLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;




  return (
    <div className="min-h-screen  flex flex-col pb-20 relative overflow-hidden p-7">

      <AlbumBanner
        ten_alb={album.ten_alb}
        totalPhotos={stats.totalPhotos}
        totalFavorites={currentFavoritesCount}
        totalFeedback={stats.totalFeedback}
      />

      <main>
        <AlbumSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex gap-2.5 mb-4 flex-wrap">
          {[
            { id: "all", label: "Tất cả" },
            { id: "favorites", label: "Ảnh yêu thích" },
            { id: "feedback", label: "Có phản hồi" },
            { id: "completed", label: "Đã hoàn thành" },
            { id: "people", label: "Người" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedPersonId(null);
                }}
                className={` font-light cursor-pointer min-h-[38px] px-3.5 rounded-[9999px] text-[var(--muted)] bg-[rgba(255,255,255,.04)] border border-[var(--line)] ${isActive
                  ? "text-white border-[var(--line-green)] bg-[rgba(16,185,129,.14)]"
                  : ""
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "people" && !selectedPersonId && (
          <PeopleGrid
            faces={album.khuon_mat}
            onSelectPerson={setSelectedPersonId}
          />
        )}

        {activeTab === "people" && selectedPersonId && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--line)]/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPersonId(null)}
                className="w-9 h-9 rounded-xl bg-[#060a0d] border border-[var(--line)] flex items-center justify-center text-white hover:border-[var(--line-green)] hover:bg-white/[0.03] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-[12px] text-[var(--muted)] uppercase font-extrabold tracking-wider">
                  Phân loại theo khuôn mặt
                </p>
                <h3 className="text-[18px] font-black text-white">
                  Ảnh của:{" "}
                  {
                    album.khuon_mat.find((f) => f.ma_nhom === selectedPersonId)
                      ?.ten_nhan_vat
                  }
                </h3>
              </div>
            </div>
            <span className="text-[13px] text-[var(--muted)] font-semibold">
              {filteredPhotos.length} hình ảnh
            </span>
          </div>
        )}

        {(activeTab !== "people" || selectedPersonId) && (
          <div>
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-20 bg-[var(--surface-2)] border border-[var(--line)] rounded-[28px] p-8 max-w-xl mx-auto backdrop-blur-md">
                <FolderOpenIcon />
                <p className="text-[var(--text)] font-extrabold text-[16px] mt-3">
                  Không tìm thấy hình ảnh nào
                </p>
                <p className="text-[var(--muted)] text-[13px] mt-1">
                  Không có ảnh nào phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredPhotos.map((photo) => {
                  const filename = getFileName(photo.url_anh);
                  const status = getPhotoStatus(photo.phan_hoi);

                  return (
                    <PhotoCard
                      key={photo.ma_hinh_anh}
                      photo={photo}
                      filename={filename}
                      status={status}
                      onOpenLightbox={() =>
                        handleOpenLightbox(photo.ma_hinh_anh)
                      }
                      onToggleFavorite={(e) =>
                        handleToggleFavorite(
                          photo.ma_hinh_anh,
                          photo.yeu_thich,
                          e,
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {lightboxIndex !== null && (
        <CustomerPhotoLightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
          onLikeToggle={(photoId, currentStatus) =>
            handleToggleFavorite(photoId, currentStatus)
          }
          onAddFeedback={(photoId, newFeedback) => {
            setPhotos((prev) =>
              prev.map((p) =>
                p.ma_hinh_anh === photoId
                  ? { ...p, phan_hoi: [...p.phan_hoi, newFeedback] }
                  : p,
              ),
            );
          }}
          onDeleteFeedback={(photoId, feedbackId) => {
            setPhotos((prev) =>
              prev.map((p) =>
                p.ma_hinh_anh === photoId
                  ? {
                    ...p,
                    phan_hoi: p.phan_hoi.filter(
                      (f) => f.ma_phan_hoi !== feedbackId,
                    ),
                  }
                  : p,
              ),
            );
          }}
          onEditFeedback={(photoId, updatedFeedback) => {
            setPhotos((prev) =>
              prev.map((p) =>
                p.ma_hinh_anh === photoId
                  ? {
                    ...p,
                    phan_hoi: p.phan_hoi.map((f) =>
                      f.ma_phan_hoi === updatedFeedback.ma_phan_hoi
                        ? updatedFeedback
                        : f,
                    ),
                  }
                  : p,
              ),
            );
          }}
          albumQuyenDownload={album.quyen_download}
        />
      )}
    </div>
  );
};

const FolderOpenIcon = () => (
  <svg
    className="mx-auto text-[var(--muted-2)] mb-4 animate-pulse"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 18H18" />
    <path d="M3 22H21" />
    <path d="M14 2H6A2 2 0 0 0 4 4V16A2 2 0 0 0 6 18H18A2 2 0 0 0 20 16V6L14 2Z" />
    <path d="M14 2V6H20" />
  </svg>
);

export default AlbumDetailClient;
