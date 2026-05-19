'use client'
import React from "react";
import { dashboardHeaderConfig } from "./dashboardHeaderConfig";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";

const DashboardHeader = () => {
  const pathname = usePathname();

  const headerData =
    dashboardHeaderConfig[pathname as keyof typeof dashboardHeaderConfig] ?? {
      sectionLabel: "Dashboard",
      title: "Tổng quan",
    };
  return (
    <header className="min-h-[74px] mb-[24px] px-[22px] py-[16px] border border-[var(--line)] rounded-[24px] bg-[rgba(8,13,12,0.72)] shadow-[var(--shadow)] backdrop-blur-[16px] flex items-center justify-between gap-[16px]">
      <div>
        <p className="text-[13px] text-[var(--muted)] mb-[5px]">
          {headerData.sectionLabel}
        </p>

        <h1 className="text-[24px] font-bold tracking-[-0.035em]">
          {headerData.title}
        </h1>
      </div>

      <div className="flex items-center gap-[12px]">
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="w-[280px] h-[44px] border border-[var(--line)] rounded-[14px] px-3.5 bg-[rgba(255,255,255,.035)] text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--muted-2)]"
        />

        {"actionLabel" in headerData && headerData.actionLabel && (
          <Button>
            {headerData.actionLabel}
          </Button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
