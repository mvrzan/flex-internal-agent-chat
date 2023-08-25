import { useRef, useState } from 'react';
import { Button } from '@twilio-paste/core';
import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';

interface AttachmentButtonOwnProps {
  setNewMediaMessage: React.Dispatch<React.SetStateAction<string>>;
  setMediaMessages: React.Dispatch<React.SetStateAction<string>>;
}

const AttachmentButton = ({ setNewMediaMessage, setMediaMessages }: any) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);

  const clickHandler = (): void => {
    return hiddenFileInput.current === null
      ? undefined
      : hiddenFileInput.current.click();
  };

  const uploadFileHandler = (e: any) => {
    const formData = new FormData();
    Array.from(e.target.files).forEach((file: any) => {
      formData.append('file', file);
      setMediaMessages((prevState: any) => [...prevState, file.name]);
    });
    setNewMediaMessage(formData);
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
          onChange={uploadFileHandler}
          ref={hiddenFileInput}
        />
      </label>
    </Button>
  );
};

export default AttachmentButton;
