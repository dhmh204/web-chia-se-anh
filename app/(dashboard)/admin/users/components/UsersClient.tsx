"use client";

import React, { useRef, useState } from "react";
import CreateUser from "./CreateUser";
import AccountProcessPanel from "./AccountProcessPanel";
import ModalInforUser from "./ModalInforUser";
import { toastNotify } from "@/components/Toast";

type UsersClientProps = {};

const UsersClient = () => {
  const [isRunningProcess, setIsRunningProcess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [successData, setSuccessData] = useState<{
    ho_va_ten: string;
    email: string;
    mat_khau_tam: string;
    trang_thai: string;
  } | null>(null);

  const handleStartProcess = async (formData: FormData) => {
    setErrors({});
    setIsRunningProcess(true);
    setActiveStep(1);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        body: formData,
      });

      if (!response.body) {
        throw new Error(
          "Không thể thiết lập kênh truyền tải dữ liệu tiến trình.",
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Giữ lại phần chưa hoàn chỉnh cuối cùng nếu có
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line);

          if (parsed.type === "progress") {
            setActiveStep(parsed.step);
          } else if (parsed.type === "success") {
            // Khi API thành công
            setSuccessData({
              ho_va_ten: parsed.user.ho_va_ten,
              email: parsed.user.email,
              mat_khau_tam: parsed.mat_khau_tam,
              trang_thai: parsed.user.trang_thai,
            });
            setIsRunningProcess(false);
            setErrors({});
          } else if (parsed.type === "error") {
            throw new Error(parsed.message);
          }
        }
      }
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tạo tài khoản";

      const newErrors: typeof errors = {};
      if (message.includes("họ và tên")) {
        newErrors.name = message;
      } else if (message.includes("email") || message.includes("Email")) {
        newErrors.email = message;
      } else if (message.includes("mật khẩu")) {
        newErrors.password = message;
      } else {
        toastNotify.error("Lỗi tạo tài khoản", message);
      }
      setErrors(newErrors);
      setIsRunningProcess(false);
      setActiveStep(1);
    }
  };

  const clearError = (field: "name" | "email" | "password") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      <CreateUser
        onStartProcess={handleStartProcess}
        isProcessing={isRunningProcess}
        errors={errors}
        clearError={clearError}
      />

      <AccountProcessPanel
        isRunning={isRunningProcess}
        activeStep={activeStep}
      />

      {successData && (
        <ModalInforUser
          successData={successData}
          setSuccessData={setSuccessData}
        />
      )}
    </>
  );
};

export default UsersClient;
