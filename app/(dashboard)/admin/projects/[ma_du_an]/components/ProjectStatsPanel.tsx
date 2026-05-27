import { FaCommentDots, FaImages } from "react-icons/fa";
import Panel from "@/app/(dashboard)/components/Panel";
import { ProjectStats } from "./types";

type Props = {
    stats: ProjectStats;
};

const ProjectStatsPanel = ({ stats }: Props) => {
    return (
        <Panel kicker="SỐ LIỆU" title="Thống kê dự án">
            <div className="flex flex-col gap-3 mt-1.5">
                <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FaImages className="text-emerald-400 w-4" />
                        <span className="text-[13.5px] text-slate-300">Tổng số ảnh</span>
                    </div>
                    <strong className="text-[18px] text-white font-extrabold">
                        {stats.totalPhotos}
                    </strong>
                </div>

                <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FaCommentDots className="text-emerald-400 w-4" />
                        <span className="text-[13.5px] text-slate-300">Tổng phản hồi</span>
                    </div>
                    <strong className="text-[18px] text-white font-extrabold">
                        {stats.totalFeedback}
                    </strong>
                </div>

                <div className="p-3.5 border border-white/5 bg-white/[0.01] rounded-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FaCommentDots className="text-amber-400 w-4" />
                        <span className="text-[13.5px] text-slate-300">Phản hồi chưa sửa</span>
                    </div>
                    <strong className="text-[18px] text-amber-400 font-extrabold">
                        {stats.pendingFeedback}
                    </strong>
                </div>
            </div>
        </Panel>
    );
};

export default ProjectStatsPanel;