"use client";

import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import type { CustomLocale } from "flatpickr/dist/types/locale";

type DatePickerInputProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: Date;
  maxDate?: Date;
  minDate?: Date;
  error?: string;
  className?: string;
  onChange?: (date: Date | null) => void;
};

const vietnameseLocale: Partial<CustomLocale> = {
  firstDayOfWeek: 1,
  weekdays: {
    shorthand: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    longhand: [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ],
  },
  months: {
    shorthand: [
      "Th1",
      "Th2",
      "Th3",
      "Th4",
      "Th5",
      "Th6",
      "Th7",
      "Th8",
      "Th9",
      "Th10",
      "Th11",
      "Th12",
    ],
    longhand: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
  },
};

const calendarIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E\")";

const DatePickerInput = ({
  label,
  name,
  placeholder = "Chọn ngày",
  defaultValue = new Date(),
  maxDate,
  minDate,
  error,
  className = "",
  onChange,
}: DatePickerInputProps) => {
  const [date, setDate] = useState<Date | null>(defaultValue);

  return (
    <div className="flex flex-col gap-[7px]">
      <label
        htmlFor={name}
        className="text-[#d1d5db] text-[13px] font-semibold"
      >
        {label}
      </label>

      <Flatpickr
        id={name}
        name={name}
        value={date || undefined}
        placeholder={placeholder}
        onChange={(selectedDates) => {
          const selectedDate = selectedDates[0] || null;

          setDate(selectedDate);
          onChange?.(selectedDate);
        }}
        options={{
          dateFormat: "d/m/Y",
          allowInput: false,
          locale: vietnameseLocale,
          maxDate,
          minDate,
        }}
        className={`w-full border rounded-[15px] bg-[rgba(255,255,255,0.04)] text-[var(--text)] outline-none
        cursor-pointer bg-no-repeat bg-[right_14px_center] bg-[length:20px] 
        transition-[border-color,box-shadow] duration-150 ease-in-out h-[48px] px-[14px]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[rgba(255,255,255,0.02)] disabled:border-[rgba(255,255,255,0.05)]
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
            : "border-[var(--line)] focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
        }
        ${className}
        `}
        style={{
          backgroundImage: calendarIcon,
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DatePickerInput;
