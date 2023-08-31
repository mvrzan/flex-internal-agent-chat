import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
} from '@twilio-paste/core';
import AttachmentSupport from './AttachmentSupport';

interface ImageModalOwnProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalHeadingID: string = 'attachment-modal-heading';

const AttachmentModal = ({
  modalOpen,
  setModalOpen,
}: ImageModalOwnProps): React.JSX.Element => {
  const closeHandler = (): void => {
    setModalOpen(!modalOpen);
  };

  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      isOpen={modalOpen}
      onDismiss={closeHandler}
      size="default"
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Upload Files
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <AttachmentSupport />
      </ModalBody>
    </Modal>
  );
};

export default AttachmentModal;
