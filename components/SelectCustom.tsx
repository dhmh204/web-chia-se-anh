"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import { IoMdArrowDropdown } from "react-icons/io";

type SelectOption = {
  value: string;
  name: string;
};

type SelectCustomProps = {
  values: SelectOption[];
  name?: string;
  label?: string;
  onHiddenChange?: (hidden: boolean) => void;
};

const SelectCustom = ({
  values,
  name = "role",
  label = "Vai trò",
  onHiddenChange,
}: SelectCustomProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption>(values[0]);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSelect = (item: SelectOption) => {
    setSelected(item);
    setIsOpen(false);

    const isHidden = item.name === "MANUAL";
    onHiddenChange?.(isHidden);
  };
  return (
    <div ref={selectRef}>
      <Input label={label} type="hidden" name={name} value={selected.name} />
      <div className="relative">
        <button
          type="button"
          className="w-full h-[48px] px-[16px] border border-[var(--line)] rounded-[15px] bg-[var(--field-bg)] text-[var(--text)] 
          flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]
          focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selected.value}</span>
          <IoMdArrowDropdown
            className={`text-[var(--green-2)] duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 p-[8px] border border-[rgba(16,185,129,0.25)] rounded-[16px] bg-[#07100d] shadow-[0_18px_48px_rgba(0,0,0,0.48)] grid gap-[6px]">
            {values.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full min-h-[42px] px-[12px] rounded-[12px] bg-transparent text-[#d1d5db] text-left duration-200 hover:bg-[rgba(16,185,129,0.12)] hover:text-[var(--green-2)] cursor-pointer"
              >
                {item.value}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCustom;
