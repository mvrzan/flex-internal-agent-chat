import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';
import { useRef, useState } from 'react';
import { Button } from '@twilio-paste/core';

const AttachmentButton = ({}: any) => {
  const hiddenFileInput = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  const clickHandler = () => {
    console.log('clickHandler');
    return hiddenFileInput.current === null
      ? ''
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
    >
      <div
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
      >
        <label style={{ cursor: 'pointer' }} htmlFor="file-upload">
          <input
            type="file"
            id="file-upload"
            multiple
            style={{ display: 'none', border: 'none' }}
            ref={hiddenFileInput}
          />
          <AttachIcon
            decorative={false}
            title="attach"
            color={hovered ? 'colorTextPrimary' : 'colorText'}
          />
        </label>
      </div>
    </Button>
  );
};

export default AttachmentButton;
