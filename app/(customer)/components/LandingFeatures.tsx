"use client";

import React from "react";
import { MessageSquare, Download, Lock, Image as ImageIcon } from "lucide-react";

export default function LandingFeatures() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
      {/* Feature 1 */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/10 transition-colors">
          <MessageSquare size={18} />
        </div>
        <h4 className="text-[14px] font-bold text-white mb-2">Ghi chú & Ghim trực tiếp</h4>
        <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
          Khoanh vùng lỗi hoặc điểm cần sửa ngay trên hình ảnh. Thợ ảnh sẽ thấy chính xác yêu cầu của bạn.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/10 transition-colors">
          <Download size={18} />
        </div>
        <h4 className="text-[14px] font-bold text-white mb-2">Tải ảnh gốc sắc nét</h4>
        <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
          Dễ dàng tải xuống tệp ảnh chất lượng gốc từ tiệm ảnh khi album của bạn được cấp quyền download.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/10 transition-colors">
          <Lock size={18} />
        </div>
        <h4 className="text-[14px] font-bold text-white mb-2">Bảo mật tối đa</h4>
        <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
          Mỗi dự án và album có thể cài đặt mã bảo vệ riêng biệt. Chỉ những ai có mật khẩu mới xem được ảnh.
        </p>
      </div>

      {/* Feature 4 */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/10 transition-colors">
          <ImageIcon size={18} />
        </div>
        <h4 className="text-[14px] font-bold text-white mb-2">Trực quan & Mượt mà</h4>
        <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
          Giao diện xem ảnh toàn màn hình thông minh hỗ trợ chuyển ảnh nhanh và di chuyển bảng điều khiển.
        </p>
      </div>
    </div>
  );
}
