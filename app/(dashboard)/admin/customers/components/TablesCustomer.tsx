"use client";

import React, { useState, useMemo } from "react";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";
import Panel from "@/app/(dashboard)/components/Panel";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";

import { TrangThaiDuAn } from "@prisma/client";
import { getBadgeVariantForProject } from "@/lib/format";

export type CustomerWithProjects = {
  ma_khach_hang: string;
  ho_va_ten: string;
  so_dien_thoai: string;
  ngay_tao: Date;
  du_an: {
    ma_du_an: string;
    ten_du_an: string;
    trang_thai: TrangThaiDuAn;
  }[];
};

type TablesCustomerProps = {
  customers: CustomerWithProjects[];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getColorFromName = (name: string) => {
  const colorMap: Record<string, string> = {
    "Vũ Quốc Huy": "bg-[#059669]/10 text-[#34d399] border-[#059669]/20",
    "Lê Thị Thu Hà": "bg-[#0d9488]/10 text-[#2dd4bf] border-[#0d9488]/20",
    "Phạm Thủy Linh": "bg-[#0891b2]/10 text-[#22d3ee] border-[#0891b2]/20",
    "Nguyễn Hoàng Minh": "bg-[#2563eb]/10 text-[#60a5fa] border-[#2563eb]/20",
    "Trần Anh Tuấn": "bg-[#4f46e5]/10 text-[#818cf8] border-[#4f46e5]/20",
  };
  if (colorMap[name]) return colorMap[name];

  const colors = [
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "bg-teal-500/10 text-teal-400 border-teal-500/20",
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  ];
  const charSum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[charSum % colors.length];
};

const getEmailFromName = (name: string) => {
  const nameMap: Record<string, string> = {
    "Vũ Quốc Huy": "quochuy.vu@outlook.com",
    "Lê Thị Thu Hà": "thuha.le@gmail.com",
    "Phạm Thủy Linh": "thuylinh.pham@gmail.com",
    "Nguyễn Hoàng Minh": "minh.hoang@gmail.com",
    "Trần Anh Tuấn": "tuan.tran@yahoo.com",
  };
  if (nameMap[name]) return nameMap[name];
  const clean = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ".");
  return `${clean}@gmail.com`;
};

const sortOptions = [
  { value: "Mới tạo trước", name: "newest" },
  { value: "Cũ tạo trước", name: "oldest" },
  { value: "Tên A-Z", name: "alphabetical" },
  { value: "Số lần chụp giảm dần", name: "shoots" },
];

