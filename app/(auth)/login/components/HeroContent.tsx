import React from "react";

const baseClass = 
"max-w-[560px] mt-[24px] text-[#cbd5e1] text-[17px] leading-[1.8]"
const HeroContent = () => {
  return (
    <div>
      <p className={`${baseClass} text-[var(--green-2]) text-[12px] font-extrabold tracking-[0.2em] uppercase `}>Tiệm ảnh êm roo</p>
      <h1 className="max-w-[680px] mt-[16px] text-[64px] leading-[1.03] tracking-[-0.06em] font-extrabold mt-[16px] mb-[24px]">
        Không gian chia sẻ ảnh <span className="text-[var(--green-2)]">riêng tư & hiện đại</span>
      </h1>
      <p className={baseClass}>
        Nền tảng quản lý album, chia sẻ ảnh, nhận phản hồi chỉnh sửa và hỗ trợ
        AI cho studio ảnh chuyên nghiệp.
      </p>
    </div>
  );
};

export default HeroContent;
