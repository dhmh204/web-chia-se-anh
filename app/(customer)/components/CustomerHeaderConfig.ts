export const CustomerHeaderConfig = {
  PROJECT_DETAIL: {
    btns: [
      {
        label: "Ảnh yêu thích",
        href: "favorites",
      },
      {
        label: "Theo dõi trạng thái",
        href: "status",
      },
      {
        label: "Thoát album",
        href: "access",
      },
    ],
  },

  PROJECT_FAVORITES: {
    btns: [
      {
        label: "Quay lại album",
        href: "",
      },
      {
        label: "Theo dõi trạng thái",
        href: "status",
      },
      {
        label: "Thoát album",
        href: "access",
      },
    ],
  },

  PROJECT_STATUS: {
    btns: [
      {
        label: "Quay lại album",
        href: "",
      },
      {
        label: "Ảnh yêu thích",
        href: "favorites",
      },
      {
        label: "Thoát album",
        href: "access",
      },
    ],
  },

  PROJECT_PHOTO_DETAIL: {
    btns: [
      {
        label: "Quay lại album",
        href: "",
      },
      {
        label: "Ảnh yêu thích",
        href: "favorites",
      },
    ],
  },

  PROJECT_ACCESS: {
    btns: [
      {
        label: "Vào album",
        href: "",
      },
    ],
  },
} as const;