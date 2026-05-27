"use client";

import React, { useEffect, useState } from "react";
import AvatarUser from "@/components/AvatarUser";
import { signOut, getSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

type DashboardRole = "admin" | "photographer";
type SidebarFooterProps = {
  role: DashboardRole;
  userName?: string;
};

const SidebarFooter = ({ role, userName: initialUserName }: SidebarFooterProps) => {
  const [userName, setUserName] = useState<string | undefined>(initialUserName);

  useEffect(() => {
    if (!userName) {
      const fetchSession = async () => {
        try {
          const session = await getSession();
          if (session?.user?.name) {
            setUserName(session.user.name);
          }
        } catch (error) {
          console.error("Failed to load session in SidebarFooter:", error);
        }
      };
      fetchSession();
    }
  }, [userName, initialUserName]);

  const roleLabel = role === "admin" ? "Admin Studio" : "Thợ ảnh";
  const displayName = userName || roleLabel;

  return (
    <div className="mt-auto p-[16px] border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.035)] flex items-center justify-between gap-[12px]">
      <div className="flex gap-[12px] items-center min-w-0">
        <AvatarUser name={displayName} />
        <div className="min-w-0">
          <p className="text-[var(--muted)] text-[12px]">Xin chào</p>
          <strong className="text-[14px] block truncate" title={displayName}>
            {displayName}
          </strong>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-[36px] h-[36px] flex-shrink-0 rounded-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center cursor-pointer transition-all duration-200 border border-red-500/10 hover:border-red-500/20"
        title="Đăng xuất"
      >
        <FiLogOut size={16} />
      </button>
    </div>
  );
};

export default SidebarFooter;
