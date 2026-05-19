import HeroFeatureItem from '@/app/(auth)/login/components/HeroFeatureItem'
import QuickActionItem from '@/app/(dashboard)/admin/components/QuickActionItem'
import React from 'react'
import { FaCommentDots, FaFolder, FaUserPlus, FaUsers } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri';


const features = [
  {
    icon: FaUsers,
    title: "Thêm thợ ảnh",
    description: "Cấp tài khoản nội bộ cho nhân sự",
    colorIcon: "#61178c",
    href: "/admin/users",

  },
  {
    icon: FaFolder,
    title: "Tạo dự án",
    description: "Khởi tạo dự án mới và phân công phụ trách",
    colorIcon: "#ffd059",
    href: "/admin/projects",

  },
  {
    icon: RiLockPasswordFill,
    title: "Cấu hình album",
    description: "Đặt mật khẩu, và quyền tải ảnh",
    colorIcon: "#f5e200",
    href: "/admin/albums",

  },
  {
    icon: FaCommentDots,
    title: "Quản lý phản hồi",
    description: "Theo dõi comment, yêu cầu chỉnh sửa",
    colorIcon: "#f1eaf6",
    href: "/admin/feedbacks",

  },
];

const QuickActions = () => {
  return (
    <div className='panel'>
      <div className="mb-[18px]">
        <p className="section-kicker"
        >Thao tác nhanh
        </p>
        <h2 className='text-[20px] tracking-[-.035em] font-bold'>Chức năng Admin</h2>
      </div>
      <div className='grid gap-[12px]'>
        {
          features.map((feature) => (
            <QuickActionItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              colorIcon={feature.colorIcon}
              href={feature.href}
            />
          ))
        }
      </div>

    </div>
  )
}

export default QuickActions