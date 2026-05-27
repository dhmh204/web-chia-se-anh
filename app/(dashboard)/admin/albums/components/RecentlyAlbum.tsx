"use client";

import React, { useState, useEffect } from "react";
import RecentlyAlbItem, { AlbumWithProject } from "./RecentlyAlbItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type RecentlyAlbumProps = {
  albums?: AlbumWithProject[];
  role?: "admin" | "photographer";
};


const RecentlyAlbum = ({ albums, role = "admin" }: RecentlyAlbumProps) => {
  const displayAlbums = albums || [];
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(displayAlbums.length / itemsPerPage);

  // Auto-reset page if albums change and page is out of bounds
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [displayAlbums, totalPages, currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (displayAlbums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-center">
        <p className="text-[var(--muted)] text-[14px]">Chưa có album nào được tạo gần đây.</p>
      </div>
    );
  }

  // Chunk items into pages
  const pages: AlbumWithProject[][] = [];
  for (let i = 0; i < displayAlbums.length; i += itemsPerPage) {
    pages.push(displayAlbums.slice(i, i + itemsPerPage));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Navigation Controls */}
      <div className="flex justify-between items-center">
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(16,185,129,0.12)] hover:border-[var(--line-green)] disabled:opacity-30 disabled:cursor-not-allowed hover:translate-y-[-1px]"
              disabled={currentPage === 0}
              title="Trang trước"
            >
              <FaChevronLeft size={12} />
            </button>
            <span className="text-[13px] text-[var(--muted)] font-medium px-2 min-w-[50px] text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(16,185,129,0.12)] hover:border-[var(--line-green)] disabled:opacity-30 disabled:cursor-not-allowed hover:translate-y-[-1px]"
              disabled={currentPage === totalPages - 1}
              title="Trang sau"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Slide Container */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageItems, pageIdx) => (
            <div
              key={pageIdx}
              className="w-full flex-shrink-0 grid grid-cols-3 gap-6"
            >
              {pageItems.map((album) => (
                <div key={album.ma_album} className="h-full">
                  <RecentlyAlbItem album={album} role={role} />
                </div>
              ))}
              {/* Pad last page if there are fewer than 3 items to preserve grid spacing */}
              {pageItems.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - pageItems.length }).map(
                  (_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="h-full opacity-0 pointer-events-none"
                    />
                  ),
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentPage === index
                ? "w-6 bg-[var(--green)]"
                : "w-2 bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.35)]"
                }`}
              title={`Tới trang ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAlbum;
