import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import FormCreateCustomer from "./FormCreateCustomer";

type CreateCustomerProps = {
  projects: { value: string; name: string }[];
};

const CreateCustomer = ({ projects }: CreateCustomerProps) => {
  return (
    <Panel
      kicker="Lưu trữ thông tin"
      title="Tạo khách hàng mới"
      description="Lưu trữ thông tin liên hệ và dự án đã thực hiện để dễ thống kê, quản lý nội bộ."
    >
      <FormCreateCustomer projects={projects} />
    </Panel>
  );
};

export default CreateCustomer;

