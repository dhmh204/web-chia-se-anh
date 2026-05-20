import React from "react";

interface ProcessItemProps {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const ProcessItem = ({
  step,
  title,
  description,
  isActive = false,
}: ProcessItemProps) => {
  const classActive =
    "!border-[rgba(16,185,129,0.35)] !bg-[rgba(16,185,129,0.08)]";

  return (
    <div
      className={`flex items-center gap-3.5 p-4 border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,0.035)] ${isActive ? classActive : ""}`}
      data-step={step}
    >
      <div className="w-[38px] h-[38px] flex-shrink-0 grid place-items-center text-[var(--green-2)] font-black border-[1px] border-[rgba(16,185,129,0.35)] rounded-[14px] bg-[rgba(16,185,129,0.12)]">
        {step}
      </div>
      <div>
        <h3 className="text-[15px] font-bold">{title}</h3>
        <p className="text-[13px] text-[var(--muted)] ">{description}</p>
      </div>
    </div>
  );
};

export default ProcessItem;
