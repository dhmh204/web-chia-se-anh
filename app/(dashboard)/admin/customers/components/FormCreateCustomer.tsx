"use client";

import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import FormCreateProjects from "@/app/(dashboard)/admin/projects/components/FormCreateProjects";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type FormCreateCustomerProps = {
  projects: { value: string; name: string }[];
};

const defaultOption = { value: "Không liên kết dự án", name: "" };

const FormCreateCustomer = ({ projects }: FormCreateCustomerProps) => {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectList, setProjectList] = useState(() => [
    defaultOption,
    ...projects,
  ]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Sync projects list when server props update
  useEffect(() => {
    setProjectList([defaultOption, ...projects]);
  }, [projects]);

  const handleProjectCreated = (newProj: {
    ma_du_an: string;
    ten_du_an: string;
  }) => {
    setProjectList((prev) => [
      ...prev,
      { value: newProj.ten_du_an, name: newProj.ma_du_an },
    ]);
    setSelectedProject(newProj.ma_du_an);
    setIsCreateProjectOpen(false);
    toastNotify.success(
      "Liên kết tự động",
      `Đã chọn dự án mới: ${newProj.ten_du_an}`,
    );
  };

  const handleOpenCreateProject = () => {
    const nameInput = document.getElementsByName(
      "ho_va_ten",
    )[0] as HTMLInputElement;
    const phoneInput = document.getElementsByName(
      "so_dien_thoai",
    )[0] as HTMLInputElement;

    const name = nameInput?.value?.trim() || "";
    const phone = phoneInput?.value?.trim() || "";

    if (!name) {
      toastNotify.error(
        "Lỗi nhập liệu",
        "Vui lòng nhập họ tên khách hàng trước",
      );
      return;
    }
    if (!phone) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập số điện thoại trước");
      return;
    }
    if (phone.length < 10) {
      toastNotify.error(
        "Lỗi nhập liệu",
        "Số điện thoại khách hàng phải từ 10 số",
      );
      return;
    }

    setCustomerName(name);
    setCustomerPhone(phone);
    setIsCreateProjectOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const nameVal = (formData.get("ho_va_ten") as string)?.trim();
    const phoneVal = (formData.get("so_dien_thoai") as string)?.trim();

    if (!nameVal) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập họ tên khách hàng");
      return;
    }
    if (!phoneVal) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập số điện thoại");
      return;
    }
    if (phoneVal.length < 10) {
      toastNotify.error("Lỗi nhập liệu", "Số điện thoại phải từ 10 số");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ho_va_ten: nameVal,
          so_dien_thoai: phoneVal,
          ma_du_an: selectedProject || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success(
          "Thành công",
          data.message || "Tạo khách hàng mới thành công!",
        );
        setFormKey((prev) => prev + 1);
        setSelectedProject("");
        setCustomerName("");
        setCustomerPhone("");
        router.refresh();
      } else {
        toastNotify.error("Thất bại", data.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      console.error(err);
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Họ tên"
            placeholder="Nhập họ tên"
            name="ho_va_ten"
            required
          />
          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            name="so_dien_thoai"
            type="tel"
            required
          />
        </div>

        <div className="flex items-end gap-[10px]">
          <div className="flex-1">
            <SelectCustom
              label="Liên kết dự án"
              name="ma_du_an"
              values={projectList}
              value={selectedProject}
              onChange={(val) => setSelectedProject(val)}
            />
          </div>
          <button
            type="button"
            onClick={handleOpenCreateProject}
            className="w-[48px] h-[48px] rounded-[15px] border border-[var(--line)] bg-[rgba(255,255,255,.04)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.12)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[20px]"
            title="Tạo dự án mới"
          >
            +
          </button>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? "Đang lưu..." : "Lưu khách hàng"}
        </Button>
      </form>

      {isCreateProjectOpen && (
        <Modal
          onClose={() => setIsCreateProjectOpen(false)}
          title="Tạo dự án mới"
          kicker="Dự án"
        >
          <FormCreateProjects
            onSuccess={handleProjectCreated}
            defaultCustomerPhone={customerPhone}
            defaultCustomerName={customerName}
            hideCustomerFields={true}
          />
        </Modal>
      )}
    </>
  );
};

export default FormCreateCustomer;
