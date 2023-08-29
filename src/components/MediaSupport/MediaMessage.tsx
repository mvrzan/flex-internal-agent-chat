import { useMemo, useState } from 'react';
import { SkeletonLoader } from '@twilio-paste/core';
import ImageModal from './ImageModal';

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
      <div>
        <audio controls>
          <source src={mediaUrl} type={mediaType} />
        </audio>
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          <div className="mt-2 align-middle ">Open in new tab</div>
        </a>
      </div>
    ),
    [mediaUrl, mediaType]
  );

  const videoPlayer = useMemo(
    () => (
      <div>
        <video width="100%" controls>
          <source src={mediaUrl} type={mediaType} />
        </video>
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          <div className="mt-2 align-middle ">Open in new tab</div>
        </a>
      </div>
    ),
    [mediaUrl, mediaType]
  );

  const pdfViewer = useMemo(
    () => (
      <div>
        <iframe title="PDF Preview" src={mediaUrl} width="100%" />
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          <div className="mt-2 align-middle ">Open in new tab</div>
        </a>
      </div>
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
