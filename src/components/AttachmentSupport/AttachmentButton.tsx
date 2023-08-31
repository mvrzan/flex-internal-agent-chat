import { useState } from 'react';
import { Button } from '@twilio-paste/core';
import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';
import AttachmentModal from './AttachmentModal';

const AttachmentButton2 = (): React.JSX.Element => {
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
        <AttachmentModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
    </>
  );
};

export default AttachmentButton2;
