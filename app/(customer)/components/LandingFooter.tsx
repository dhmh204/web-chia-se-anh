"use client";

import React from "react";

export default function LandingFooter() {
  return (
    <footer className="w-full border-t border-white/5 py-6 mt-12 z-10 select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-[11px] text-slate-500 font-bold">
          &copy; {new Date().getFullYear()} Tiệm ảnh Êm Roo. Tất cả các quyền được bảo lưu.
        </p>
        <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold">
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Điều khoản sử dụng</span>
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Chính sách bảo mật</span>
        </div>
      </div>
    </footer>
  );
}
