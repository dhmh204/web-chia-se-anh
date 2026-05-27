export const mapLoaiAlb = (type: string) => {
  switch (type) {
    case "ANH_GOC":
      return "Ảnh gốc";
    case "HAU_KY":
      return "Hậu kỳ";
    case "CUOI_CUNG":
      return "Final";
    default:
      return "Khác";
  }
};

export const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);

    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const getStatusPercent = (status: string) => {
  switch (status) {
    case "HOAN_THANH":
      return "100%";
    case "DANG_SUA":
      return "75%";
    case "DANG_CHON":
      return "50%";
    default:
      return "25%";
  }
};