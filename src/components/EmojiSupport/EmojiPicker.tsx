import React, { useEffect, useRef, useState } from 'react';
import { EmojiIcon } from '@twilio-paste/icons/esm/EmojiIcon';
import { createPopup } from '@picmo/popup-picker';
import { Button } from '@twilio-paste/core';

let picker: any = null;

/** This component uses PicMo, Copyright (c) 2019 Joe Attardi
 *  See license text at https://github.com/joeattardi/picmo/blob/main/LICENSE
 */

const EmojiInputAction = ({ setNewMessage }: any) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef(null);

  const addEmoji = (selectedEmoji: any) => {
    setNewMessage((prevMessage: any) => `${prevMessage} ${selectedEmoji}`);
  };

  const togglePicker = () => {
    if (picker.isOpen) picker.close();
    else picker.open();
  };

  useEffect(() => {
    let pickerOptions = {
      showPreview: false,
      emojiSize: '1.7rem',
    };
    let popupOptions = {
      referenceElement: buttonRef.current,
      triggerElement: buttonRef.current,
      position: 'bottom-start',
    };
    // @ts-ignore
    picker = createPopup(pickerOptions, popupOptions);

    picker.addEventListener('emoji:select', (event: any) => {
      setSelectedEmoji(event.emoji);
    });

    return () => {
      if (!picker) return;

      try {
        picker.destroy();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!selectedEmoji) return;

    addEmoji(selectedEmoji);

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

export default EmojiInputAction;
