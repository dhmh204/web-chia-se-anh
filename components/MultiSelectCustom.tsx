"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

type SelectOption = {
  value: string;
  name: string;
};

type MultiSelectCustomProps = {
  values: SelectOption[];
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string[];
  onChange?: (selected: string[]) => void;
};

const MultiSelectCustom = ({
  values,
  name = "photographer",
  label = "Thợ ảnh phụ trách",
  placeholder = "Chọn thợ ảnh phụ trách...",
  value,
  onChange,
}: MultiSelectCustomProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption[]>(() => {
    if (value !== undefined) {
      return values.filter((v) => value.includes(v.name));
    }
    return [];
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync selected list if values change (e.g., loaded dynamically)
  useEffect(() => {
    if (value !== undefined) {
      setSelected(values.filter((v) => value.includes(v.name)));
      return;
    }
    if (values && values.length > 0) {
      setSelected((prev) =>
        prev.filter((p) => values.some((v) => v.name === p.name)),
      );
    }
  }, [values, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (item: SelectOption) => {
    if (!item.name) return; // Ignore placeholders like "Loading..."

    setSelected((prev) => {
      const exists = prev.some((s) => s.name === item.name);
      let nextSelected;
      if (exists) {
        nextSelected = prev.filter((s) => s.name !== item.name);
      } else {
        nextSelected = [...prev, item];
      }
      onChange?.(nextSelected.map((s) => s.name));
      return nextSelected;
    });
  };

  const displayText =
    selected.length > 0
      ? selected.map((item) => item.value).join(", ")
      : placeholder;

  return (
    <div ref={containerRef} className="flex flex-col gap-[8px]">
      {label && (
        <label className="text-[13px] font-bold text-[var(--text-muted)] tracking-[0.02em]">
          {label}
        </label>
      )}

      {/* Render hidden inputs for standard Form submission */}
      {selected.map((item) => (
        <input key={item.name} type="hidden" name={name} value={item.name} />
      ))}

      {/* If no items are selected, render an empty hidden input so the name key exists in FormData */}
      {selected.length === 0 && (
        <input type="hidden" name={name} value="" />
      )}

      <div className="relative">
        <button
          type="button"
          className="w-full h-[48px] px-[16px] border border-[var(--line)] rounded-[15px] bg-[var(--field-bg)] text-[var(--text)] 
          flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]
          focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate mr-[8px]">{displayText}</span>
          <IoMdArrowDropdown
            className={`text-[var(--green-2)] shrink-0 duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 p-[8px] border border-[rgba(16,185,129,0.25)] rounded-[16px] bg-[#07100d] shadow-[0_18px_48px_rgba(0,0,0,0.48)] grid gap-[6px] max-h-[250px] overflow-y-auto">
            {values.map((item, i) => {
              const isSel = selected.some((s) => s.name === item.name);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="w-full min-h-[42px] px-[12px] rounded-[12px] bg-transparent text-[#d1d5db] text-left duration-200 hover:bg-[rgba(16,185,129,0.12)] hover:text-[var(--green-2)] flex items-center gap-[12px] cursor-pointer"
                >
                  {item.name ? (
                    <input
                      type="checkbox"
                      checked={isSel}
                      readOnly
                      className="w-4 h-4 rounded border-[var(--line)] bg-[var(--field-bg)] text-[var(--green-2)] focus:ring-[var(--line-green)] accent-[var(--green-2)] cursor-pointer shrink-0"
                    />
                  ) : null}
                  <span className="text-[14px] truncate">{item.value}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectCustom;
