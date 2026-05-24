import { VaiTro, TrangThaiTaiKHoan, TrangThaiDuAn } from "@prisma/client";

export const formatVaiTro = (vaiTro: VaiTro) => {
  switch (vaiTro) {
    case VaiTro.ADMIN:
      return "Admin";
    case VaiTro.THO_ANH:
      return "Thợ ảnh";
    default:
      return "Không xác định";
  }
};

export const formatTrangThai = (trangThai: TrangThaiTaiKHoan) => {
  switch (trangThai) {
    case TrangThaiTaiKHoan.HOAT_DONG:
      return "Hoạt động";
    case TrangThaiTaiKHoan.KHOA:
      return "Khóa";
    default:
      return "Không xác định";
  }
};

export const formatTrangThaiDuAn = (trangThai: TrangThaiDuAn) => {
  switch (trangThai) {
    case TrangThaiDuAn.MOI:
      return "Mới";
    case TrangThaiDuAn.DANG_CHON:
      return "Đang chọn";
    case TrangThaiDuAn.DANG_SUA:
      return "Đang sửa";
    case TrangThaiDuAn.HOAN_THANH:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
};

export const getBadgeVariantForProject = (
  trangThai: TrangThaiDuAn,
): "new" | "pending" | "editing" | "completed" => {
  switch (trangThai) {
    case TrangThaiDuAn.MOI:
      return "new";
    case TrangThaiDuAn.DANG_CHON:
      return "pending";
    case TrangThaiDuAn.DANG_SUA:
      return "editing";
    case TrangThaiDuAn.HOAN_THANH:
      return "completed";
    default:
      return "new";
  }
};
