import { IconType } from "react-icons";
import {
  FaUsers,
  FaFolder,
  FaImages,
  FaCommentDots,
  FaBolt,
  FaCog,
  FaCamera,
} from "react-icons/fa";
import { IoGrid, IoSparkles } from "react-icons/io5";

type DashboardRole = "admin" | "photographer";

type MenuItem = {
  icon: IconType;
  label: string;
  href: string;
  colorIcon?: string;
  active?: Boolean;
};

const adminMenus: MenuItem[] = [
  {
    icon: IoGrid,
    label: "Tổng quan",
    href: "/admin",
    colorIcon: "#34d399",
    active: true,
  },
  {
    icon: FaUsers,
    label: "Quản lý nhân sự",
    href: "/admin/users",
    colorIcon: "#a78bfa",
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
    icon: IoSparkles,
    label: "Tiến độ hậu kỳ",
    href: "/admin/ai",
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
    label: "Dự án của tôi",
    href: "/photographer/projects",
    colorIcon: "#ffd059",
  },
  {
    icon: FaImages,
    label: "Album được giao",
    href: "/photographer/albums",
    colorIcon: "#60a5fa",
  },
  {
    icon: FaBolt,
    label: "Tiến độ hậu kỳ",
    href: "/photographer/progress",
    colorIcon: "#fb923c",
  },
  {
    icon: FaCommentDots,
    label: "Phản hồi cần xử lý",
    href: "/photographer/feedbacks",
    colorIcon: "#f1eaf6",
  },
];

type DashboardSidebarProps = {
  role: DashboardRole;
};

const SidebarMenu = ({ role }: DashboardSidebarProps) => {
  const menus = role === "admin" ? adminMenus : photographerMenus;

  return (
    <nav className="grid gap-[6px]">
      {menus.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.label}
            href={item.href}
            className={`min-h-[46px] px-[14px] rounded-[15px] text-[14px] flex items-center gap-[12px] transition-all duration-[180ms]
                    ${
                      item.active
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
          </a>
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
