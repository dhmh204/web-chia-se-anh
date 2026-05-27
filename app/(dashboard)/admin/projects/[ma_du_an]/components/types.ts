export type AlbumSummary = {
  ma_album: string;
  ten_alb: string;
  loai_alb: string;
  quyen_download: boolean;
  photoCount: number;
  ngay_tao: string;
};

export type ProjectSummary = {
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

export type ProjectStats = {
  totalPhotos: number;
  totalFeedback: number;
  pendingFeedback: number;
};

export const STATUS_OPTIONS = [
  { value: "Mới", name: "MOI" },
  { value: "Đang chọn", name: "DANG_CHON" },
  { value: "Đang sửa", name: "DANG_SUA" },
  { value: "Hoàn thành", name: "HOAN_THANH" },
]