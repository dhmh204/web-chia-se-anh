import AvatarUser from "@/components/AvatarUser";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { prisma } from "@/lib/prisma";
import { TrangThaiTaiKHoan, VaiTro } from "@prisma/client";
import React from "react";

const titles = [
  "Nhân sự",
  "Email",
  "Vai trò",
  "Trạng thái",
  "Dự án phụ trách",
  "Thao tác",
];

const TableUser = async () => {
  const users = await prisma.nguoiDung.findMany({
    orderBy: {
      ngay_tao: "desc",
    },
    select: {
      ma_nguoi_dung: true,
      ho_va_ten: true,
      email: true,
      so_dien_thoai: true,
      vai_tro: true,
      trang_thai: true,
      ghi_chu: true,
      anh_dai_dien: true,
      _count: {
        select: {
          su_phan_cong: true,
        },
      },
    },
  });
  const formatVaiTro = (vaiTro: VaiTro) => {
    switch (vaiTro) {
      case VaiTro.ADMIN:
        return "Admin";
      case VaiTro.THO_ANH:
        return "Thợ ảnh";
      default:
        return "Không xác định";
    }
  };

  const formatTrangThai = (trangThai: TrangThaiTaiKHoan) => {
    switch (trangThai) {
      case TrangThaiTaiKHoan.HOAT_DONG:
        return "Hoạt động";
      case TrangThaiTaiKHoan.KHOA:
        return "Khóa";
      default:
        return "Không xác định";
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          {titles.map((title, index) => (
            <th
              className="text-[var(--muted)] font-semibold text-[12px] uppercase tracking-[0.08em]"
              key={index}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody id="staffTableBody">
        {users.map((user) => (
          <tr key={user.ma_nguoi_dung}>
            <td>
              <div className="flex items-center gap-[12px]">
                <div className="avatar">
                  <AvatarUser
                    name={user.ho_va_ten || ""}
                    avatarUrl={user.anh_dai_dien || ""}
                  />
                </div>
                <div>
                  <strong className="block mb-[3px] text-[14px]">
                    {user.ho_va_ten}
                  </strong>
                </div>
              </div>
            </td>
            <td>{user.email}</td>
            <td>
              <Badge
                label={formatVaiTro(user.vai_tro)}
                variant={user.vai_tro === VaiTro.ADMIN ? "completed" : "new"}
                className="uppercase"
              ></Badge>
            </td>
            <td>
              <Badge
                label={formatTrangThai(user.trang_thai)}
                variant={
                  user.trang_thai === TrangThaiTaiKHoan.HOAT_DONG
                    ? "completed"
                    : "pending"
                }
              ></Badge>
            </td>
            <td>
              {user.vai_tro === VaiTro.ADMIN
                ? "Toàn bộ hệ thống"
                : `${user._count.su_phan_cong} dự án`}
            </td>
            <td>
              <div className="flex flex-wrap gap-[12px]">
                {user.trang_thai === TrangThaiTaiKHoan.HOAT_DONG ? (
                  <>
                    <Button variant="sm">Sửa</Button>
                    <Button variant="danger">Khóa</Button>
                  </>
                ) : (
                  <Button variant="sm">Mở khóa</Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableUser;
