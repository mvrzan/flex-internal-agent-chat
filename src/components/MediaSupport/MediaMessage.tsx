import { useMemo, useState } from 'react';
import {
  SkeletonLoader,
  Box,
  Stack,
  Button,
  Text,
  Flex,
} from '@twilio-paste/core';
import ImageModal from './ImageModal';
import { DownloadIcon } from '@twilio-paste/icons/esm/DownloadIcon';
import { LinkExternalIcon } from '@twilio-paste/icons/esm/LinkExternalIcon';

interface MediaMessageOwnProps {
  mediaUrl: string;
  mediaType: string;
}

const MediaMessage = ({
  mediaUrl = '',
  mediaType = '',
}: MediaMessageOwnProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const imageLoadingHandler = () => {
    if (loading) {
      setLoading(false);
    }
  };

  const openModalHandler = () => {
    setModalOpen(!modalOpen);
  };

  const fetchFile = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  };

  const downloadFileHandler = async (url: string) => {
    const fileBlob = await fetchFile(url);
    const imageBase64 = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');

    link.style.setProperty('display', 'none');
    document.body.appendChild(link);
    link.download = 'chat_file';
    link.href = imageBase64;
    link.click();
    link.remove();
  };

  const imageViewer = useMemo(
    () => (
      <div style={{ cursor: 'pointer' }}>
        {loading && <SkeletonLoader width="300px" height="300px" />}
        <img
          onLoad={imageLoadingHandler}
          src={mediaUrl}
          alt={mediaType}
          width="450px"
          style={{
            borderRadius: '8px',
          }}
          loading="lazy"
          onClick={openModalHandler}
        />
      </div>
    ),
    [mediaUrl, mediaType, loading]
  );

  const audioPlayer = useMemo(
    () => (
      <Box
        borderRadius="borderRadius30"
        backgroundColor="colorBackgroundPrimaryWeaker"
        padding="space30"
      >
        <Flex
          vAlignContent="center"
          hAlignContent="center"
          marginBottom="space30"
        >
          <audio controls>
            <source src={mediaUrl} type={mediaType} />
          </audio>
        </Flex>
        <Stack orientation="horizontal" spacing="space30">
          <Stack orientation="horizontal" spacing="spaceNegative30">
            <Button
              variant="secondary"
              onClick={() => {
                downloadFileHandler(mediaUrl);
              }}
            >
              <DownloadIcon decorative />
              <Text as="span" fontWeight="fontWeightBold">
                Download file
              </Text>
            </Button>
          </Stack>
          <Stack orientation="horizontal" spacing="spaceNegative30">
            <Button as="a" variant="secondary" href={mediaUrl}>
              <LinkExternalIcon decorative />
              <Text as="span" fontWeight="fontWeightBold">
                Open in new tab
              </Text>
            </Button>
          </Stack>
        </Stack>
      </Box>
    ),
    [mediaUrl, mediaType]
  );

  const videoPlayer = useMemo(
    () => (
      <Box
        borderRadius="borderRadius30"
        backgroundColor="colorBackgroundPrimaryWeaker"
        padding="space30"
        width="50%"
      >
        <Flex
          vAlignContent="center"
          hAlignContent="center"
          marginBottom="space30"
        >
          <video width="100%" controls>
            <source src={mediaUrl} type={mediaType} />
          </video>
        </Flex>
        <Flex vAlignContent="center" hAlignContent="center">
          <Stack orientation="horizontal" spacing="space30">
            <Stack orientation="horizontal" spacing="spaceNegative30">
              <Button
                variant="secondary"
                onClick={() => {
                  downloadFileHandler(mediaUrl);
                }}
              >
                <DownloadIcon decorative />
                <Text as="span" fontWeight="fontWeightBold">
                  Download file
                </Text>
              </Button>
            </Stack>
            <Stack orientation="horizontal" spacing="spaceNegative30">
              <Button as="a" variant="secondary" href={mediaUrl}>
                <LinkExternalIcon decorative />
                <Text as="span" fontWeight="fontWeightBold">
                  Open in new tab
                </Text>
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    ),
    [mediaUrl, mediaType]
  );

  const pdfViewer = useMemo(
    () => (
      <Box
        borderRadius="borderRadius30"
        backgroundColor="colorBackgroundPrimaryWeaker"
        padding="space30"
        width="50%"
      >
        <Flex
          vAlignContent="center"
          hAlignContent="center"
          marginBottom="space30"
        >
          <iframe title="PDF Preview" src={mediaUrl} width="100%" />
        </Flex>
        <Flex vAlignContent="center" hAlignContent="center">
          <Stack orientation="horizontal" spacing="space30">
            <Stack orientation="horizontal" spacing="spaceNegative30">
              <Button
                variant="secondary"
                onClick={() => {
                  downloadFileHandler(mediaUrl);
                }}
              >
                <DownloadIcon decorative />
                <Text as="span" fontWeight="fontWeightBold">
                  Download file
                </Text>
              </Button>
            </Stack>
            <Stack orientation="horizontal" spacing="spaceNegative30">
              <Button as="a" variant="secondary" href={mediaUrl}>
                <LinkExternalIcon decorative />
                <Text as="span" fontWeight="fontWeightBold">
                  Open in new tab
                </Text>
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    ),
    [mediaUrl]
  );

  return (
    <>
      {mediaType?.startsWith('image')
        ? imageViewer
        : mediaType?.startsWith('audio')
        ? audioPlayer
        : mediaType?.startsWith('video')
        ? videoPlayer
        : mediaType?.startsWith('application')
        ? pdfViewer
        : ''}
      <ImageModal
        url={mediaUrl}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default MediaMessage;
