import { FaArrowLeft, FaCopy } from "react-icons/fa";
import Button from "@/components/Button";

type Props = {
    onBack: () => void;
    onCopyLink: () => void;
};

const ProjectTopActions = ({ onBack, onCopyLink }: Props) => {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[13.5px] font-semibold cursor-pointer"
            >
                <FaArrowLeft size={12} />
                Quay lại
            </button>

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    onClick={onCopyLink}
                    className="min-h-[38px] px-4 rounded-[11px] text-[13px] border-white/5 hover:border-emerald-500/20 text-slate-200 flex items-center gap-1.5"
                >
                    <FaCopy size={11} />
                    Copy link dự án
                </Button>
            </div>
        </div>
    );
};

export default ProjectTopActions;