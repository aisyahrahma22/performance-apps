import { Button, List, Progress, SemanticICONS } from 'semantic-ui-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import useFetch from '../lib/data/_useFetch';
import { forEach, isEmpty } from 'lodash';
import getFileSize from '../lib/util/getFileSize';

type File = {
  name: string;
  size: string;
  icon: SemanticICONS;
};

type InputFileProps = {
  multiple?: boolean;
  uploadFetcher?: any;
  downloadFormatFetcher?: any;
  onUploadSuccess?: any;
  accept?: string;
  needExtraBody?: boolean;
  extraBody?: any;
  uploadButtonText?: string;
  hideUploadButton?: boolean;
  navigateUpload?: boolean;
  checkFiles?: (data: any) => void;
};

const MAP_FILE_ICON: any = {
  'application/excel': 'file excel',
  'application/zip': 'file archive',
  // TODO: add more icon mapper
};

const InputFile = ({
  multiple = false,
  uploadFetcher,
  downloadFormatFetcher,
  onUploadSuccess,
  accept,
  needExtraBody = false,
  extraBody,
  uploadButtonText,
  hideUploadButton,
  navigateUpload,
  checkFiles,
}: InputFileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [blobFiles, setBlobFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (navigateUpload) {
      _onUploadPress();
    }
  }, [navigateUpload]);

  useEffect(() => {
    if (checkFiles) {
      checkFiles(files);
    }
  }, [files, checkFiles]);

  const onError = useCallback((error) => {
    toast.error(
      error.response?.data?.message ||
        'Something wrong when uploading your file',
    );
  }, []);

  const { data, isLoading, fetch } = useFetch({
    fetcher: uploadFetcher,
    onError,
  });

  const fileInput = useRef<HTMLInputElement>();

  const onFileChange = useCallback(
    (e) => {
      const files = [...e.target.files];
      const currentFiles: File[] = [];
      forEach(files, (file) => {
        currentFiles.push({
          name: file.name,
          size: getFileSize(file.size),
          icon: MAP_FILE_ICON[file.type] || 'file',
        });
      });
      if (!multiple) {
        setFiles(currentFiles);
        setBlobFiles(files);
      } else {
        setFiles((lastFiles) => [...lastFiles, ...currentFiles]);
        setBlobFiles((lastBlobFiles) => [...lastBlobFiles, ...files]);
      }
      e.target.value = null;
    },
    [multiple],
  );

  const onAddFilePress = useCallback(() => {
    fileInput.current?.click();
  }, [fileInput]);

  const onRemoveFilePress = useCallback(
    (index) => () => {
      setFiles((files) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        return newFiles;
      });
      setBlobFiles((blobFiles) => {
        const newBlobFiles = [...blobFiles];
        newBlobFiles.splice(index, 1);
        return newBlobFiles;
      });
    },
    [],
  );

  const onRemoveAllFile = useCallback(() => {
    setFiles([]);
    setBlobFiles([]);
  }, []);

  const _onUploadPress = useCallback(() => {
    if (needExtraBody && !extraBody) return;
    fetch(
      blobFiles,
      (progressEvent: ProgressEvent) => {
        setUploadProgress(
          Math.round((100 * progressEvent.loaded) / progressEvent.total),
        );
      },
      extraBody,
    );
  }, [fetch, blobFiles, extraBody, needExtraBody]);

  const [addFileText, addFileIcon] = useMemo(() => {
    return files.length > 0
      ? multiple
        ? ['Add More File', 'plus']
        : ['Change File', 'exchange']
      : ['Choose File', 'hand lizard'];
  }, [multiple, files]);

  useEffect(() => {
    if (data) {
      if (onUploadSuccess) {
        onUploadSuccess(data);
      } else {
        toast.success('Successfully upload your files');
      }
      setFiles([]);
      setBlobFiles([]);
    }
  }, [onUploadSuccess, data]);

  return (
    <>
      <Button
        disabled={isLoading}
        loading={isLoading}
        onClick={onAddFilePress}
        icon={addFileIcon}
        content={addFileText}
        basic
        size={'small'}
        compact
      />
      {downloadFormatFetcher && (
        <Button
          onClick={downloadFormatFetcher}
          icon={'download'}
          content={'Download Format'}
          basic
          size={'small'}
          compact
        />
      )}
      {!isEmpty(files) && !hideUploadButton && (
        <Button
          primary
          disabled={isLoading}
          loading={isLoading}
          onClick={_onUploadPress}
          icon={'upload'}
          content={uploadButtonText || 'Upload'}
          size={'small'}
          compact
        />
      )}
      {files.length > 1 && (
        <Button
          disabled={isLoading}
          loading={isLoading}
          onClick={onRemoveAllFile}
          icon={'trash'}
          content={'Remove All'}
          basic
          size={'small'}
          compact
          // floated={'right'}
        />
      )}
      <input
        multiple={multiple}
        ref={fileInput as any}
        type="file"
        hidden
        onChange={onFileChange}
        accept={accept}
      />
      <List relaxed selection>
        {files.map((file, index) => (
          <List.Item key={`${index}-${file.name}`}>
            <List.Content floated="right" verticalAlign={'middle'}>
              <Button
                onClick={onRemoveFilePress(index)}
                icon={'close'}
                basic
                compact
                size={'mini'}
                disabled={isLoading}
                loading={isLoading}
              />
            </List.Content>
            <List.Icon name={file.icon} size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header>{file.name}</List.Header>
              <List.Description>{file.size}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} size={'tiny'} indicating />
      )}
    </>
  );
};

export default InputFile;
