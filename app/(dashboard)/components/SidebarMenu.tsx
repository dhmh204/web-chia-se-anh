"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import {
  FaUsers,
  FaFolder,
  FaImages,
  FaCommentDots,
  FaBolt,
  FaCog,
  FaCamera,
  FaUser,
} from "react-icons/fa";
import { IoChatbubbleEllipsesSharp, IoCloudSharp, IoGrid, IoSparkles } from "react-icons/io5";

type DashboardRole = "admin" | "photographer";

type MenuItem = {
  icon: IconType;
  label: string;
  href: string;
  colorIcon?: string;
};

const adminMenus: MenuItem[] = [
  {
    icon: IoGrid,
    label: "Tổng quan",
    href: "/admin",
    colorIcon: "#34d399",
  },
  {
    icon: FaUsers,
    label: "Quản lý nhân sự",
    href: "/admin/users",
    colorIcon: "#61178c",
  },
  {
    icon: FaUser,
    label: "Quản lý khách hàng",
    href: "/admin/customers",
  },
  {
    icon: FaFolder,
    label: "Quản lý dự án",
    href: "/admin/projects",
    colorIcon: "#ffd059",
  },
  {
    icon: FaImages,
    label: "Quản lý album",
    href: "/admin/albums",
    colorIcon: "#60a5fa",
  },
  {
    icon: FaImages,
    label: "Quản lý ảnh",
    href: "/admin/photos",
    colorIcon: "#60a5fa",
  },
  {
    icon: FaCommentDots,
    label: "Phản hồi ảnh",
    href: "/admin/feedbacks",
    colorIcon: "#f1eaf6",
  },
  {
    icon: FaBolt,
    label: "Tiến độ hậu kỳ",
    href: "/admin/progress",
    colorIcon: "#34d399",
  },
  {
    icon: IoSparkles,
    label: "AI / Nhãn khuôn mặt",
    href: "/admin/ai",
    colorIcon: "#34d399",
  },
  {
    icon: FaCog,
    label: "Cài đặt",
    href: "/admin/settings",
    colorIcon: "#94a3b8",
  },
];

const photographerMenus: MenuItem[] = [
  {
    icon: IoGrid,
    label: "Tổng quan",
    href: "/photographer",
    colorIcon: "#34d399",
  },
  {
    icon: FaCamera,
    label: "Dự án được giao",
    href: "/photographer/projects",
    colorIcon: "#ffd059",
  },
  {
    icon: FaImages,
    label: "Album của tôi",
    href: "/photographer/albums",
    colorIcon: "#60a5fa",
  },
  {
    icon: IoCloudSharp ,
    label: "Upload ảnh",
    href: "/photographer/photos",
    colorIcon: "var(--green-2)",
  },
  {
    icon: FaCommentDots ,
    label: "Phản hồi ảnh",
    href: "/photographer/feedbacks",
    colorIcon: "#f1eaf6",
  },
    {
    icon: FaBolt,
    label: "Ảnh khách yêu thích",
    href: "/photographer/favorites",
    colorIcon: "#fb923c",
  },
  {
    icon: FaBolt,
    label: "Tiến độ hậu kỳ",
    href: "/photographer/progress",
    colorIcon: "#fb923c",
  },
];

type SidebarMenuProps = {
  role: DashboardRole;
};

const SidebarMenu = ({ role }: SidebarMenuProps) => {
  const pathname = usePathname();

  const menus = role === "admin" ? adminMenus : photographerMenus;

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/photographer") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };
  return (
    <nav className="grid gap-[6px]">
      {menus.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-h-[46px] px-[14px] rounded-[15px] text-[14px] flex items-center gap-[12px] transition-all duration-[180ms]
              ${
                active
                  ? "text-[var(--green-2)] bg-[rgba(16,185,129,0.12)]"
                  : "text-[#b6c1d0] hover:text-[var(--green-2)] hover:bg-[rgba(16,185,129,0.12)]"
              }
            `}
          >
            <Icon
              className="text-[14px]"
              style={item.colorIcon ? { color: item.colorIcon } : undefined}
            />

            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
