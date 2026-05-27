import Panel from "@/app/(dashboard)/components/Panel";
import { STATUS_OPTIONS } from "./types";
import { getStatusPercent } from "./utils";

type Props = {
    status: string;
};

const ProjectStatusPanel = ({ status }: Props) => {
    const currentStatusLabel =
        STATUS_OPTIONS.find((s) => s.name === status)?.value || "Mới";

    return (
        <Panel kicker="TIẾN ĐỘ" title="Trạng thái hiện tại">
            <div className="flex flex-col gap-4 mt-2 items-center text-center p-3">
                <span className="text-[13px] text-slate-400 block font-medium">
                    TIẾN ĐỘ DỰ ÁN
                </span>

                <strong className="text-[20px] text-white tracking-tight uppercase font-extrabold">
                    {currentStatusLabel}
                </strong>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-1">
                    <div
                        className="bg-[#10b981] h-full rounded-full transition-all duration-500"
                        style={{
                            width: getStatusPercent(status),
                        }}
                    />
                </div>
            </div>
        </Panel>
    );
};

export default ProjectStatusPanel;