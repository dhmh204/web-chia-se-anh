import React from "react";
import Button from "@/components/Button";
import { Filter } from "lucide-react";

type AlbumSearchBarProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

/**
 *     width: 100%;
    height: 50px;

    width: 280px;
    height: 44px;
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 0 14px;
    background: rgba(255, 255, 255, .035);
    color: var(--text);
    outline: none;
 */

export const AlbumSearchBar = ({
  searchQuery,
  setSearchQuery,
}: AlbumSearchBarProps) => {
  return (
    <div className="my-[18px] grid grid-cols-[1fr_auto_auto] gap-[12px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm theo ngữ nghĩa: cô dâu cưới, nhóm bạn, váy đỏ..."
        className=" text-[14px] font-light w-full h-[50px] border border-[var(--line)] bg-[rgba(255,255,255,0.035)] rounded-[14px] p-[0_14px] text-[var(--text)] outline-none text-[inherit]   focus:border-[var(--line-green)]
      focus:bg-[rgba(255,255,255,0.055)]"
      />
      <Button
        variant="secondary"
        className="min-h-[48px] rounded-[15px] px-5 text-[14px] font-bold"
      >
        <Filter size={15} />
        Lọc ảnh
      </Button>
    </div>
  );
};
