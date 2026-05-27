import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import MultiSelectCustom from "@/components/MultiSelectCustom";
import DatePickerInput from "@/components/DatePickerInput";
import { STATUS_OPTIONS } from "./types";

type Props = {
    editName: string;
    setEditName: (value: string) => void;

    editDate: Date | null;
    setEditDate: (value: Date | null) => void;

    editPhone: string;
    setEditPhone: (value: string) => void;

    editCustName: string;
    setEditCustName: (value: string) => void;

    editPassword: string;
    setEditPassword: (value: string) => void;

    editStatus: string;
    setEditStatus: (value: string) => void;

    editNote: string;
    setEditNote: (value: string) => void;

    editPhotographers: string[];
    setEditPhotographers: (value: string[]) => void;

    photographers: { name: string; value: string }[];

    isSavingProject: boolean;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
};

const ProjectEditForm = ({
    editName,
    setEditName,
    editDate,
    setEditDate,
    editPhone,
    setEditPhone,
    editCustName,
    setEditCustName,
    editPassword,
    setEditPassword,
    editStatus,
    setEditStatus,
    editNote,
    setEditNote,
    editPhotographers,
    setEditPhotographers,
    photographers,
    isSavingProject,
    onCancel,
    onSubmit,
}: Props) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Tên dự án"
                    placeholder="Nhập tên dự án"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                />

                <DatePickerInput
                    label="Ngày chụp"
                    name="ngay_chup"
                    placeholder="Chọn ngày chụp"
                    defaultValue={editDate || undefined}
                    onChange={setEditDate}
                />

                <Input
                    label="Số điện thoại khách hàng"
                    placeholder="Nhập số điện thoại"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                />

                <Input
                    label="Tên khách hàng"
                    placeholder="Nhập tên khách"
                    value={editCustName}
                    onChange={(e) => setEditCustName(e.target.value)}
                    required
                />

                <Input
                    label="Mật khẩu truy cập dự án"
                    placeholder="Nhập mật khẩu (tùy chọn)"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                />

                <SelectCustom
                    label="Trạng thái dự án"
                    name="editStatus"
                    values={STATUS_OPTIONS}
                    value={editStatus}
                    onChange={setEditStatus}
                />
            </div>

            <MultiSelectCustom
                label="Thợ ảnh phụ trách"
                name="editPhotographers"
                values={photographers}
                value={editPhotographers}
                onChange={setEditPhotographers}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-[#d1d5db] text-[13px] font-semibold">
                    Ghi chú
                </label>

                <textarea
                    placeholder="Nhập ghi chú cho thợ ảnh..."
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="h-[80px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px] outline-none focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]"
                />
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
                >
                    Hủy
                </Button>

                <Button
                    type="submit"
                    disabled={isSavingProject}
                    className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-[#10b981] text-white"
                >
                    {isSavingProject ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </div>
        </form>
    );
};

export default ProjectEditForm;