import { FaCalendarAlt, FaFileAlt, FaLock, FaPhone, FaUser } from "react-icons/fa";
import Panel from "@/app/(dashboard)/components/Panel";
import { ProjectSummary } from "./types";
import { formatDate } from "./utils";

type Props = {
    project: ProjectSummary;
    isEditing: boolean;
    onEdit: () => void;
    children?: React.ReactNode;
};

const ProjectInfoPanel = ({ project, isEditing, onEdit, children }: Props) => {
    const photographersText = project.su_phan_cong
        .map((p) => p.ho_va_ten)
        .join(", ");

    return (
        <Panel
            kicker="QUẢN LÝ DỰ ÁN"
            title={isEditing ? "Chỉnh sửa dự án" : project.ten_du_an}
            description={
                isEditing
                    ? "Cập nhật các thông tin cơ bản và thợ ảnh của dự án."
                    : "Thông tin chi tiết dự án ảnh chụp."
            }
            textButton={isEditing ? undefined : "Chỉnh sửa"}
            onClick={isEditing ? undefined : onEdit}
        >
            {isEditing ? (
                children
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-[14px]">
                    <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                        <FaUser className="text-emerald-500 w-4" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Khách hàng</span>
                            <strong className="text-white font-bold">
                                {project.khach_hang?.ho_va_ten || "Chưa thiết lập"}
                            </strong>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                        <FaPhone className="text-emerald-500 w-4" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Số điện thoại</span>
                            <strong className="text-white font-bold">
                                {project.khach_hang?.so_dien_thoai || "Chưa thiết lập"}
                            </strong>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                        <FaCalendarAlt className="text-emerald-500 w-4" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Ngày chụp</span>
                            <strong className="text-white font-bold">
                                {formatDate(project.ngay_chup)}
                            </strong>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px]">
                        <FaLock className="text-emerald-500 w-4" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Mật khẩu truy cập</span>
                            <strong className="text-white font-bold">
                                {project.mat_khau || "Không cài đặt (Công khai)"}
                            </strong>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] md:col-span-2">
                        <FaUser className="text-emerald-500 w-4" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Thợ ảnh phụ trách</span>
                            <strong className="text-white font-bold">
                                {photographersText || "Chưa phân công"}
                            </strong>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] md:col-span-2">
                        <FaFileAlt className="text-emerald-500 w-4 mt-0.5" />
                        <div>
                            <span className="text-[11.5px] text-slate-400 block">Ghi chú dự án</span>
                            <p className="text-slate-200 mt-1 leading-relaxed">
                                {project.ghi_chu || "Không có ghi chú nào."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Panel>
    );
};

export default ProjectInfoPanel;