import Modal from "@/components/Modal";
import FormCreateAlb from "@/app/(dashboard)/admin/albums/components/FormCreateAlb";

type Props = {
    projectId: string;
    projectName: string;
    onClose: () => void;
    onSuccess: () => void;
};

const CreateAlbumModal = ({
    projectId,
    projectName,
    onClose,
    onSuccess,
}: Props) => {
    return (
        <Modal title="Tạo album mới" onClose={onClose}>
            <FormCreateAlb
                projects={[{ value: projectName, name: projectId }]}
                defaultProjectId={projectId}
                onSuccess={onSuccess}
            />
        </Modal>
    );
};

export default CreateAlbumModal;