"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AlbumAccessForm() {
  const router = useRouter();
  const [albumInput, setAlbumInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccessAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    let code = albumInput.trim();
    if (!code) {
      toast.error("Vui lòng nhập mã album hoặc đường dẫn!");
      return;
    }

    setIsSubmitting(true);

    if (code.includes("/album/")) {
      const parts = code.split("/album/");
      code = parts[parts.length - 1].split("?")[0].split("#")[0];
    } else if (code.includes("/")) {
      const parts = code.split("/");
      code = parts[parts.length - 1].split("?")[0].split("#")[0];
    }

    if (code) {
      toast.success("Đang chuyển hướng tới album...");
      router.push(`/album/${code}`);
    } else {
      toast.error("Mã album không hợp lệ!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[26px] shadow-2xl mb-16 relative text-left">
      <div className="absolute inset-0 rounded-[26px] bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none" />

      <h3 className="text-base md:text-lg font-bold text-white mb-2 flex items-center gap-2">
        <span>Truy cập Album của bạn</span>
      </h3>
      <p className="text-slate-500 text-xs mb-5 leading-relaxed font-medium">
        Dán liên kết album hoặc nhập mã album do thợ ảnh cung cấp vào ô bên dưới để truy cập nhanh.
      </p>

      <form onSubmit={handleAccessAlbum} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Ví dụ: ALB-XXXX hoặc link chia sẻ..."
            value={albumInput}
            onChange={(e) => setAlbumInput(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-[46px] pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 text-sm text-white placeholder-slate-600 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[46px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-600/40 text-black font-extrabold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0"
        >
          {isSubmitting ? "Đang kết nối..." : "Truy cập"}
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </form>

      {/* Quick Help Link */}
      <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-600 font-bold select-none">
        <HelpCircle size={12} />
        <span>Vô tình thoát trang? Hãy dán link hoặc mã để vào lại album lập tức.</span>
      </div>
    </div>
  );
}
