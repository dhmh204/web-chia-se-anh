'use-client'
import React from "react";
import { dashboardHeaderConfig } from "./dashboardHeaderConfig";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();

  const headerData =
    dashboardHeaderConfig[pathname as keyof typeof dashboardHeaderConfig] ?? {
      sectionLabel: "Dashboard",
      title: "Tổng quan",
    };


const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-[22px]">
      <div>
        <p className="mb-[6px] text-[13px] text-[var(--muted)]">
          {headerData.sectionLabel}
        </p>

        <h1 className="text-[26px] font-bold">
          {headerData.title}
        </h1>
      </div>

      <div className="flex items-center gap-[12px]">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="h-[44px] w-[280px] rounded-[14px] border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-[16px] text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
        />

        {"actionLabel" in headerData && headerData.actionLabel && (
          <button className="h-[44px] rounded-[14px] bg-[linear-gradient(135deg,#047857,#10b981)] px-[18px] text-[14px] font-bold text-white shadow-[0_0_34px_rgba(16,185,129,0.22)]">
            {headerData.actionLabel}
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
