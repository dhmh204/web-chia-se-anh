import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = ({
  label,
  name,
  type = "text",
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-[7px]">
      <label
        htmlFor={name}
        className="text-[#d1d5db] text-[13px] font-semibold"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] h-[48px] px-[14px]  outline-none 
                    transition-all duration-200 focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]
                      ${
                        error
                          ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                          : "border-[var(--line)] focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                      } ${className || ""}
                    `}
        {...props}
      />{" "}
      {error && <p className="mt-[6px] text-[13px] text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
