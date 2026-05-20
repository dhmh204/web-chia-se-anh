import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import TableUser from "./TableUser";

const ListUsers = () => {
  return (
    <Panel
      kicker="Danh sách nhân sự"
      title="Tài khoản Admin/Thợ ảnh"
      description="Quản lý trạng thái hoạt động, phân quyền và khóa tài khoản khi nhân sự không còn làm việc."
      textButton="Xuất danh sách "
      hrefButton="/api/admin/users/export"
    >
      <TableUser></TableUser>
    </Panel>
  );
};

export default ListUsers;
