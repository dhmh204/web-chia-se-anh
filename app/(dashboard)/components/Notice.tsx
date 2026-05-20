import React from "react";

type NoticeProps = {
  title?: string;
  description: string;
};

const Notice = ({ title = "Lưu ý", description }: NoticeProps) => {
  return (
    <div className="mt-[18px] p-[18px] border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.08)] rounded-[18px]">
      <h3 className="mb-2 text-[var(--green-2)] text-[15px] font-bold">
        {title}
      </h3>
      <p className="text-[rgb(203,213,225)] text-[13px] leading-1.6">
        {description}
      </p>
    </div>
  );
};

export default Notice;
