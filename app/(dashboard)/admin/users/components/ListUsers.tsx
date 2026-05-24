import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import TableUser from "./TableUser";
import { prisma } from "@/lib/prisma";

const ListUsers = async () => {
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

  // Serialize dates/decimals if there are any (none here, but clean formatting)
  const serializedUsers = users.map(user => ({
    ...user,
    so_dien_thoai: user.so_dien_thoai || "",
    ghi_chu: user.ghi_chu || "",
    anh_dai_dien: user.anh_dai_dien || "",
  }));

  return (
    <Panel
      kicker="Danh sách nhân sự"
      title="Tài khoản Admin/Thợ ảnh"
      description="Quản lý trạng thái hoạt động, phân quyền và khóa tài khoản khi nhân sự không còn làm việc."
      textButton="Xuất danh sách "
      hrefButton="/api/admin/users/export"
    >
      <TableUser initialUsers={serializedUsers}></TableUser>
    </Panel>
  );
};

export default ListUsers;
