import {
  FileUploader,
  FileUploaderLabel,
  FileUploaderHelpText,
  FileUploaderDropzoneText,
  FileUploaderDropzone,
  FileUploaderItemsList,
  FileUploaderItem,
  FileUploaderItemTitle,
  FileUploaderItemDescription,
  ScreenReaderOnly,
} from '@twilio-paste/core';
import { useState, useEffect } from 'react';
import { DownloadIcon } from '@twilio-paste/icons/esm/DownloadIcon';

const sampleFiles = [
  {
    variant: 'default',
    title: 'File1.png',
    description: '9.2 MB',
    id: 'initial-file-0',
  },
  {
    variant: 'loading',
    title: 'File2.png',
    description: 'Uploading...',
    id: 'initial-file-1',
  },
];

const AttachmentSupport = () => {
  const [screenReaderText, setScreenReaderText] = useState('');
  const [files, setFiles] = useState(sampleFiles);

  useEffect(() => {
    const timer = setTimeout(() => {
      let finishedFiles = '';

      setFiles(prev => {
        const updatedFiles: any = [];
        prev.forEach(file => {
          if (file.variant === 'loading') {
            file.variant = 'default';
            const size = Math.floor(Math.random() * (50 - 1 + 1) + 1);
            file.description = size + ' ' + 'MB';
            finishedFiles = finishedFiles + ' ' + file.title;
          }
          updatedFiles.push(file);
        });
        return updatedFiles;
      });

      if (finishedFiles.length > 0) {
        setScreenReaderText('Finished uploading: ' + finishedFiles);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [files, setFiles]);

  const handleInputChange = (event: any) => {
    const { files: newFiles } = event.target;
    let newFilesNames = '';

    if (newFiles !== null) {
      Array.from(newFiles).forEach(({ name }: any) => {
        newFilesNames = newFilesNames + ' ' + name;
        setFiles(prev => {
          return [
            ...prev,
            {
              title: name,
              description: 'Uploading...',
              variant: 'loading',
              id: name,
            },
          ];
        });
      });
    }

    if (newFilesNames.length > 1) {
      setScreenReaderText('uploading: ' + newFilesNames);
    }
  };

  const handleDragEnter = (event: any) => {
    const { items } = event.dataTransfer;
    setScreenReaderText('Dragging ' + items.length + ' files');
  };

  const handleDragLeave = (event: any) => {
    const { items } = event.dataTransfer;
    setScreenReaderText('Cancelled dragging ' + items.length + ' files');
  };

  const handleDrop = (event: any) => {
    const { files: newFiles } = event.dataTransfer;
    setScreenReaderText('Dropped ' + newFiles.length + ' files');

    if (newFiles !== null) {
      Array.from(newFiles).forEach(({ name }: any) => {
        setFiles(prev => {
          return [
            ...prev,
            {
              title: name,
              description: 'Uploading...',
              variant: 'loading',
              id: name,
            },
          ];
        });
      });
    }
  };

  return (
    <>
      <FileUploader name="Default File Uploader">
        <FileUploaderHelpText>
          Select files you would like to send
        </FileUploaderHelpText>
        <FileUploaderDropzone
          multiple
          acceptedMimeTypes={[
            'image/*',
            'application/pdf',
            'video/*',
            'audio/*',
          ]}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onInputChange={handleInputChange}
        >
          <FileUploaderDropzoneText>
            Browse for files or drag them here
          </FileUploaderDropzoneText>
        </FileUploaderDropzone>
        <FileUploaderItemsList>
          {files.map(({ variant, title, description, id }) => (
            <FileUploaderItem
              //@ts-ignore
              variant={variant}
              key={id}
              fileIcon={<DownloadIcon decorative />}
              onButtonClick={() => {
                setFiles(prev => {
                  return prev.filter(file => file.id !== id);
                });
              }}
            >
              <FileUploaderItemTitle>{title}</FileUploaderItemTitle>
              <FileUploaderItemDescription>
                {description}
              </FileUploaderItemDescription>
            </FileUploaderItem>
          ))}
        </FileUploaderItemsList>
      </FileUploader>
      <ScreenReaderOnly aria-live="assertive">
        {screenReaderText}
      </ScreenReaderOnly>
    </>
  );
};

export default AttachmentSupport;
