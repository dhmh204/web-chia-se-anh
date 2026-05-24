import React from "react";

type TableProps = {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Table = ({ headers, children, className = "", id }: TableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table id={id} className={`w-full border-collapse ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-[var(--muted)] font-semibold text-[12px] uppercase tracking-[0.08em]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
