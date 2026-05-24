import { toast } from "react-hot-toast";
import {
  IoMdClose,
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import React from "react";

export const toastNotify = {
  success: (title: string, message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } flex w-[360px] gap-3 p-4 border border-[rgba(16,185,129,0.25)] border-l-[6px] border-l-[#10b981] rounded-[18px] bg-[#07100d] shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto relative z-[999999]`}
        >
          <div className="text-[#10b981] mt-0.5 text-[22px] flex-shrink-0">
            <IoMdCheckmarkCircle />
          </div>
          <div className="flex-1 pr-5">
            <h4 className="text-[14px] font-bold text-[#f8fafc]">{title}</h4>
            <p className="text-[12px] text-[#94a3b8] mt-1 leading-normal">
              {message}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute top-3.5 right-3.5 text-[#64748b] hover:text-[#f8fafc] cursor-pointer transition-colors"
          >
            <IoMdClose size={16} />
          </button>
        </div>
      ),
      { duration: 3000 },
    );
  },
  error: (title: string, message: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          }  z-[999999] flex w-[360px] gap-3 p-4 border border-[rgba(251,113,133,0.25)] border-l-[6px] border-l-[#fb7185] rounded-[18px] bg-[#07100d] shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto relative`}
        >
          <div className="text-[#fb7185] mt-0.5 text-[22px] flex-shrink-0">
            <IoMdCloseCircle />
          </div>
          <div className="flex-1 pr-5">
            <h4 className="text-[14px] font-bold text-[#f8fafc]">{title}</h4>
            <p className="text-[12px] text-[#94a3b8] mt-1 leading-normal">
              {message}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute top-3.5 right-3.5 text-[#64748b] hover:text-[#f8fafc] cursor-pointer transition-colors"
          >
            <IoMdClose size={16} />
          </button>
        </div>
      ),
      { duration: 3000 },
    );
  },
};
