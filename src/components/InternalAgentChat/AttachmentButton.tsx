import { useRef, useState } from 'react';
import { Button } from '@twilio-paste/core';
import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';

const AttachmentButton = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);

  const clickHandler = (): void => {
    return hiddenFileInput.current === null
      ? undefined
      : hiddenFileInput.current.click();
  };

  return (
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
      <label style={{ margin: '-2px' }} htmlFor="file-upload">
        <input
          type="file"
          id="file-upload"
          multiple
          style={{ display: 'none', border: 'none' }}
          ref={hiddenFileInput}
        />
      </label>
    </Button>
  );
};

export default AttachmentButton;
