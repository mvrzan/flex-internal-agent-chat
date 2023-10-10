import { PasteCustomCSS } from '@twilio-paste/core/customization';

const customPasteElements = {
  FLEX_WITH_OVERFLOW: {
    overflowY: 'auto',
  },
  BUTTON_WITH_PADDING: {
    padding: 'space30',
  },
  BUTTON_WITHOUT_BORDERS: {
    boxShadow: 'none',
  },
  FLEX_PINNED_CHATS: {
    marginLeft: 'spaceNegative40',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  BUTTON_PINNED_CHATS: {
    width: '40px',
    height: '40px',
    padding: 'space0',
    borderRadius: 'borderRadiusCircle',
    boxShadow: 'none',
    marginTop: 'space10',
  },
  TEXT_AREA_SIZE_ELEMENT: {
    maxHeight: '76px',
    overflowX: 'hidden',
  },
  BADGE_PINNED_CHATS: {
    boxShadow: 'none',
    fontSize: 'fontSize10',
    marginLeft: 'spaceNegative20',
    alignItems: 'unset',
    padding: 'space0',
    background: 'none',
  },
} as { [key: string]: PasteCustomCSS };

export default customPasteElements;
