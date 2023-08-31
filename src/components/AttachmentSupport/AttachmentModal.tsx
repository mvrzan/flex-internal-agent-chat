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
  setNewMediaMessage: React.Dispatch<React.SetStateAction<string>>;
  setMediaMessages: React.Dispatch<React.SetStateAction<string>>;
}

const modalHeadingID: string = 'attachment-modal-heading';

const AttachmentModal = ({
  modalOpen,
  setModalOpen,
  setNewMediaMessage,
  setMediaMessages,
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
        <AttachmentSupport
          setNewMediaMessage={setNewMediaMessage}
          setMediaMessages={setMediaMessages}
        />
      </ModalBody>
    </Modal>
  );
};

export default AttachmentModal;
