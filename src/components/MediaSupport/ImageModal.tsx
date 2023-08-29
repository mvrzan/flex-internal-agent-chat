import {
  Box,
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
} from '@twilio-paste/core';

interface ImageModalOwnProps {
  url: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalHeadingID = 'modal-heading';

const ImageModal = ({ url, modalOpen, setModalOpen }: ImageModalOwnProps) => {
  const closeHandler = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      isOpen={modalOpen}
      onDismiss={closeHandler}
      size="wide"
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Image
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Box display="flex" alignItems="center" justifyContent="center">
          <img src={url} alt="attachment" style={{ maxWidth: '50rem' }} />
        </Box>
      </ModalBody>
    </Modal>
  );
};

export default ImageModal;
