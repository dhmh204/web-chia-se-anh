"use client";

import DatePickerInput from "@/components/DatePickerInput";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import MultiSelectCustom from "@/components/MultiSelectCustom";
import ImageUploadInput from "@/components/ImageUploadInput";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ModalInforProject from "./ModalInforProject";

const STATUS_OPTIONS = [
  { value: "Mới", name: "MOI" },
  { value: "Đang chọn", name: "DANG_CHON" },
  { value: "Đang sửa", name: "DANG_SUA" },
  { value: "Hoàn thành", name: "HOAN_THANH" },
];

type ProjectSummaryData = {
  tenDuAn: string;
  khachHang: string;
  ngayChup: string;
  thoAnh: string;
  trangThai: string;
};

type FormCreateProjectsProps = {
  onSuccess?: (newProject: { ma_du_an: string; ten_du_an: string }) => void;
  onValuesChange?: (values: ProjectSummaryData) => void;
  defaultCustomerPhone?: string;
  defaultCustomerName?: string;
  hideCustomerFields?: boolean;
};

const FormCreateProjects = ({
  onSuccess,
  onValuesChange,
  defaultCustomerPhone = "",
  defaultCustomerName = "",
  hideCustomerFields = false,
}: FormCreateProjectsProps = {}) => {
  const router = useRouter();
  const [successData, setSuccessData] = useState<{
    ten_du_an: string;
    ten_khach_hang: string;
    so_dien_thoai: string;
    ngay_chup: string;
    ma_du_an: string;
    mat_khau: string | null;
  } | null>(null);

  const [formKey, setFormKey] = useState(0);
  const [telPhone, setTelPhone] = useState(defaultCustomerPhone);
  const [nameCustomer, setNameCustomer] = useState(defaultCustomerName);
  const [nameProject, setNameProject] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [trangThai, setTrangThai] = useState("MOI");
  const [selectedPhotographers, setSelectedPhotographers] = useState<string[]>(
    [],
  );
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isPhoneChecked, setIsPhoneChecked] = useState(!!defaultCustomerPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photographers, setPhotographers] = useState<
    { value: string; name: string }[]
  >([{ value: "Đang tải danh sách...", name: "" }]);

  // Sync props to state if they change
  useEffect(() => {
    if (defaultCustomerPhone) {
      setTelPhone(defaultCustomerPhone);
      setIsPhoneChecked(true);
    }
  }, [defaultCustomerPhone]);

  useEffect(() => {
    if (defaultCustomerName) {
      setNameCustomer(defaultCustomerName);
    }
  }, [defaultCustomerName]);

  // Call onValuesChange whenever form fields change
  useEffect(() => {
    const pNames = selectedPhotographers
      .map((id) => photographers.find((p) => p.name === id)?.value)
      .filter(Boolean)
      .join(", ");

    const formattedDate = date ? date.toLocaleDateString("vi-VN") : "Chưa chọn";
    const statusLabel =
      STATUS_OPTIONS.find((o) => o.name === trangThai)?.value || "Mới";

    onValuesChange?.({
      tenDuAn: nameProject.trim() || "Chưa nhập",
      khachHang: nameCustomer.trim() || "Chưa có",
      ngayChup: formattedDate,
      thoAnh: pNames || "Chưa phân công",
      trangThai: statusLabel,
    });
  }, [
    nameProject,
    nameCustomer,
    date,
    trangThai,
    selectedPhotographers,
    photographers,
    onValuesChange,
  ]);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const res = await fetch("/api/admin/users?vai_tro=THO_ANH");
        if (res.ok) {
          const data = await res.json();
          if (data?.users) {
            const list = data.users.map((u: any) => ({
              value: u.ho_va_ten,
              name: u.ma_nguoi_dung,
            }));
            setPhotographers(
              list.length > 0
                ? list
                : [{ value: "Không có thợ ảnh nào", name: "" }],
            );
          }
        }
      } catch (err) {
        console.error("Error fetching photographers:", err);
      }
    };
    fetchPhotographers();
  }, []);

  // Debounced check for customer phone number
  useEffect(() => {
    if (hideCustomerFields) return; // Skip lookup if fields are hidden
    const cleanPhone = telPhone.trim();
    if (cleanPhone.length < 10) {
      setIsPhoneChecked(false);
      setNameCustomer("");
      return;
    }

    const checkPhone = async () => {
      setIsCheckingPhone(true);
      try {
        const res = await fetch(
          `/api/admin/customers/search?phone=${encodeURIComponent(cleanPhone)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setIsPhoneChecked(true);
          if (data.exists) {
            setNameCustomer(data.customer.ho_va_ten);
            toastNotify.success(
              "Khách hàng quen",
              `Đã tìm thấy: ${data.customer.ho_va_ten}`,
            );
          } else {
            setNameCustomer("");
            toastNotify.success(
              "Khách hàng mới",
              "Số điện thoại chưa có trên hệ thống. Vui lòng điền tên mới.",
            );
          }
        } else {
          setIsPhoneChecked(false);
          setNameCustomer("");
        }
      } catch (err) {
        console.error("Error checking phone:", err);
        setIsPhoneChecked(false);
        setNameCustomer("");
      } finally {
        setIsCheckingPhone(false);
      }
    };

    const timer = setTimeout(() => {
      checkPhone();
    }, 450); // 450ms debounce

    return () => clearTimeout(timer);
  }, [telPhone, hideCustomerFields]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const nameProjectVal = (formData.get("nameProject") as string)?.trim();
    const dateVal = formData.get("date") as string;
    const phoneVal = (formData.get("telPhone") as string)?.trim() || telPhone;
    const custVal =
      (formData.get("nameCustomer") as string)?.trim() || nameCustomer;
    const photographersSelected = formData.getAll("photographer") as string[];
    const activePhotographers = photographersSelected.filter(
      (id) => id.trim() !== "",
    );

    if (!nameProjectVal) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập tên dự án");
      return;
    }
    if (!dateVal) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn ngày chụp");
      return;
    }
    if (phoneVal.trim().length < 10) {
      toastNotify.error(
        "Lỗi nhập liệu",
        "Số điện thoại khách hàng phải từ 10 số",
      );
      return;
    }
    if (!custVal.trim()) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập tên khách hàng");
      return;
    }
    if (activePhotographers.length === 0) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn thợ ảnh phụ trách");
      return;
    }

    setIsSubmitting(true);
    try {
      // Append customer values if fields are hidden and not automatically in Form
      if (hideCustomerFields) {
        formData.set("telPhone", phoneVal);
        formData.set("nameCustomer", custVal);
      }

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toastNotify.success(
          "Thành công",
          data.message || "Tạo dự án mới thành công!",
        );

        if (data.project) {
          setSuccessData({
            ten_du_an: data.project.ten_du_an,
            ten_khach_hang: custVal,
            so_dien_thoai: phoneVal,
            ngay_chup: date ? date.toLocaleDateString("vi-VN") : "Chưa chọn",
            ma_du_an: data.project.ma_du_an,
            mat_khau: data.project.mat_khau,
          });

          onSuccess?.({
            ma_du_an: data.project.ma_du_an,
            ten_du_an: data.project.ten_du_an,
          });
        }

        // Reset states and increment formKey to completely reset child components
        setTelPhone(defaultCustomerPhone);
        setNameCustomer(defaultCustomerName);
        setNameProject("");
        setDate(new Date());
        setTrangThai("MOI");
        setSelectedPhotographers([]);
        setIsPhoneChecked(!!defaultCustomerPhone);
        setFormKey((prev) => prev + 1);

        router.refresh();
      } else {
        toastNotify.error(
          "Thất bại",
          data.message || "Có lỗi xảy ra khi tạo dự án.",
        );
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      toastNotify.error("Lỗi kết nối", "Không thể gửi dữ liệu tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="flex flex-col gap-[16px]"
      >
        {hideCustomerFields && (
          <>
            <input type="hidden" name="telPhone" value={telPhone} />
            <input type="hidden" name="nameCustomer" value={nameCustomer} />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tên dự án"
            placeholder="Nhập tên dự án"
            name="nameProject"
            value={nameProject}
            onChange={(e) => setNameProject(e.target.value)}
            required
          />
          <DatePickerInput
            label="Ngày chụp"
            name="date"
            placeholder="Chọn ngày chụp"
            maxDate={new Date()}
            defaultValue={date || undefined}
            onChange={setDate}
          />
          {!hideCustomerFields && (
            <>
              <Input
                label="Số điện thoại"
                placeholder="VD: 0905 xxx xxx"
                name="telPhone"
                type="tel"
                value={telPhone}
                onChange={(e) => setTelPhone(e.target.value)}
                required
              />
              <Input
                label="Tên khách hàng"
                placeholder={
                  isCheckingPhone
                    ? "Đang kiểm tra số điện thoại..."
                    : !isPhoneChecked
                      ? "Vui lòng nhập số điện thoại trước..."
                      : "Nhập tên khách hàng"
                }
                name="nameCustomer"
                type="text"
                value={nameCustomer}
                onChange={(e) => setNameCustomer(e.target.value)}
                disabled={isCheckingPhone || !isPhoneChecked}
                required
              />
            </>
          )}
          <Input
            label="Mật khẩu dự án"
            placeholder="Nhập mật khẩu truy cập (tùy chọn)"
            name="mat_khau"
            type="text"
          />
          <SelectCustom
            label="Trạng thái dự án"
            name="trang_thai"
            values={STATUS_OPTIONS}
            value={trangThai}
            onChange={setTrangThai}
          />
        </div>
        <MultiSelectCustom
          label="Thợ ảnh phụ trách"
          name="photographer"
          values={photographers}
          value={selectedPhotographers}
          onChange={setSelectedPhotographers}
        />

        <ImageUploadInput
          label="Ảnh bìa dự án (link_anh_bia)"
          name="link_anh_bia"
        />
        <div className="flex flex-col gap-[7px]">
          <label
            htmlFor="note"
            className="text-[#d1d5db] text-[13px] font-semibold"
          >
            Ghi chú
          </label>
          <textarea
            name="note"
            id="note"
            placeholder="VD: Khách thích chụp tone ấm,..."
            className={`h-[116px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px]  outline-none 
                      transition-all duration-200 focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]`}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang tạo dự án..." : "Tạo dự án"}
        </Button>
      </form>

      {successData && (
        <ModalInforProject
          successData={successData}
          onClose={() => setSuccessData(null)}
        />
      )}
    </>
  );
};

export default FormCreateProjects;
