import { useState } from 'react';
import { Button } from '@twilio-paste/core';
import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';
import AttachmentModal from './AttachmentModal';

interface AttachmentButtonOwnProps {
  setMediaMessages: React.Dispatch<React.SetStateAction<string>>;
  setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => Promise<void>;
}

const AttachmentButton = ({
  setMediaMessages,
  setIsButtonDisabled,
  sendMessage,
}: AttachmentButtonOwnProps): React.JSX.Element => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const clickHandler = (): void => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <Button
        variant="secondary_icon"
        onClick={clickHandler}
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        onFocus={() => {
          setHovered(true);
        }}
        onBlur={() => {
          setHovered(false);
        }}
        element="BUTTON_WITH_PADDING"
      >
        <AttachIcon
          decorative={false}
          title="attach"
          color={hovered ? 'colorTextPrimary' : 'colorText'}
        />
      </Button>
      {modalOpen && (
        <AttachmentModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setMediaMessages={setMediaMessages}
          setIsButtonDisabled={setIsButtonDisabled}
          sendMessage={sendMessage}
        />
      )}
    </>
  );
};

export default AttachmentButton;
