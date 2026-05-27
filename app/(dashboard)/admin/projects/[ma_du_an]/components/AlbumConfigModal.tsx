import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import SelectCustom from "@/components/SelectCustom";
import { AlbumSummary } from "./types";

type Props = {
    album: AlbumSummary;
    albumName: string;
    albumType: string;
    albumDownload: boolean;
    isSaving: boolean;
    onChangeAlbumName: (value: string) => void;
    onChangeAlbumType: (value: string) => void;
    onChangeAlbumDownload: (value: boolean) => void;
    onClose: () => void;
    onSave: () => void;
};

const AlbumConfigModal = ({
    album,
    albumName,
    albumType,
    albumDownload,
    isSaving,
    onChangeAlbumName,
    onChangeAlbumType,
    onChangeAlbumDownload,
    onClose,
    onSave,
}: Props) => {
    return (
        <Modal title="Cấu hình album" onClose={onClose}>
            <div className="flex flex-col gap-4 p-1">
                <Input
                    label="Tên album"
                    value={albumName}
                    onChange={(e) => onChangeAlbumName(e.target.value)}
                    required
                />

                <SelectCustom
                    label="Loại album"
                    name="configAlbumType"
                    values={[
                        { value: "Ảnh gốc", name: "ANH_GOC" },
                        { value: "Hậu kỳ", name: "HAU_KY" },
                        { value: "Final", name: "CUOI_CUNG" },
                    ]}
                    value={albumType}
                    onChange={onChangeAlbumType}
                />

                <div className="flex items-center justify-between p-3.5 border border-white/5 bg-white/[0.02] rounded-[16px] mt-2">
                    <div>
                        <span className="text-[13.5px] text-white font-bold block">
                            Cho phép tải hình ảnh
                        </span>

                        <span className="text-[11.5px] text-slate-400 block mt-0.5">
                            Khách hàng được quyền tải ảnh chất lượng gốc về máy.
                        </span>
                    </div>

                    <input
                        type="checkbox"
                        checked={albumDownload}
                        onChange={(e) => onChangeAlbumDownload(e.target.checked)}
                        className="w-[20px] h-[20px] accent-[#10b981] cursor-pointer rounded-[6px]"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                    >
                        Hủy
                    </Button>

                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-[#10b981] text-white"
                    >
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AlbumConfigModal;