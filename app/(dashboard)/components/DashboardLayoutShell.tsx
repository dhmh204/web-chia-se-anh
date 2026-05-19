import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./SidebarFooter";
import DashboardHeader from "./DashboardHeader";

type DashboardRole = "admin" | "photographer";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

const DashboardLayoutShell = ({
  children,
  role,
}: DashboardLayoutShellProps) => {
  return (
    <main className="min-h-[100vh] grid grid-cols-[286px_minmax(0,1fr)]" >
      <DashboardSidebar role={role} />
      <div className="p-[28px] min-w-0">
        <DashboardHeader />
        {children}
      </div>
    </main>
  );
};

export default DashboardLayoutShell;
