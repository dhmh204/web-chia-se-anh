"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  widthClass?: string; // defaults to "w-[min(640px,100%)]"
};

const Modal = ({
  isOpen = true,
  onClose,
  title,
  kicker,
  children,
  widthClass = "w-[min(560px,100%)]",
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body & html scroll when modal is open to ensure overlay covers full 100vw/100vh
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 p-6 bg-[rgba(0,0,0,0.72)] backdrop-blur-[10px] z-[9999] flex items-center justify-center">
      <div
        className={` max-h-[90vh] overflow-y-auto no-scrollbar p-6 border border-[rgba(16,185,129,0.35)] rounded-[26px] bg-[#07100d] shadow-[0_0_90px_rgba(16,185,129,0.18)] ${widthClass}`}
      >
        <div className="flex justify-between gap-[18px] mb-5">
          <div>
            {kicker && (
              <p className="text-[var(--green-2)] text-[11px] font-extrabold tracking-[0.18em] uppercase mb-[7px]">
                {kicker}
              </p>
            )}
            <h2 className="text-[22px] font-bold mt-[6px] text-[var(--text)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="cursor-pointer flex justify-center items-center w-[38px] h-[38px] rounded-[12px] border border-[var(--line)] bg-[rgba(255,255,255,0.05)] text-[var(--text)] text-[24px] opacity-70 hover:opacity-100 duration-200"
            onClick={onClose}
          >
            <IoMdClose size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