const TablesCustomer = ({ customers }: TablesCustomerProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingCust, setEditingCust] = useState<CustomerWithProjects | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get list of unique projects for filter option
  const projectFilterOptions = useMemo(() => {
    const list: { name: string; value: string }[] = [];
    customers.forEach((c) => {
      c.du_an.forEach((p) => {
        if (!list.some((item) => item.name === p.ten_du_an)) {
          list.push({ name: p.ten_du_an, value: p.ten_du_an });
        }
      });
    });
    return list;
  }, [customers]);

  // Format unique projects for SelectCustom component
  const projectSelectOptions = useMemo(() => {
    const list = [{ value: "Tất cả dự án", name: "all" }];
    projectFilterOptions.forEach((opt) => {
      list.push({ value: opt.value, name: opt.name });
    });
    return list;
  }, [projectFilterOptions]);

  const handleOpenEdit = (cust: CustomerWithProjects) => {
    setEditingCust(cust);
    setEditName(cust.ho_va_ten);
    setEditPhone(cust.so_dien_thoai);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust || isSaving) return;

    if (!editName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập họ tên.");
      return;
    }
    if (!editPhone.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập số điện thoại.");
      return;
    }
    if (editPhone.trim().length < 10) {
      toastNotify.error("Lỗi", "Số điện thoại phải chứa ít nhất 10 chữ số.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_khach_hang: editingCust.ma_khach_hang,
          ho_va_ten: editName.trim(),
          so_dien_thoai: editPhone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success("Thành công", "Cập nhật khách hàng thành công!");
        setEditingCust(null);
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật khách hàng.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Họ tên",
      "Số điện thoại",
      "Email",
      "Dự án liên kết",
      "Số lần chụp",
      "Ngày tạo",
    ];
    const rows = filteredAndSortedCustomers.map((c) => [
      c.ho_va_ten,
      c.so_dien_thoai,
      getEmailFromName(c.ho_va_ten),
      c.du_an.map((p) => p.ten_du_an).join("; ") || "Chưa gắn",
      c.du_an.length,
      new Date(c.ngay_tao).toLocaleDateString("vi-VN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `danh_sach_khach_hang_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastNotify.success(
      "Xuất dữ liệu thành công",
      "Tập tin CSV đã được tải xuống.",
    );
  };

  // Filter & Sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.ho_va_ten.toLowerCase().includes(query) ||
          c.so_dien_thoai.includes(query),
      );
    }

    // Project filter
    if (selectedProjectFilter !== "all") {
      result = result.filter((c) =>
        c.du_an.some((p) => p.ten_du_an === selectedProjectFilter),
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.ngay_tao).getTime() - new Date(b.ngay_tao).getTime();
      }
      if (sortBy === "alphabetical") {
        return a.ho_va_ten.localeCompare(b.ho_va_ten, "vi");
      }
      if (sortBy === "shoots") {
        return b.du_an.length - a.du_an.length;
      }
      return 0;
    });

    return result;
  }, [customers, searchQuery, selectedProjectFilter, sortBy]);

  return (
    <Panel
      kicker="CƠ SỞ DỮ LIỆU KHÁCH HÀNG"
      title="Danh sách khách hàng"
      description="Nhấp vào cột tiêu đề để sắp xếp. Sử dụng thanh tìm kiếm để tìm nhanh hoặc lọc theo dự án liên kết bên dưới."
    >
      {/* Top Controls & Custom Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--line)] pb-5">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[48px] px-[16px] bg-[rgba(255,255,255,0.04)] border border-[var(--line)] rounded-[15px] text-[14px] text-white outline-none focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] transition-all w-[240px]"
          />

          <div className="flex items-center gap-2">
            <span className="text-[13.5px] text-[var(--muted)] shrink-0">
              Dự án liên kết:
            </span>
            <div className="w-[200px]">
              <SelectCustom
                label=""
                name="projectFilter"
                values={projectSelectOptions}
                value={selectedProjectFilter}
                onChange={(val) => setSelectedProjectFilter(val)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13.5px] text-[var(--muted)] shrink-0">
              Sắp xếp theo:
            </span>
            <div className="w-[180px]">
              <SelectCustom
                label=""
                name="sortBy"
                values={sortOptions}
                value={sortBy}
                onChange={(val) => setSortBy(val)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="min-h-[48px] text-[14px] rounded-[15px] px-5"
            onClick={handleExportCSV}
          >
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      {filteredAndSortedCustomers.length === 0 ? (
        <div className="text-center py-10 text-[var(--muted)] text-[14px]">
          Không tìm thấy khách hàng nào phù hợp với bộ lọc.
        </div>
      ) : (
        <Table
          headers={[
            "Khách hàng",
            "Số điện thoại",
            "Email liên hệ",
            "Dự án thực hiện",
            "Số lần chụp",
            "Thao tác",
          ]}
        >
          {filteredAndSortedCustomers.map((c) => {
            const initials = getInitials(c.ho_va_ten);
            const avatarColorClass = getColorFromName(c.ho_va_ten);
            const email = getEmailFromName(c.ho_va_ten);

            return (
              <tr key={c.ma_khach_hang}>
                <td>
                  <div className="flex items-center gap-[12px]">
                    <div
                      className={`w-[36px] h-[36px] rounded-full border flex items-center justify-center text-[13px] font-bold shrink-0 ${avatarColorClass}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <strong className="block mb-[2px] text-[14px] text-white">
                        {c.ho_va_ten}
                      </strong>
                      <span className="block text-[11.5px] text-[var(--muted)]">
                        Ngày tạo:{" "}
                        {new Date(c.ngay_tao).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-emerald-400 font-semibold font-mono text-[13px]">
                  {c.so_dien_thoai}
                </td>
                <td className="text-slate-300 text-[13.5px]">{email}</td>
                <td>
                  <div className="flex flex-wrap gap-1.5">
                    {c.du_an.length === 0 ? (
                      <span className="inline-flex items-center justify-center h-[28px] px-[10px] rounded-[999px] text-[11px] font-extrabold uppercase tracking-[0.05em] bg-[rgba(255,255,255,0.04)] text-slate-400 border border-white/5">
                        Chưa gắn
                      </span>
                    ) : (
                      c.du_an.map((proj) => (
                        <Badge
                          key={proj.ma_du_an}
                          label={proj.ten_du_an}
                          variant={getBadgeVariantForProject(proj.trang_thai)}
                          className="uppercase font-semibold tracking-wider text-[10.5px]"
                        />
                      ))
                    )}
                  </div>
                </td>
                <td className="text-[14px] font-bold text-center pl-4 text-emerald-400">
                  {c.du_an.length}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="sm"
                      className="min-h-[28px] py-1 px-3.5 rounded-[8px] text-[12px]"
                      onClick={() => handleOpenEdit(c)}
                    >
                      Sửa
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
      {/* EDIT CUSTOMER MODAL */}
      {editingCust && (
        <Modal
          title="Cập nhật thông tin khách hàng"
          kicker="KHÁCH HÀNG"
          onClose={() => setEditingCust(null)}
          widthClass="w-[min(460px,100%)]"
        >
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 text-[14px] p-1">
            <Input
              label="Họ và tên"
              name="ho_va_ten"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              required
            />
            <Input
              label="Số điện thoại"
              name="so_dien_thoai"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="VD: 0905 xxx xxx"
              required
            />
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingCust(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px]"
              >
                {isSaving ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
  </Panel>
);
};

export default TablesCustomer;
