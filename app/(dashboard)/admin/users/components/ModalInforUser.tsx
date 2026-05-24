import React from "react";
import AccountInforItem from "./AccountInforItem";
import Button from "@/components/Button";
import Notice from "@/app/(dashboard)/components/Notice";
import { toastNotify } from "@/components/Toast";
import Modal from "@/components/Modal";

type ModalInforUserProps = {
  successData: {
    ho_va_ten: string;
    email: string;
    mat_khau_tam: string;
    trang_thai: string;
  };
  setSuccessData: (data: any) => void;
};

const ModalInforUser = ({
  successData,
  setSuccessData,
}: ModalInforUserProps) => {
  let trangThai = "";
  if (successData.trang_thai == "HOAT_DONG") {
    trangThai = "Hoạt động";
  } else trangThai = "Khóa";

  const infor = [
    {
      title: "Họ tên",
      value: successData.ho_va_ten,
    },
    {
      title: "Email",
      value: successData.email,
    },
    {
      title: "Mật khẩu tạm",
      value: successData.mat_khau_tam,
    },
    {
      title: "Trạng thái",
      value: trangThai,
    },
  ];
  return (
    <Modal
      onClose={() => setSuccessData(null)}
      title="Thông tin đăng nhập tạm thời"
      kicker="Tạo tài khoản thành công"
    >
      <div className="grid gap-3 mb-[18px]">
        {infor.map((item, i) => (
          <AccountInforItem key={i} title={item.title} value={item.value} />
        ))}
      </div>

      <Notice description="Khuyến khích đổi mật khẩu sau lần đăng nhập đầu tiên." />

      <div className="flex justify-end gap-3 mt-[20px]">
        <Button
          variant="outline"
          children="Copy thông tin"
          onClick={() => {
            const text = `Họ tên: ${successData.ho_va_ten}\nEmail: ${successData.email}\nMật khẩu: ${successData.mat_khau_tam}\nTrạng thái: ${successData.trang_thai === "HOAT_DONG" ? "Hoạt động" : "Đã khóa"}`;
            navigator.clipboard.writeText(text);
            toastNotify.success("Thành công", "Đã copy thông tin tài khoản!");
          }}
        />
        <Button onClick={() => setSuccessData(null)} children="Hoàn tất" />
      </div>
    </Modal>
  );
};

export default ModalInforUser;
