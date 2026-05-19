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
    <div>
      <main>
        <div>
          <DashboardSidebar  role={role} />
        </div>
        <div>
          {/* <DashboardHeader/> */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayoutShell;
