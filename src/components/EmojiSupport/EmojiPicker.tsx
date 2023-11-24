import React, { useEffect, useRef, useState, memo } from 'react';
import { EmojiIcon } from '@twilio-paste/icons/esm/EmojiIcon';
import {
  PopupPickerController,
  Position,
  createPopup,
} from '@picmo/popup-picker';
import { Button } from '@twilio-paste/core/button';

interface EmojiInputActionOwnProps {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
}

interface PopupOptions {
  referenceElement: HTMLElement | undefined;
  triggerElement: HTMLElement | undefined;
  position: Position | undefined;
}

let picker: PopupPickerController;

/** This component uses PicMo, Copyright (c) 2019 Joe Attardi
 *  See license text at https://github.com/joeattardi/picmo/blob/main/LICENSE
 */

const EmojiInputAction = ({
  setNewMessage,
  inputRef,
}: EmojiInputActionOwnProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addEmoji = (selectedEmoji: string) => {
    setNewMessage((prevMessage: string) => `${prevMessage} ${selectedEmoji}`);
  };

  const togglePicker = () => {
    picker.isOpen ? picker.close() : picker.open();
  };

  useEffect(() => {
    const popupOptions: PopupOptions = {
      referenceElement: buttonRef.current as HTMLButtonElement | undefined,
      triggerElement: buttonRef.current as HTMLButtonElement | undefined,
      position: 'bottom-start',
    };

    picker = createPopup({}, popupOptions);

    picker.addEventListener('emoji:select', event => {
      setSelectedEmoji(event.emoji);
    });

    return () => {
      if (!picker) return;

      try {
        picker.destroy();
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedEmoji) return;

    addEmoji(selectedEmoji);
    inputRef?.current?.focus();
    // reset in case user selects same emoji twice
    setSelectedEmoji(null);
  }, [selectedEmoji]);

  return (
    <Button
      ref={buttonRef}
      variant="secondary_icon"
      onClick={togglePicker}
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
    >
      <EmojiIcon
        decorative={false}
        title="Insert emoji"
        color={hovered ? 'colorTextPrimary' : 'colorText'}
      />
    </Button>
  );
};

const MemoizedEmojiInputAction = memo(EmojiInputAction);

export default MemoizedEmojiInputAction;
