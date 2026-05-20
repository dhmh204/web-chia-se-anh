import React from "react";
import { IoMdClose } from "react-icons/io";
import AccountInforItem from "./AccountInforItem";
import Button from "@/components/Button";
import Notice from "@/app/(dashboard)/components/Notice";
import { toastNotify } from "@/components/Toast";

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
    <div className="fixed inset-0 place-items-center p-6 bg-[rgba(0,0,0,0.72)] backdrop-blur-[10px] z-[99]">
      <div className="w-[min(560px,100%)] p-6 border border-[rgba(16,185,129,0.35)] rounded-[26px] bg-[#07100d] shadow-[0_0_90px_rgba(16,185,129,0.18)]">
        <div className="flex justify-between gap-[18px] mb-5">
          <div>
            <p className="text-[var(--green-2)] text-[11px] font-extrabold tracking-[0.18em] uppercase mb-[7px]">
              Tạo tài khoản thành công
            </p>
            <h2 className="text-[22px] font-bold mt-[6px]">
              Thông tin đăng nhập tạm thời
            </h2>
          </div>
          <button
            className="cursor-pointer flex justify-center items-center w-[38px] h-[38px] rounded-[12px] border border-[var(--line)] bg-[rgba(255,255,255,0.05)] text-[var(--text)] text-[24px] opacity-70 hover:opacity-100 duration-200"
            onClick={() => setSuccessData(null)}
          >
            <IoMdClose size={16} />
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default ModalInforUser;
