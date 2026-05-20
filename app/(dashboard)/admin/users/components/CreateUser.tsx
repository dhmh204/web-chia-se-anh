import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import FormCreateUse from "./FormCreateUse";

const CreateUser = () => {
  return (
    <Panel
      kicker="Cấp tài khoản"
      title="Tạo tài khoản thợ ảnh"
      description="Admin tạo tài khoản nội bộ cho thợ ảnh. Hệ thống sẽ tự sinh mật khẩu tạm thời sau khi tạo thành công."
    >
        <FormCreateUse/>
    </Panel>
  );
};

export default CreateUser;
