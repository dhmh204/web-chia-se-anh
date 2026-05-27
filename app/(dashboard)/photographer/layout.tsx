import React from "react";
import DashboardLayoutShell from "../components/DashboardLayoutShell";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.vai_tro !== "THO_ANH" && session.user.vai_tro !== "ADMIN") {
    redirect("/login");
  }

  return <DashboardLayoutShell role="photographer">{children}</DashboardLayoutShell>;
};

export default layout;
