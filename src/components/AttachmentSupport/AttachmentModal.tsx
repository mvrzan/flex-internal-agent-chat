import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
} from '@twilio-paste/core/modal';
import { Button } from '@twilio-paste/core/button';
import AttachmentSupport from './AttachmentSupport';

interface ImageModalOwnProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMediaMessages: React.Dispatch<
    React.SetStateAction<FormData | undefined | []>
  >;
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
    setMediaMessages(undefined);
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
