import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
};

const baseClass =
  "min-h-[48px] py-0 px-4 rounded-[14px] border border-[var(--line)] bg-[rgba(255,255,255,0.055)] text-[var(--text)] inline-flex items-center justify-center gap-[8px] transition-all duration-[180ms] hover:translate-y-1";

const variantClass = {
  primary:
    "border-[rgba(16,185,129,0.5)] bg-[linear-gradient(135deg,#047857,#10b981)] shadow-[0_0_34px_rgba(16,185,129,0.22)]",
  secondary:
    "bg-transparent border border-[var(--line)] text-[var(--text)] hover:border-[var(--line-green)]",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
}: ButtonProps) => {
  return (
    <button type={type} className={`${baseClass} ${variantClass[variant]} cursor-pointer`}>
      {children}
    </button>
  );
};

export default Button;

