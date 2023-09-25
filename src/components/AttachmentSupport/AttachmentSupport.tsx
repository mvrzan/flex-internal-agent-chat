import {
  FileUploader,
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
import { useUIDSeed } from '@twilio-paste/core/uid-library';
import { DownloadIcon } from '@twilio-paste/icons/esm/DownloadIcon';

interface File {
  variant: string;
  title: string;
  description: string;
  id: string;
  size: number;
}

interface AttachmentButtonOwnProps {
  setMediaMessages: React.Dispatch<React.SetStateAction<FormData | undefined>>;
  setIsModalButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const AttachmentSupport = ({
  setMediaMessages,
  setIsModalButtonDisabled,
}: AttachmentButtonOwnProps) => {
  const [screenReaderText, setScreenReaderText] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>();
  const randomId = useUIDSeed();

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    let finishedFiles = '';

    setFiles(prev => {
      const updatedFiles: File[] = [];
      prev.forEach(file => {
        if (file.variant === 'loading') {
          file.variant = 'default';
          file.description = formatBytes(file.size);
          finishedFiles = finishedFiles + ' ' + file.title;
        }
        updatedFiles.push(file);
      });
      return updatedFiles;
    });
    if (files.length > 0) {
      setScreenReaderText('Finished uploading: ' + finishedFiles);
    }
  }, [uploadedFiles]);

  useEffect(() => {
    files.length === 0
      ? setIsModalButtonDisabled(true)
      : setIsModalButtonDisabled(false);
  }, [files]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = event.target;
    setUploadedFiles(newFiles);
    let newFilesNames = '';

    const formDataArray: FormData = new FormData();

    Array.from(newFiles!).forEach(file => {
      formDataArray.append('arr[]', file);
    });
    setMediaMessages(formDataArray);

    if (newFiles !== null) {
      Array.from(newFiles).forEach(({ name, size }) => {
        newFilesNames = newFilesNames + ' ' + name;
        setFiles(prev => {
          return [
            ...prev,
            {
              title: name,
              description: 'Uploading...',
              variant: 'loading',
              id: name,
              size,
            },
          ];
        });
      });
    }

    if (newFilesNames.length > 1) {
      setScreenReaderText('uploading: ' + newFilesNames);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    const { items } = event.dataTransfer;
    setScreenReaderText('Dragging ' + items.length + ' files');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    const { items } = event.dataTransfer;
    setScreenReaderText('Cancelled dragging ' + items.length + ' files');
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    const { files: newFiles } = event.dataTransfer;
    setUploadedFiles(newFiles);
    setScreenReaderText('Dropped ' + newFiles.length + ' files');

    let newFilesNames = '';

    const formDataArray: FormData = new FormData();

    Array.from(newFiles!).forEach(file => {
      formDataArray.append('arr[]', file);
    });
    setMediaMessages(formDataArray);

    if (newFiles !== null) {
      Array.from(newFiles).forEach(({ name, size }) => {
        newFilesNames = newFilesNames + ' ' + name;
        setFiles(prev => {
          return [
            ...prev,
            {
              title: name,
              description: 'Uploading...',
              variant: 'loading',
              id: name,
              size,
            },
          ];
        });
      });
    }
  };

  const handleRemovedItem = (id: string): void => {
    setFiles(prev => {
      return prev.filter(file => file.id !== id);
    });
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
              variant={variant as 'loading' | 'default' | 'error' | undefined}
              key={Math.random()}
              fileIcon={<DownloadIcon decorative />}
              onButtonClick={() => {
                handleRemovedItem(id);
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
