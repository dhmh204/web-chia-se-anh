export const dashboardHeaderConfig = {
  "/admin": {
    sectionLabel: "Quản trị hệ thống",
    title: "Tổng quan",
    actionLabel: "+ Tạo dự án",
  },

  "/admin/users": {
    sectionLabel: "Quản lý nhân sự",
    title: "Danh sách nhân sự",
    actionLabel: "+ Thêm nhân sự",
  },

  "/admin/projects": {
    sectionLabel: "Quản lý dự án",
    title: "Danh sách dự án",
    actionLabel: "+ Tạo dự án",
  },

  "/admin/albums": {
    sectionLabel: "Quản lý album",
    title: "Danh sách album",
    actionLabel: "+ Tạo album",
  },

  "/admin/photos": {
    sectionLabel: "Quản lý ảnh",
    title: "Thư viện ảnh",
    actionLabel: "+ Upload ảnh",
  },

  "/admin/feedbacks": {
    sectionLabel: "Phản hồi ảnh",
    title: "Danh sách phản hồi",
  },
  "/admin/customers": {
    sectionLabel: "Quản trị hệ thống",
    title: "Danh sách khách hàng",
    actionLabel: "+ Thêm khách hàng",
  },

  "/admin/settings": {
    sectionLabel: "Cài đặt",
    title: "Cấu hình hệ thống",
  },

  "/photographer": {
    sectionLabel: "Khu vực thợ ảnh",
    title: "Tổng quan",
  },

  "/photographer/projects": {
    sectionLabel: "Dự án của tôi",
    title: "Công việc được phân công",
  },

  "/photographer/albums": {
    sectionLabel: "Album được giao",
    title: "Danh sách album",
  },

    //Noteeeeeeeeeeeeeeee
    "/photographer/albums/[ma_album]": {
    sectionLabel: "Album được giao",
    title: "Danh sách album",
  },


  "/photographer/progress": {
    sectionLabel: "Tiến độ hậu kỳ",
    title: "Theo dõi tiến độ",
  },

  "/photographer/feedbacks": {
    sectionLabel: "Phản hồi cần xử lý",
    title: "Yêu cầu chỉnh sửa",
  },
} as const;
