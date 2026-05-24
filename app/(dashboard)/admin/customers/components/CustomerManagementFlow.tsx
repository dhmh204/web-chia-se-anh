import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import CustomerManagementItem from "./CustomerManagementItem";
import Notice from "@/app/(dashboard)/components/Notice";

const value = [
  {
    title: "1. Ghi nhận thông tin liên hệ",
    description:
      "Lưu lại Tên, SĐT để Studio chủ động liên hệ khi bàn giao ảnh hoặc gửi các chương trình tri ân. ",
    className: "border-l-2 border-l-[var(--blue)]",
  },
  {
    title: "2. Liên kết dự án đã thực hiện",
    description:
      "Gán khách hàng vào đúng dự án chụp của họ. Điều này giúp Studio thống kê chính xác và xuất báo cáo nội bộ.",
    className: "border-l-2 border-l-[var(--green)] ",
  },
  {
    title: "3. Theo dõi lượt chụp (Bookings)",
    description:
      "Theo dõi tổng số lần khách đặt lịch/chụp ảnh để nhận diện khách hàng thân thiết và tối ưu hóa trải nghiệm phục vụ. ",
    className: "border-l-2 border-l-[var(--yellow)] ",
  },
];

const CustomerManagementFlow = () => {
  return (
    <Panel
      kicker="Quy trình vận hành"
      title="Quản lý khách hàng"
      description="Các bước ghi nhận và lưu trữ thông tin phục vụ thống kê nội bộ của Studio."
    >
      {value.map((item, index) => (
        <CustomerManagementItem
          key={index}
          title={item.title}
          description={item.description}
          className={item.className}
        />
      ))}
      {/* <Notice
        title="Lưu ý bảo mật"
        description="Thông tin khách hàng chỉ được lưu trữ và truy cập nội bộ bởi quản trị viên hệ thống, đảm bảo không có quyền đăng nhập công khai ra bên ngoài."
      /> */}
    </Panel>
  );
};

export default CustomerManagementFlow;
