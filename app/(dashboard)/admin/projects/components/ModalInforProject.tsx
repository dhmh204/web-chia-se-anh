import React from "react";
import Button from "@/components/Button";
import Notice from "@/app/(dashboard)/components/Notice";
import { toastNotify } from "@/components/Toast";
import Modal from "@/components/Modal";

type ModalInforProjectProps = {
  successData: {
    ten_du_an: string;
    ten_khach_hang: string;
    so_dien_thoai: string;
    ngay_chup: string;
    ma_du_an: string;
    mat_khau: string | null;
  };
  onClose: () => void;
};

const ProjectInforItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex justify-between gap-[18px] p-3.5 border border-[var(--line)] rounded-[16px] bg-[rgba(255,255,255,0.04)]">
      <span className="text-[var(--muted)] text-[13px]">{title}</span>
      <strong className="text-right text-[14px] text-white truncate max-w-[200px]">{value}</strong>
    </div>
  );
};

const ModalInforProject = ({
  successData,
  onClose,
}: ModalInforProjectProps) => {
  const projectLink = typeof window !== "undefined" 
    ? `${window.location.origin}/projects/${successData.ma_du_an}`
    : `/projects/${successData.ma_du_an}`;

  const infor = [
    {
      title: "Tên dự án",
      value: successData.ten_du_an,
    },
    {
      title: "Khách hàng",
      value: successData.ten_khach_hang,
    },
    {
      title: "Số điện thoại",
      value: successData.so_dien_thoai,
    },
    {
      title: "Ngày chụp",
      value: successData.ngay_chup,
    },
    {
      title: "Link dự án",
      value: projectLink,
    },
    {
      title: "Mật khẩu truy cập",
      value: successData.mat_khau || "Không cài đặt",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(projectLink);
    toastNotify.success("Thành công", "Đã copy link dự án!");
  };

  return (
    <Modal
      onClose={onClose}
      title="Thông tin dự án đã tạo"
      kicker="Tạo dự án thành công"
    >
      <div className="grid gap-3 mb-[18px]">
        {infor.map((item, i) => (
          <ProjectInforItem key={i} title={item.title} value={item.value} />
        ))}
      </div>

      <Notice description="Gửi Link dự án và Mật khẩu cho khách hàng để họ truy cập các album ảnh." />

      <div className="flex justify-end gap-3 mt-[20px]">
        <Button
          variant="outline"
          onClick={handleCopy}
        >
          Copy link dự án
        </Button>
        <Button onClick={onClose}>Hoàn tất</Button>
      </div>
    </Modal>
  );
};

export default ModalInforProject;
