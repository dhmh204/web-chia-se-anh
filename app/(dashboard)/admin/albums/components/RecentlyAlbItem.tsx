"use client";

import Image from "next/image";
import React, { useState } from "react";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import Checkbox from "@/components/Checkbox";
import { useRouter } from "next/navigation";

export type AlbumWithProject = {
  ma_album: string;
  ten_alb: string;
  loai_alb: "ANH_GOC" | "HAU_KY" | "CUOI_CUNG";
  quyen_download: boolean;
  du_an: {
    ten_du_an: string;
    mat_khau: string | null;
    link_anh_bia: string | null;
  };
  hinh_anh: { url_anh: string }[];
  _count: {
    hinh_anh: number;
  };
};

type RecentlyAlbItemProps = {
  album: AlbumWithProject;
};

const typeLabelMap = {
  ANH_GOC: "Ảnh gốc",
  HAU_KY: "Hậu kỳ",
  CUOI_CUNG: "Final",
};

const typeAlbOptions = [
  { value: "Ảnh gốc", name: "ANH_GOC" },
  { value: "Hậu kỳ", name: "HAU_KY" },
  { value: "Final", name: "CUOI_CUNG" },
];

const RecentlyAlbItem = ({ album }: RecentlyAlbItemProps) => {
  const router = useRouter();

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(album.ten_alb);
  const [editType, setEditType] = useState<"ANH_GOC" | "HAU_KY" | "CUOI_CUNG">(album.loai_alb);
  const [editDownload, setEditDownload] = useState(album.quyen_download);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyLink = () => {
    try {
      const shareLink = `${window.location.origin}/album/${album.ma_album}`;
      navigator.clipboard.writeText(shareLink);
      toastNotify.success(
        "Sao chép thành công",
        "Đã sao chép liên kết album vào clipboard.",
      );
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể sao chép liên kết.");
    }
  };

  const handleOpenEdit = () => {
    setEditName(album.ten_alb);
    setEditType(album.loai_alb);
    setEditDownload(album.quyen_download);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!editName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập tên album.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/albums", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_album: album.ma_album,
          ten_album: editName.trim(),
          loai_album: editType,
          quyen_download: editDownload,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật album thành công!");
        setIsEditOpen(false);
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật album.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const coverImage =
    album.hinh_anh?.[0]?.url_anh || album.du_an?.link_anh_bia || "";

  const displayName = `${typeLabelMap[album.loai_alb] || "Album"} - ${album.ten_alb}`;

  return (
    <>
      <div className="border border-[var(--line)] rounded-[20px] bg-[var(--surface-2)] overflow-hidden duration-200 hover:translate-y-[-2px] hover:border-[var(--line-green)] flex flex-col h-full">
        <div
          className="h-[160px] relative w-full
          bg-[linear-gradient(135deg,rgba(16,185,129,0.22),rgba(2,6,23,0.88)),linear-gradient(45deg,rgb(17,24,39),rgb(2,6,23))]
          before:content-[''] before:absolute before:inset-4 before:border before:border-white/15 before:rounded-[15px] before:z-10"
        >
          {coverImage && (
            <Image
              src={coverImage}
              alt={displayName}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3
              className="text-[16px] mb-2 font-bold line-clamp-1"
              title={displayName}
            >
              {displayName}
            </h3>
            <p
              className="text-[var(--muted)] text-[12px] mb-1 font-semibold truncate"
              title={album.du_an?.ten_du_an}
            >
              Dự án: {album.du_an?.ten_du_an}
            </p>
            <p className="text-[var(--muted)] text-[13px] leading-[1.6]">
              {album._count?.hinh_anh || 0} ảnh · Mật khẩu:{" "}
              {album.du_an?.mat_khau || "Trống"} · Download:{" "}
              {album.quyen_download ? "Bật" : "Tắt"}
            </p>
          </div>
          <div className="flex items-center gap-[10px] mt-[16px]">
            <Button variant="sm" href={`/admin/albums/${album.ma_album}`}>
              Xem ảnh
            </Button>
            <Button variant="sm" onClick={handleCopyLink}>
              Copy link
            </Button>
            <Button variant="sm" onClick={handleOpenEdit}>
              Sửa
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT ALBUM MODAL */}
      {isEditOpen && (
        <Modal
          title="Cập nhật Album"
          kicker="ALBUM"
          onClose={() => setIsEditOpen(false)}
          widthClass="w-[min(520px,100%)]"
        >
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-[16px]">
            <Input
              label="Tên Album"
              name="albumName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nhập tên album..."
              required
            />

            <SelectCustom
              label="Loại Album"
              name="typeOfAlbum"
              values={typeAlbOptions}
              value={editType}
              onChange={(val) => setEditType(val as any)}
            />

            <Checkbox
              topLabel="Quyền hạn"
              label="Cho phép khách hàng download album"
              name="allowDownload"
              checked={editDownload}
              onChange={(e) => setEditDownload(e.target.checked)}
            />

            <div className="flex justify-end gap-[12px] mt-2 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default RecentlyAlbItem;
