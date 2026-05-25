import React from "react";
import { FolderOpen } from "lucide-react";
import { AlbumCard, AlbumSummary } from "./AlbumCard";

type AlbumsGridProps = {
  albums: AlbumSummary[];
};

export const AlbumsGrid = ({ albums }: AlbumsGridProps) => {
  return (
    <main className="max-w-6xl mx-auto px-6 w-full mt-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[var(--green)] rounded-full" />
        <h2 className="text-[20px] font-extrabold text-[var(--text)] tracking-tight">
          Danh sách Album ảnh của bạn
        </h2>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-24 bg-[var(--surface-2)] border border-[var(--line)] rounded-[28px] p-8 max-w-xl mx-auto backdrop-blur-md shadow-lg">
          <FolderOpen size={44} className="mx-auto text-[var(--muted-2)] mb-4 animate-bounce" />
          <p className="text-[var(--text)] font-extrabold text-[17px] tracking-tight">
            Chưa có album nào
          </p>
          <p className="text-[var(--muted)] text-[13.5px] mt-1.5 max-w-[360px] mx-auto leading-relaxed">
            Dự án này chưa có Album ảnh nào được tạo. Vui lòng quay lại sau khi thợ ảnh tải ảnh lên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <AlbumCard key={album.ma_album} album={album} />
          ))}
        </div>
      )}
    </main>
  );
};
