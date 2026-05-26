"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import LandingHeader from "./components/LandingHeader";
import LandingFooter from "./components/LandingFooter";
import LandingFeatures from "./components/LandingFeatures";
import AlbumAccessForm from "./components/AlbumAccessForm";

export default function LandingClient() {
  return (
    <div className="min-h-screen text-[#f8fafc] flex flex-col font-sans overflow-hidden relative">
      {/* Header / Navbar */}
      <LandingHeader />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 z-10 text-center w-full">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-extrabold tracking-wider uppercase mb-6 animate-pulse select-none">
          <Sparkles size={11} />
          <span>Website chia sẻ ảnh thông minh</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-[1.1]">
          Nhận ảnh chất lượng cao từ{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
            Tiệm ảnh Êm Roo
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-medium">
          Chào mừng bạn đến với hệ thống giao nhận ảnh thông minh. Bạn có thể xem hình ảnh trực tuyến, bày tỏ yêu thích, tải ảnh gốc độ nét cao và ghim trực tiếp phản hồi chỉnh sửa ngay trên từng pixel ảnh.
        </p>

        {/* Quick Access Album Form */}
        <AlbumAccessForm />

        {/* Feature Grid */}
        <LandingFeatures />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
