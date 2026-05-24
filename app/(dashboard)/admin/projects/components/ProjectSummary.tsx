type ProjectSummaryProps = {
  tenDuAn?: string;
  khachHang?: string;
  ngayChup?: string;
  thoAnh?: string;
  trangThai?: string;
};

const ProjectSummary = ({
  tenDuAn = "Chưa nhập",
  khachHang = "Chưa có",
  ngayChup = "Chưa chọn",
  thoAnh = "Chưa phân công",
  trangThai = "Mới",
}: ProjectSummaryProps) => {
  const items = [
    {
      label: "Tên dự án",
      value: tenDuAn,
    },
    {
      label: "Khách hàng",
      value: khachHang,
    },
    {
      label: "Ngày chụp",
      value: ngayChup,
    },
    {
      label: "Thợ ảnh",
      value: thoAnh,
    },
    {
      label: "Trạng thái",
      value: trangThai,
      highlight: true,
    },
  ];

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-4 rounded-[14px] border border-white/10 bg-white/[0.035] px-4 py-3"
        >
          <span className="text-[13px] text-slate-400">{item.label}</span>

          <strong
            className={`max-w-[55%] truncate text-right text-[13px] ${
              item.highlight ? "text-emerald-400" : "text-white"
            }`}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
};

export default ProjectSummary;
