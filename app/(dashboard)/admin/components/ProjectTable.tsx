import Button from "@/components/Button";
import Badge from "@/components/Badge";
import React from "react";

const titleTable = [
  {
    id: 1,
    title: "Dự án",
  },
  {
    id: 2,
    title: "Thợ ảnh",
  },
  {
    id: 3,
    title: "Album",
  },
  {
    id: 4,
    title: "Trạng thái",
  },
  {
    id: 5,
    title: "",
  },
];

const ProjectTable = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {titleTable.map((item) => (
            <th
              className="text-[var(--muted)] font-semibold text-[12px] uppercase tracking-[0.08em]"
              key={item.id}
            >
              {item.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kỷ yếu 12A1</td>
          <td>Minh Anh</td>
          <td>Ảnh gốc, Hậu kỳ</td>
          <td>
            <Badge variant="editing" label="Đang sửa" />
          </td>
          <td>
            <Button variant="sm">Chi tiết</Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ProjectTable;
