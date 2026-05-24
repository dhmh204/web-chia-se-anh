import React from "react";

type Props = {
  title: string;
  description: string;
  className?: string;
};

const CustomerManagementItem = ({ title, description, className }: Props) => {
  return (
    <div
      className={`flex items-center gap-3.5 p-4 border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.035)] pl-[15px] mb-[15px] ${className}`}
    >
      <h4 className="text-[var(--text)] text-[14px] font-bold">{title}</h4>
      <p className="mt-1 text-[13px] text-[#94a3b8]">{description}</p>
    </div>
  );
};

export default CustomerManagementItem;
