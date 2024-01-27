import React from 'react';

import { Box } from '@twilio-paste/core/box';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
} from '@twilio-paste/core/modal';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Button } from '@twilio-paste/core/button';
import { DownloadIcon } from '@twilio-paste/icons/esm/DownloadIcon';
import { LinkExternalIcon } from '@twilio-paste/icons/esm/LinkExternalIcon';

interface ImageModalOwnProps {
  url: string;
  mediaType: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalHeadingID = 'modal-heading';

const ImageModal = ({
  url,
  mediaType,
  modalOpen,
  setModalOpen,
}: ImageModalOwnProps) => {
  const closeHandler = () => {
    setModalOpen(!modalOpen);
  };

  const fetchImage = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  };

  const downloadImage = async (url: string) => {
    const imageBlob = await fetchImage(url);
    const imageBase64 = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');

    link.style.setProperty('display', 'none');
    document.body.appendChild(link);
    link.download = 'chat_file';
    link.href = imageBase64;
    link.click();
    link.remove();
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom="space70"
        >
          <a href={url} download target="_blank" rel="noreferrer">
            <img src={url} alt="attachment" style={{ maxWidth: '50rem' }} />
          </a>
        </Box>
        <Stack orientation="horizontal" spacing="space30">
          <Stack orientation="horizontal" spacing="spaceNegative30">
            <Button
              variant="secondary"
              onClick={() => {
                downloadImage(url);
              }}
            >
              <DownloadIcon decorative />
              <Text as="span" fontWeight="fontWeightBold">
                {mediaType === 'image/gif' ? 'Download GIF' : 'Download image'}
              </Text>
            </Button>
          </Stack>
          <Stack orientation="horizontal" spacing="spaceNegative30">
            <Button as="a" variant="secondary" href={url}>
              <LinkExternalIcon decorative />
              <Text as="span" fontWeight="fontWeightBold">
                Open in new tab
              </Text>
            </Button>
          </Stack>
        </Stack>
      </ModalBody>
    </Modal>
  );
};

export default ImageModal;
