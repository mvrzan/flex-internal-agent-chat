import { useMemo, useState } from 'react';
import { SkeletonLoader } from '@twilio-paste/core';

const MediaMessage = ({ mediaUrl = '', mediaType = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageLoadHandler = () => {
    setImageLoaded(true);
  };

  const imageViewer = useMemo(
    () => (
      <div style={{ cursor: 'pointer' }}>
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={mediaUrl}
            alt={mediaType}
            width="450px"
            style={{ borderRadius: '8px' }}
            onLoad={imageLoadHandler}
          />
        </a>
      </div>
    ),
    [mediaUrl, mediaType]
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
      {!imageLoaded && <SkeletonLoader width="350px" height="350px" />}
      {mediaType?.startsWith('image')
        ? imageViewer
        : mediaType?.startsWith('audio')
        ? audioPlayer
        : mediaType?.startsWith('video')
        ? videoPlayer
        : mediaType?.startsWith('application')
        ? pdfViewer
        : ''}
    </>
  );
};

export default MediaMessage;
