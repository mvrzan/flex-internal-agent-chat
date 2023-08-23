import { AttachIcon } from '@twilio-paste/icons/esm/AttachIcon';

const AttachmentButton = ({ hovered }: any) => {
  return (
    <label style={{ cursor: 'pointer' }}>
      <input
        type="file"
        id="file-input"
        multiple
        style={{ display: 'none', border: 'none' }}
      />
      <AttachIcon
        decorative={false}
        title="attach"
        color={hovered ? 'colorTextPrimary' : 'colorText'}
      />
    </label>
  );
};

export default AttachmentButton;
