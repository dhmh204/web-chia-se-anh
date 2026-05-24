"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaImage, FaCalendarAlt, FaAngleRight, FaDownload } from "react-icons/fa";
import { toastNotify } from "@/components/Toast";
import Button from "@/components/Button";

type AlbumSummary = {
  ma_album: string;
  ten_alb: string;
  loai_alb: string;
  quyen_download: boolean;
  coverImage: string | null;
  photoCount: number;
};

type ProjectSummary = {
  ma_du_an: string;
  ten_du_an: string;
  ngay_chup: string;
  link_anh_bia: string | null;
  hasPassword: boolean;
  mat_khau: string | null;
  albums: AlbumSummary[];
};

type ProjectClientProps = {
  project: ProjectSummary;
};

const mapLoaiAlb = (type: string) => {
  switch (type) {
    case "ANH_GOC":
      return "Ảnh gốc";
    case "HAU_KY":
      return "Hậu kỳ";
    case "CUOI_CUNG":
      return "Final";
    default:
      return "Khác";
  }
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ProjectClient = ({ project }: ProjectClientProps) => {
  const [isLocked, setIsLocked] = useState(project.hasPassword);
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check if unlocked in sessionStorage
  useEffect(() => {
    if (project.hasPassword) {
      const isUnlocked = sessionStorage.getItem(`project_unlocked_${project.ma_du_an}`);
      if (isUnlocked === "true") {
        setIsLocked(false);
      }
    }
  }, [project.ma_du_an, project.hasPassword]);

  // Handle password verification
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setErrorMsg("");

    // Simulate verification (we can also check locally since we have it or request endpoint,
    // but since we want it to be secure, let's verify against project.mat_khau)
    if (project.mat_khau === passwordInput.trim()) {
      sessionStorage.setItem(`project_unlocked_${project.ma_du_an}`, "true");
      setIsLocked(false);
      toastNotify.success("Xác thực thành công", "Chào mừng bạn truy cập bộ ảnh!");
    } else {
      setErrorMsg("Mật khẩu truy cập không chính xác.");
      toastNotify.error("Thất bại", "Mật khẩu truy cập không chính xác.");
      setIsVerifying(false);
    }
  };

  // Password Input Screen (mockup style)
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4">
        {/* Handwriting font for logo */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playball&display=swap"
          rel="stylesheet"
        />

        {/* Logo and Script brand */}
        <div className="flex flex-col items-center mb-6 select-none animate-fade-in">
          <div className="w-[64px] h-[64px] rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <svg className="w-8 h-8 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[38px] font-medium text-white tracking-wide leading-none" style={{ fontFamily: "'Playball', cursive" }}>
            roofoto
          </span>
          <span className="text-[10px] font-bold text-[#34d399] tracking-[0.25em] uppercase mt-2">
            Dự án riêng tư
          </span>
        </div>

        {/* Card for Password input */}
        <div className="border border-white/5 bg-[#070b13]/85 backdrop-blur-xl rounded-[28px] p-8 max-w-[420px] w-full text-center shadow-2xl relative">
          <h2 className="text-[20px] text-white font-extrabold tracking-tight mb-2.5">
            Nhập mật khẩu dự án
          </h2>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-6 px-1">
            Khách hàng không cần đăng nhập tài khoản. Hãy nhập mật khẩu do studio cung cấp để truy cập các album ảnh.
          </p>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-slate-300 text-[12.5px] font-semibold pl-1">
                Mật khẩu dự án
              </label>
              <input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="VD: 12A1-2026"
                className="border border-white/10 rounded-[15px] bg-white/[0.02] text-white h-[48px] px-4 outline-none focus:border-[#10b981] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] transition-all duration-200 text-[14px]"
                required
                autoFocus
              />
            </div>
            
            {errorMsg && (
              <p className="text-rose-400 text-[12.5px] font-medium text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full min-h-[46px] rounded-[13px] bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14.5px] shadow-[0_4px_20px_rgba(16,185,129,0.22)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              Vào dự án
            </button>
          </form>
        </div>
      </div>
    );
  }

  const coverImage = project.link_anh_bia || "/images/example.jpg";

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col pb-20">
      <link
        href="https://fonts.googleapis.com/css2?family=Playball&display=swap"
        rel="stylesheet"
      />

      {/* Header bar */}
      <header className="border-b border-white/5 bg-[#070b13]/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#10b981]/15 border border-[#10b981]/25 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[20px] font-medium text-white tracking-wide" style={{ fontFamily: "'Playball', cursive" }}>
              roofoto
            </span>
          </div>
          <span className="text-[12px] text-slate-400 font-medium">Cổng thông tin khách hàng</span>
        </div>
      </header>

      {/* Project Banner */}
      <section className="relative w-full h-[280px] bg-black/60 overflow-hidden flex items-end">
        {project.link_anh_bia && (
          <Image
            src={coverImage}
            alt={project.ten_du_an}
            fill
            className="object-cover opacity-35 blur-[3px] scale-105"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/30" />
        
        <div className="max-w-6xl mx-auto w-full px-6 pb-8 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-[11px] bg-[#10b981]/20 text-[#34d399] py-1 px-3 rounded-full uppercase font-bold tracking-wider">
                Dự án ảnh chụp
              </span>
              <h1 className="text-[28px] md:text-[34px] font-extrabold text-white tracking-tight mt-3 leading-tight drop-shadow-lg">
                {project.ten_du_an}
              </h1>
              <div className="flex items-center gap-4 text-slate-300 text-[13.5px] mt-2.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-[#34d399]" />
                  Ngày chụp: {formatDate(project.ngay_chup)}
                </span>
                <span>•</span>
                <span>{project.albums.length} Album ảnh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <main className="max-w-6xl mx-auto px-6 w-full mt-10">
        <h2 className="text-[18px] font-bold text-white mb-6 tracking-tight">
          Danh sách Album ảnh của bạn
        </h2>

        {project.albums.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[24px] p-8">
            <FaImage size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium text-[15px]">
              Dự án này chưa có Album ảnh nào được tạo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.albums.map((album) => {
              const albumCover = album.coverImage || project.link_anh_bia || "";
              return (
                <div
                  key={album.ma_album}
                  className="group border border-white/5 rounded-[20px] bg-[#070b13] overflow-hidden flex flex-col justify-between hover:border-[#10b981]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
                >
                  {/* Album Cover Thumbnail */}
                  <div className="h-[180px] relative w-full bg-black/45 overflow-hidden">
                    {albumCover ? (
                      <Image
                        src={albumCover}
                        alt={album.ten_alb}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <FaImage size={32} className="text-slate-600" />
                      </div>
                    )}
                    
                    {/* Badge type */}
                    <span className="absolute top-3 left-3 text-[10px] bg-[#10b981] text-white py-0.5 px-2 rounded-full uppercase font-bold tracking-wider shadow-lg">
                      {mapLoaiAlb(album.loai_alb)}
                    </span>
                  </div>

                  {/* Album Info */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-white font-extrabold text-[16px] truncate leading-tight group-hover:text-[#34d399] transition-colors">
                        {album.ten_alb}
                      </h3>
                      <p className="text-[13px] text-slate-400 mt-2 font-medium">
                        {album.photoCount} hình ảnh
                      </p>
                      
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        {album.quyen_download ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <FaDownload size={10} /> Cho phép tải về
                          </span>
                        ) : (
                          <span className="text-slate-500">Xem trực tuyến</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/album/${album.ma_album}`}
                        className="w-full h-[40px] rounded-[10px] bg-white/[0.04] hover:bg-[#10b981]/15 hover:text-[#34d399] border border-white/5 hover:border-[#10b981]/30 text-slate-200 text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Vào xem album
                        <FaAngleRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectClient;
