import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import FormCreateUse from "./FormCreateUse";

type CreateUserProps = {
  onStartProcess: (formData: FormData) => void;
  isProcessing: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
  };
  clearError: (field: "name" | "email" | "password") => void;
};

const CreateUser = ({
  onStartProcess,
  isProcessing,
  errors,
  clearError,
}: CreateUserProps) => {
  return (
    <Panel
      kicker="Cấp tài khoản"
      title="Tạo tài khoản thợ ảnh"
      description="Admin tạo tài khoản nội bộ cho thợ ảnh. Hệ thống sẽ tự sinh mật khẩu tạm thời sau khi tạo thành công."
    >
      <FormCreateUse
        onStartProcess={onStartProcess}
        isProcessing={isProcessing}
        errors={errors}
        clearError={clearError}
      />
    </Panel>
  );
};

export default CreateUser;
