import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
  ModalFooter,
  ModalFooterActions,
  Button,
} from '@twilio-paste/core';
import AttachmentSupport from './AttachmentSupport';
import { useState } from 'react';

interface ImageModalOwnProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMediaMessages: React.Dispatch<React.SetStateAction<string>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => Promise<void>;
}

const modalHeadingID: string = 'attachment-modal-heading';

const AttachmentModal = ({
  modalOpen,
  setModalOpen,
  setMediaMessages,
  setIsButtonDisabled,
  sendMessage,
}: ImageModalOwnProps): React.JSX.Element => {
  const [isModalButtonDisabled, setIsModalButtonDisabled] =
    useState<boolean>(true);

  const closeHandler = (): void => {
    setModalOpen(!modalOpen);
    setMediaMessages('');
    setIsButtonDisabled(true);
  };

  const sendHandler = (): void => {
    setModalOpen(!modalOpen);
    sendMessage();
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
          setMediaMessages={setMediaMessages}
          setIsModalButtonDisabled={setIsModalButtonDisabled}
        />
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={sendHandler}
            disabled={isModalButtonDisabled}
          >
            Send
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default AttachmentModal;
