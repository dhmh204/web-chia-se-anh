"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LoginOptions from "./LoginOptions";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error.includes("Tài khoản không tồn tại")) {
        setEmailError(res.error);
      } else if (res.error.includes("Mật khẩu không chính xác")) {
        setPasswordError(res.error);
      } else if (res.error.includes("Vui lòng nhập")) {
        if (!email) setEmailError("Vui lòng nhập email");
        if (!password) setPasswordError("Vui lòng nhập mật khẩu");
      } else {
        // Nếu lỗi không xác định, báo vào email để người dùng biết
        setEmailError(res.error);
      }
    } else {
      // Sử dụng hard redirect (window.location.href) để trình duyệt chắc chắn gửi cookie mới lên server
      // Server (file app/page.tsx) sẽ tự động lấy session và phân luồng vào /admin hoặc /photographer
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center justify-center p-[36px]">
      <div className=" w-[min(530px,100%)] p-[40px] border border-[rgba(16,185,129,0.28)] rounded-[34px] shadow-[0_0_80px_rgba(16,185,129,0.16)] backdrop-blur-[18px] bg-[rgba(3,7,10,0.76)] ">
        <h2 className="text-[32px] tracking-[-0.04em] text-center font-bold mb-[30px]">
          Đăng nhập hệ thống
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-[30px]">
          <Input
            label="Email"
            placeholder="abc@gmaill.com"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            required
          />
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            required
          />
          <LoginOptions></LoginOptions>
          <Button variant="primary" type="submit">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
