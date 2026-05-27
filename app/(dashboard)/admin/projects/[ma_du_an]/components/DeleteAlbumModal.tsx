import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { AlbumSummary } from "./types";

type Props = {
    album: AlbumSummary;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteAlbumModal = ({ album, onClose, onConfirm }: Props) => {
    return (
        <Modal
            title="Xác nhận xóa album"
            kicker="CẢNH BÁO"
            onClose={onClose}
            widthClass="w-[min(440px,100%)]"
        >
            <div className="flex flex-col gap-4 text-[14px] p-1">
                <p className="text-slate-300 leading-relaxed">
                    Bạn có chắc chắn muốn xóa album{" "}
                    <strong className="text-white">"{album.ten_alb}"</strong>?
                </p>

                <p className="text-red-400/90 text-[12px] leading-relaxed">
                    * Hành động này không thể hoàn tác. Mọi hình ảnh và nhận xét trong
                    album này cũng sẽ bị xóa vĩnh viễn khỏi Cloudinary và hệ thống.
                </p>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700"
                    >
                        Đồng ý xóa
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteAlbumModal;