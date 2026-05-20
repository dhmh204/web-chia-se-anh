"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import React, { useEffect, useRef, useState } from "react";

const roleOptions = [
  {
    value: "Thợ ảnh",
    name: "THO_ANH",
  },
  {
    value: "Admin",
    name: "ADMIN",
  },
];

const stateOptions = [
  {
    value: "Hoạt động",
    name: "HOAT_DONG",
  },
  {
    value: "Khóa",
    name: "KHOA",
  },
];

const passwordOptions = [
  {
    value: "Hệ thống tự sinh mật khẩu",
    name: "AUTO",
  },
  {
    value: "Tự nhập mật khẩu",
    name: "MANUAL",
  },
];

type FormCreateUseProps = {
  onStartProcess: (formData: FormData) => void;
  isProcessing: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
  };
  clearError: (field: "name" | "email" | "password") => void;
};
const FormCreateUse = ({
  onStartProcess,
  isProcessing,
  errors,
  clearError,
}: FormCreateUseProps) => {
  const [hidden, setHidden] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const prevIsProcessing = useRef(isProcessing);

  useEffect(() => {
    if (prevIsProcessing.current && !isProcessing) {
      const hasErrors = Object.values(errors).some((err) => err !== undefined);
      if (!hasErrors) {
        formRef.current?.reset();
        setAvatarPreview(null);
      }
    }
    prevIsProcessing.current = isProcessing;
  }, [isProcessing, errors]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    const formData = new FormData(e.currentTarget);
    onStartProcess(formData);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-[16px]"
    >
      <div className="flex items-center gap-5 p-4 border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.02)]">
        {/* Khung avatar tương tác */}
        <label className="relative w-24 h-24 rounded-[20px] bg-[linear-gradient(135deg,#047857,#10b981)] overflow-hidden flex flex-col items-center justify-center border border-[var(--line)] hover:border-[var(--line-green)] cursor-pointer group transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex-shrink-0">
          {avatarPreview ? (
            <>
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity duration-200 gap-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Thay đổi ảnh
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-white/90 gap-1 text-center px-2">
              <svg className="w-6 h-6 opacity-80 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Ảnh đại diện</span>
            </div>
          )}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>

        {/* Thông tin mô tả và tùy chọn xóa bên cạnh */}
        <div className="flex-1">
          <h4 className="text-[14px] font-bold text-white mb-1">Ảnh hồ sơ thành viên</h4>
          <p className="text-[12px] text-[#94a3b8] leading-relaxed max-w-[320px]">
            Hỗ trợ định dạng JPG, PNG. Ảnh sẽ được tự động đồng bộ và hiển thị trên toàn hệ thống quản trị.
          </p>
          {avatarPreview && (
            <button
              type="button"
              onClick={() => setAvatarPreview(null)}
              className="mt-2 text-[12px] text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa ảnh đã chọn
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[16px]">
        <Input
          label="Họ và tên"
          name="name"
          placeholder="VD: Đào Hoàng Minh Hằng"
          error={errors.name}
          onChange={() => clearError("name")}
        />

        <Input
          label="Email đăng nhập"
          name="email"
          placeholder="minhanh@noofoto.vn"
          error={errors.email}
          onChange={() => clearError("email")}
        />

        <Input
          label="Số điện thoại"
          name="telphone"
          placeholder="0905 xxx xxx"
        />

        <SelectCustom label="Vai trò" values={roleOptions} name="role" />
        <SelectCustom
          label="Trạng thái tài khoản"
          values={stateOptions}
          name="stateAccount"
        />
        <SelectCustom
          label="Các cách cấp mật khẩu"
          values={passwordOptions}
          name="passwordOptions"
          onHiddenChange={(value) => setHidden(value)}
        />
      </div>
      {hidden && (
        <Input
          label="Nhập mật khẩu"
          name="password"
          type="password"
          error={errors.password}
          onChange={() => clearError("password")}
        />
      )}

      <div className="flex flex-col gap-[7px]">
        <label
          htmlFor="note"
          className="text-[#d1d5db] text-[13px] font-semibold"
        >
          Ghi chú
        </label>
        <textarea
          name="note"
          id="note"
          placeholder="VD: Thợ ảnh phụ trách kỉ yếu,..."
          className={`h-[116px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px]  outline-none 
                    transition-all duration-200 focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]`}
        />
      </div>
      <Button type="submit" children="Tạo tài khoản" variant="primary" />
    </form>
  );
};
export default FormCreateUse;
