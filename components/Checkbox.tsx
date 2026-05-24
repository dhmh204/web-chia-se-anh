import React from "react";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  topLabel?: string;
};

const Checkbox = ({
  label,
  topLabel,
  name,
  checked,
  onChange,
  className,
  ...props
}: CheckboxProps) => {
  return (
    <div className={`flex flex-col gap-[7px] ${className || ""}`}>
      {topLabel && (
        <span className="text-[#d1d5db] text-[13px] font-semibold">
          {topLabel}
        </span>
      )}
      <label className="flex items-center gap-[10px] cursor-pointer group select-none mt-1">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-[22px] h-[22px] rounded-[7px] border transition-all duration-200 flex items-center justify-center
              ${
                checked
                  ? "border-[var(--green)] bg-[var(--green)] shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "border-[var(--line)] bg-[rgba(255,255,255,.04)] group-hover:border-[var(--green-2)]"
              }`}
          >
            {checked && (
              <svg
                className="w-[12px] h-[12px] text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-[#d1d5db] text-[13.5px] font-semibold group-hover:text-[var(--text)] transition-colors duration-200">
          {label}
        </span>
      </label>
    </div>
  );
};

export default Checkbox;
