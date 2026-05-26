"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";

export default function LandingHeader() {
  const router = useRouter();

  return (
    <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10 select-none relative">
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push("/")}>
        <Image src="/images/logo.png" width={100} height={100} alt="Logo" />
      </div>

      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 text-xs font-bold text-slate-350 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
      >
        <LogIn size={13} className="text-emerald-400" />
        <span>Tôi là Thợ ảnh / Admin</span>
      </button>
    </header>
  );
}
