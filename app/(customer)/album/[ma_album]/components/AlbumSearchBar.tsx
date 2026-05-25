import React from "react";
import { Search, Filter } from "lucide-react";
import Button from "@/components/Button";

type AlbumSearchBarProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export const AlbumSearchBar = ({
  searchQuery,
  setSearchQuery,
}: AlbumSearchBarProps) => {
  return (
    <div className="flex gap-3 mb-8">
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo ngữ nghĩa: cô dâu cưới, nhóm bạn, váy đỏ..."
          className="w-full h-[48px] pl-12 pr-4 rounded-[15px] bg-[#060a0d] border border-[var(--line)] text-white text-[14px] placeholder-slate-600 outline-none focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] transition-all duration-200"
        />
      </div>
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
