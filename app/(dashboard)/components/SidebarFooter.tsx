import Image from "next/image";
import React from "react";

type DashboardRole = "admin" | "photographer";
type SidebarFooterProps = {
  role: DashboardRole;
  userName?: string;
};

const SidebarFooter = ({ role, userName }: SidebarFooterProps) => {
  const roleLabel = role === "admin" ? "Admin Studio" : "Thợ ảnh";
  const displayName =
    role === "photographer" && userName ? userName : roleLabel;

  const getAvatarText = (name: string) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  const avatarText = getAvatarText(displayName);
  return (
    <div className="mt-auto p-[16px] border border-[var(--line)] rounded-[18px] bg-[background:rgba(255,255,255,0.035)]">
      <div className="flex gap-[12px] items-center">
        <div className="rounded-[14px] grid place-items-center w-[42px] h-[42px] bg-[linear-gradient(135deg,#047857,#10b981)] font-black">
          {avatarText}
        </div>
        <div>
          <p className="text-[var(--muted)] text-[12px]">Xin chào </p>
          <strong className="text-[14px]"> {displayName}</strong>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
