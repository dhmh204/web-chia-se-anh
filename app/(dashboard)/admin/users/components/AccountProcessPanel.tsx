"use client";

import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import ProcessItem from "../../../components/ProcessItem";
import Notice from "@/app/(dashboard)/components/Notice";

const processList = [
  {
    step: 1,
    title: "Khai báo thông tin người dùng",
    description:
      " Nhập đầy đủ thông tin cơ bản và vai trò của người dùng trong hệ thống.",
  },
  {
    step: 2,
    title: " Xác thực dữ liệu",
    description:
      " Hệ thống kiểm tra email, số điện thoại và tính hợp lệ của thông tin đã nhập.",
  },
  {
    step: 3,
    title: " Cấu hình tài khoản đăng nhập",
    description:
      "  Thiết lập mật khẩu ban đầu hoặc cho phép hệ thống tự sinh mật khẩu tạm thời.",
  },
  {
    step: 4,
    title: " Kích hoạt tài khoản",
    description: " Tài khoản được cấp quyền truy cập và sẵn sàng sử dụng.",
  },
];

type AccountProcessPanelProps = {
  isRunning: boolean;
  activeStep: number;
};

const AccountProcessPanel = ({
  isRunning,
  activeStep,
}: AccountProcessPanelProps) => {
  return (
    <Panel kicker="Luồng nghiệp vụ" title="Quy trình cấp tài khoản">
      <div className="grid gap-4">
        {processList.map((item) => (
          <ProcessItem
            key={item.step}
            {...item}
            isActive={isRunning && activeStep === item.step}
          />
        ))}
      </div>
      <Notice
        description="Chỉ cấp tài khoản cho nhân sự cần sử dụng hệ thống quản trị. Các quyền
      truy cập sẽ được áp dụng theo vai trò được chọn."
      />
    </Panel>
  );
};

export default AccountProcessPanel;
