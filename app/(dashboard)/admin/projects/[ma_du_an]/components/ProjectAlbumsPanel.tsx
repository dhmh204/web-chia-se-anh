import { FaCog, FaTrash } from "react-icons/fa";
import Button from "@/components/Button";
import Panel from "@/app/(dashboard)/components/Panel";
import { AlbumSummary } from "./types";
import { mapLoaiAlb } from "./utils";

type Props = {
    albums: AlbumSummary[];
    role: "admin" | "photographer";
    onCreateAlbum: () => void;
    onOpenConfig: (album: AlbumSummary) => void;
    onDeleteAlbum: (album: AlbumSummary) => void;
};

const ProjectAlbumsPanel = ({
    albums,
    onCreateAlbum,
    onOpenConfig,
    onDeleteAlbum,
    role = "admin"
}: Props) => {
    return (
        <Panel
            kicker="ALBUM"
            title="Danh sách album của dự án"
            description="Các thư mục ảnh riêng biệt được chia sẻ cho khách."
            textButton="Tạo album"
            onClick={onCreateAlbum}
        >
            <div className="flex flex-col gap-3 mt-2">
                {albums.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-[13.5px] border border-dashed border-white/10 rounded-[18px]">
                        Dự án này chưa có album nào. Vui lòng bấm "Tạo album" để thêm.
                    </div>
                ) : (
                    albums.map((album) => (
                        <div
                            key={album.ma_album}
                            className="p-4 border border-white/5 rounded-[18px] bg-white/[0.015] flex items-center justify-between flex-wrap gap-4"
                        >
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <strong className="text-white text-[15px] font-bold">
                                        {album.ten_alb}
                                    </strong>

                                    <span className="text-[9.5px] bg-[#10b981]/15 text-[#34d399] py-0.5 px-2 rounded-full uppercase font-bold tracking-wider">
                                        {mapLoaiAlb(album.loai_alb)}
                                    </span>
                                </div>

                                <p className="text-[12.5px] text-slate-400 mt-1 font-medium">
                                    {album.photoCount} ảnh · Tải về:{" "}
                                    <span
                                        className={
                                            album.quyen_download
                                                ? "text-emerald-400"
                                                : "text-slate-500"
                                        }
                                    >
                                        {album.quyen_download ? "Cho phép" : "Tắt"}
                                    </span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="sm"
                                    href={`/${role}/photos?ma_album=${album.ma_album}`}
                                    className="min-h-[30px] rounded-[8px]"
                                >
                                    Xem ảnh
                                </Button>

                                <button
                                    onClick={() => onOpenConfig(album)}
                                    className="p-1.5 text-slate-400 hover:text-[#10b981] hover:bg-white/5 rounded-[6px] transition-colors cursor-pointer"
                                    title="Cấu hình"
                                >
                                    <FaCog size={13} />
                                </button>

                                <button
                                    onClick={() => onDeleteAlbum(album)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-[6px] transition-colors cursor-pointer"
                                    title="Xóa album"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Panel>
    );
};

export default ProjectAlbumsPanel;