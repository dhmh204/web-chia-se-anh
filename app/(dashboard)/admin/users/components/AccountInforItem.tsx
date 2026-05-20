import React from "react";
type AccountInforItemProps = {
  title: string;
  value: string;
};

const AccountInforItem = ({ title, value }: AccountInforItemProps) => {
  return (
    <div className="flex justify-between gap-[18px] p-3.5 border border-[var(--line)] rounded-[16px] bg-[rgba(255,255,255,0.04)]">
      <span className="text-[var(--muted)] text-[13px]">{title}</span>
      <strong className="text-right text-[14px]">{value}</strong>
    </div>
  );
};

export default AccountInforItem;
