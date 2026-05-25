import React from "react";
import Image from "next/image";
import { Users } from "lucide-react";

export type FaceGroup = {
  ma_nhom: string;
  ten_nhan_vat: string;
  anh_dai_dien: string;
  photoIds: string[];
};

type PeopleGridProps = {
  faces: FaceGroup[];
  onSelectPerson: (id: string) => void;
};

export const PeopleGrid = ({ faces, onSelectPerson }: PeopleGridProps) => {
  if (faces.length === 0) {
    return (
      <div className="text-center py-20 bg-[var(--surface-2)] border border-[var(--line)] rounded-[28px] p-8 max-w-xl mx-auto backdrop-blur-md">
        <Users size={44} className="mx-auto text-[var(--muted-2)] mb-3" />
        <p className="text-[var(--text)] font-extrabold text-[16px]">
          Không tìm thấy khuôn mặt nào
        </p>
        <p className="text-[var(--muted)] text-[13px] mt-1">
          Chưa có khuôn mặt nào được phân tách trong album này.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {faces.map((person) => (
        <div
          key={person.ma_nhom}
          onClick={() => onSelectPerson(person.ma_nhom)}
          className="group border border-[var(--line)] rounded-[22px] bg-[var(--surface-2)] p-5 text-center cursor-pointer hover:border-[var(--line-green)] hover:-translate-y-1 transition-all duration-300 shadow-md"
        >
          <div className="w-[84px] h-[84px] rounded-full overflow-hidden relative mx-auto border-2 border-slate-800 group-hover:border-[var(--green)] transition-colors duration-300">
            <Image
              src={person.anh_dai_dien || "/images/example.jpg"}
              alt={person.ten_nhan_vat}
              fill
              className="object-cover"
            />
          </div>
          <h4 className="text-white font-extrabold text-[14px] mt-3 truncate group-hover:text-[var(--green-2)] transition-colors duration-200">
            {person.ten_nhan_vat}
          </h4>
          <p className="text-[12px] text-[var(--muted)] mt-1 font-semibold">
            {person.photoIds.length} ảnh
          </p>
        </div>
      ))}
    </div>
  );
};
