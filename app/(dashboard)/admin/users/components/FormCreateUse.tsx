"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import ImageUploadInput from "@/components/ImageUploadInput";
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
  hasError: boolean;
};
const FormCreateUse = ({
  onStartProcess,
  isProcessing,
  errors,
  clearError,
  hasError,
}: FormCreateUseProps) => {
  const [hidden, setHidden] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const prevIsProcessing = useRef(isProcessing);

  useEffect(() => {
    if (prevIsProcessing.current && !isProcessing) {
      if (!hasError) {
        formRef.current?.reset();
        setAvatarPreview(null);
      }
    }
    prevIsProcessing.current = isProcessing;
  }, [isProcessing, hasError]);

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
      <ImageUploadInput
        name="avatar"
        variant="avatar"
        previewUrl={avatarPreview}
        onChange={(file) => {
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setAvatarPreview(null);
          }
        }}
        onRemove={() => setAvatarPreview(null)}
        title="Ảnh hồ sơ thành viên"
        description="Hỗ trợ định dạng JPG, PNG. Ảnh sẽ được tự động đồng bộ và hiển thị trên toàn hệ thống quản trị."
      />

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
