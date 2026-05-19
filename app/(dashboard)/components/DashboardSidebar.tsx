import Image from "next/image";
import SidebarFooter from "./SidebarFooter";
import SidebarMenu from "./SidebarMenu";

type DashboardRole = "admin" | "photographer";

type DashboardSidebarProps = {
  role: DashboardRole;
};

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  return (
    <div className="sticky top-0 h-screen py-[26px] px-[20px] border-r border-[var(--line)] bg-[rgba(3,7,10,0.84)] backdrop-blur-[18px] flex flex-col ">
      <div className="px-[10px] pt-[8px] pb-[28px]">
        <Image src="/images/logo.png" alt="Noofoto" width={150} height={90} />
      </div>
      <p className="mx-[12px] mt-[8px] mb-[10px] text-[var(--muted-2)] text-[11px] font-black tracking-[0.16em] uppercase">
        Menu chính
      </p>
      <SidebarMenu role={role} />
      <SidebarFooter role={role} />
    </div>
  );
};

export default DashboardSidebar;
