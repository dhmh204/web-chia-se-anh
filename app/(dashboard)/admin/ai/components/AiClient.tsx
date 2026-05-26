"use client";

import React, { useState, useEffect } from "react";
import Panel from "@/app/(dashboard)/components/Panel";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { toastNotify } from "@/components/Toast";
import Image from "next/image";
import { 
  Sparkles, 
  User, 
  Image as ImageIcon, 
  Edit2, 
  Check, 
  Loader2, 
  HelpCircle,
  Users
} from "lucide-react";

type AlbumItem = {
  ma_album: string;
  ten_alb: string;
  ten_du_an: string;
  photosCount: number;
};

type FaceGroup = {
  ma_nhom: string;
  ten_nhan_vat: string;
  anh_dai_dien: string;
  photosCount: number;
  photos: {
    ma_hinh_anh: string;
    url_anh: string;
  }[];
};

type AiClientProps = {
  initialAlbums: AlbumItem[];
};

export default function AiClient({ initialAlbums }: AiClientProps) {
  const [albums] = useState<AlbumItem[]>(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [faces, setFaces] = useState<FaceGroup[]>([]);
  const [selectedFace, setSelectedFace] = useState<FaceGroup | null>(null);
  
  const [isLoadingFaces, setIsLoadingFaces] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [threshold, setThreshold] = useState<number>(0.60);
  
  // Renaming state
  const [renamingFaceId, setRenamingFaceId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  const selectedAlbum = albums.find((a) => a.ma_album === selectedAlbumId);

  // Fetch face groups when album changes
  const fetchFaces = async (albumId: string) => {
    if (!albumId) {
      setFaces([]);
      setSelectedFace(null);
      return;
    }
    setIsLoadingFaces(true);
    try {
      const res = await fetch(`/api/admin/ai/faces?ma_album=${albumId}`);
      if (res.ok) {
        const data = await res.json();
        setFaces(data);
        // Automatically select the first face group if any
        if (data.length > 0) {
          setSelectedFace(data[0]);
        } else {
          setSelectedFace(null);
        }
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể lấy danh sách khuôn mặt.");
    } finally {
      setIsLoadingFaces(false);
    }
  };

  useEffect(() => {
    fetchFaces(selectedAlbumId);
  }, [selectedAlbumId]);

  // Run AI processing
  const handleTriggerAI = async () => {
    if (!selectedAlbumId) return;
    setIsProcessingAI(true);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_album: selectedAlbumId, threshold }),
      });
      const data = await res.json();
      if (res.ok) {
        toastNotify.success(
          "Thành công",
          `Đã hoàn thành phân tách. Phát hiện ${data.groupsCount} khuôn mặt nhóm.`
        );
        fetchFaces(selectedAlbumId);
      } else {
        toastNotify.error("Thất bại", data.message || "Lỗi xử lý hình ảnh.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối với dịch vụ AI.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Start renaming face group
  const handleStartRename = (face: FaceGroup) => {
    setRenamingFaceId(face.ma_nhom);
    setRenameText(face.ten_nhan_vat);
  };

  // Save renamed face group
  const handleSaveRename = async (faceId: string) => {
    if (!renameText.trim()) return;
    try {
      const res = await fetch("/api/admin/ai/faces", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_nhom: faceId, ten_nhan_vat: renameText }),
      });
      if (res.ok) {
        toastNotify.success("Thành công", "Đã cập nhật tên nhân vật.");
        setRenamingFaceId(null);
        
        // Refresh local list state
        const updatedFaces = faces.map((f) => {
          if (f.ma_nhom === faceId) {
            const next = { ...f, ten_nhan_vat: renameText.trim() };
            if (selectedFace?.ma_nhom === faceId) {
              setSelectedFace(next);
            }
            return next;
          }
          return f;
        });
        setFaces(updatedFaces);
      } else {
        toastNotify.error("Lỗi", "Không thể cập nhật tên.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi máy chủ.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Panel
        kicker="AI / NHẬN DIỆN"
        title="Trực quan hóa & Phân tách khuôn mặt"
        description="Chọn album để chạy tính năng nhận diện khuôn mặt tự động bằng OpenCV AI, sau đó gắn nhãn tên cho từng nhân vật."
      >
        <div className="flex flex-col gap-6 mt-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-5 bg-white/[0.015] border border-white/5 p-4 rounded-2xl select-none">
            <div className="flex-grow">
              <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Chọn Album cần phân tích
              </label>
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                disabled={isProcessingAI}
                className="w-full h-11 px-3 bg-[#0d1210] border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 text-[13.5px] text-white cursor-pointer"
              >
                <option value="">-- Click chọn Album --</option>
                {albums.map((alb) => (
                  <option key={alb.ma_album} value={alb.ma_album}>
                    {alb.ten_du_an} / {alb.ten_alb} ({alb.photosCount} ảnh)
                  </option>
                ))}
              </select>
            </div>

            {selectedAlbumId && (
              <>
                {/* Threshold Slider */}
                <div className="min-w-[240px] flex flex-col justify-end">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Độ gom cụm (Ngưỡng: {threshold.toFixed(2)})
                    </label>
                    <span className="text-[11px] font-extrabold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {threshold <= 0.45 ? "Rất nghiêm ngặt" : threshold >= 0.70 ? "Rất lỏng lẻo" : "Cân bằng"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 h-11">
                    <input
                      type="range"
                      min="0.30"
                      max="0.80"
                      step="0.02"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      disabled={isProcessingAI}
                      className="flex-1 h-1.5 bg-[#0d1210] rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-white/10"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleTriggerAI}
                  disabled={isProcessingAI}
                  className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[12.5px] flex items-center justify-center gap-2 tracking-wide cursor-pointer shrink-0"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="animate-spin" size={15} />
                      <span>Đang phân tích...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Phân tách khuôn mặt</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* AI Workspace Details */}
          {selectedAlbumId ? (
            isProcessingAI ? (
              <div className="flex flex-col items-center justify-center py-24 text-center select-none">
                <Loader2 className="animate-spin text-emerald-400 mb-4" size={40} />
                <h4 className="text-[16px] font-bold text-white mb-1.5">
                  Đang quét và gom cụm hình ảnh
                </h4>
                <p className="text-[12.5px] text-slate-500 max-w-sm leading-relaxed">
                  Hệ thống đang gọi API OpenCV để tải hình ảnh gốc, phân tách các khuôn mặt xuất hiện và chạy thuật toán gom cụm thông minh. Vui lòng không đóng cửa sổ này.
                </p>
              </div>
            ) : isLoadingFaces ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-emerald-400" size={24} />
              </div>
            ) : faces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center select-none border border-dashed border-white/10 rounded-2xl bg-white/[0.005]">
                <Users size={32} className="text-slate-600 mb-3" />
                <p className="text-slate-400 text-[13.5px] font-bold">
                  Chưa có khuôn mặt nào được nhận diện
                </p>
                <p className="text-slate-500 text-[11.5px] max-w-xs mt-1.5 leading-relaxed">
                  Nhấp vào nút "Phân tách khuôn mặt" ở trên để quét toàn bộ ảnh trong album bằng thuật toán OpenCV.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: Face list (5/12 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                  <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    Nhóm khuôn mặt phát hiện ({faces.length})
                  </h4>

                  {faces.map((face) => {
                    const isSelected = selectedFace?.ma_nhom === face.ma_nhom;
                    const isEditing = renamingFaceId === face.ma_nhom;

                    return (
                      <div
                        key={face.ma_nhom}
                        onClick={() => !isEditing && setSelectedFace(face)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                            : "bg-white/[0.01] border-white/5 text-slate-350 hover:bg-white/[0.03] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {/* Face Avatar */}
                          <div className="w-[42px] h-[42px] rounded-full overflow-hidden relative border border-white/10 bg-black/40 flex-shrink-0">
                            <Image
                              src={face.anh_dai_dien}
                              alt={face.ten_nhan_vat}
                              fill
                              sizes="42px"
                              className="object-cover"
                            />
                          </div>

                          {/* Face Details/Name Input */}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={renameText}
                                  onChange={(e) => setRenameText(e.target.value)}
                                  className="h-8 px-2.5 bg-[#0d1210] border border-emerald-500/50 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 w-full"
                                  placeholder="Nhập tên..."
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveRename(face.ma_nhom)}
                                  className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="font-bold text-[13.5px] block truncate">
                                  {face.ten_nhan_vat}
                                </span>
                                <span className="text-[11px] text-slate-500 mt-0.5 block">
                                  Xuất hiện trong {face.photosCount} ảnh
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartRename(face);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-all"
                            title="Gắn nhãn tên nhân vật"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT COLUMN: Photo grid (7/12 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {selectedFace ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                        <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <ImageIcon size={13} className="text-emerald-400" />
                          Ảnh chứa nhân vật: {selectedFace.ten_nhan_vat}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-bold">
                          {selectedFace.photosCount} ảnh
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3.5 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                        {selectedFace.photos.map((photo) => (
                          <div
                            key={photo.ma_hinh_anh}
                            className="aspect-square relative rounded-xl overflow-hidden bg-black/40 border border-white/5 group"
                          >
                            <Image
                              src={photo.url_anh}
                              alt="Detected face instance"
                              fill
                              sizes="(max-width: 768px) 33vw, 200px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <a
                              href={photo.url_anh}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-[10px] text-white font-bold select-none cursor-pointer"
                            >
                              Xem ảnh gốc
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center p-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.005] text-[13px] text-slate-500">
                      Chọn một khuôn mặt bên trái để xem các hình ảnh chứa khuôn mặt đó.
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center select-none border border-dashed border-white/5 rounded-2xl bg-white/[0.005]">
              <HelpCircle size={32} className="text-slate-700 mb-3" />
              <p className="text-slate-400 text-[13.5px] font-bold">
                Chọn Album để bắt đầu làm việc
              </p>
              <p className="text-slate-500 text-[11.5px] max-w-xs mt-1.5 leading-relaxed">
                Vui lòng chọn một album từ danh sách thả xuống ở phía trên để xem các khuôn mặt đã được gắn nhãn hoặc quét khuôn mặt mới.
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
