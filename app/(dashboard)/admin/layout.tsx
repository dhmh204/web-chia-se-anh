import React from "react";
import DashboardLayoutShell from "../components/DashboardLayoutShell";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayoutShell role="admin">{children}</DashboardLayoutShell>;
};

export default layout;
