"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Playball } from "next/font/google";
import { toastNotify } from "@/components/Toast";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";

const playball = Playball({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const ProjectAccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const ma_du_an = params.ma_du_an as string;

  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Clear cookie and sessionStorage on page load to handle logout / resetting auth state
  useEffect(() => {
    if (ma_du_an) {
      document.cookie = `project_unlocked_${ma_du_an}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      sessionStorage.removeItem(`project_unlocked_${ma_du_an}`);
    }
  }, [ma_du_an]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/client/projects/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_du_an,
          mat_khau: passwordInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Double backup using sessionStorage for client components that don't read cookies
        sessionStorage.setItem(`project_unlocked_${ma_du_an}`, "true");
        toastNotify.success("Xác thực thành công", "Đang mở khóa album...");

        // Redirect back to project details page
        router.push(`/projects/${ma_du_an}`);
        router.refresh();
      } else {
        setErrorMsg(data.message || "Mật khẩu album không chính xác.");
        toastNotify.error(
          "Thất bại",
          data.message || "Mật khẩu album không chính xác.",
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể kết nối đến máy chủ.");
      toastNotify.error("Lỗi kết nối", "Vui lòng thử lại sau.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-7">
      <section className="w-[min(560px, 100%)] p-[38px] border border-[var(--line-green)] rounded-[34px] bg-[rgba(3,7,10,.78)] shadow-[0_0_80px_rgba(16,185,129,.16)] text-center">
        <Image
          width={160}
          height={160}
          src="/images/logo.png"
          alt="Noofoto"
          className="m-[0_auto_26px]"
        />
        <p className="text-[var(--muted)] m-[12px_auto_28px] leading-[1.6] max-w-[420px] uppercase">
          ALBUM RIÊNG TƯ
        </p>
        <h1 className="text-[32px] tracking-[-0.04em] font-bold">
          Nhập mật khẩu album
        </h1>
        <p className="text-[var(--muted)] m-[12px_auto_28px] leading-[1.6] max-w-[420px] ">
          Khách hàng không cần đăng nhập tài khoản. Hãy nhập mật khẩu do studio
          cung cấp để truy cập bộ ảnh.
        </p>
        {/* Form Input & Button */}
        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-4 text-left"
        >
          <div className="flex flex-col gap-2">
            <Input
              label="Mật khẩu album"
              name="mat_khau"
              type="password"
              placeholder="VD: 12A1 2026"
              onChange={(e) => setPasswordInput(e.target.value)}
              value={passwordInput}
              required
              autoFocus
              error={errorMsg}
            ></Input>
          </div>
          <Button onClick={handlePasswordSubmit}>Xác nhận</Button>
        </form>
      </section>
    </div>
  );
};

export default ProjectAccessPage;
