import { useState } from 'react';
import { Button } from '@twilio-paste/core';
import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';
import AttachmentModal from './AttachmentModal';

interface AttachmentButtonOwnProps {
  setNewMediaMessage: React.Dispatch<React.SetStateAction<string>>;
  setMediaMessages: React.Dispatch<React.SetStateAction<string>>;
}

const AttachmentButton2 = ({
  setNewMediaMessage,
  setMediaMessages,
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
          setNewMediaMessage={setNewMediaMessage}
          setMediaMessages={setMediaMessages}
        />
      )}
    </>
  );
};

export default AttachmentButton2;
