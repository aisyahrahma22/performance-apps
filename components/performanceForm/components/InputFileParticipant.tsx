import {
  Button,
  Checkbox,
  Grid,
  Header,
  List,
  Modal,
  Progress,
  SemanticICONS,
  Image,
  Icon,
} from 'semantic-ui-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import useFetch from '../../../lib/data/_useFetch';
import { forEach, isEmpty } from 'lodash';
import getFileSize from '../../../lib/util/getFileSize';

type File = {
  name: string;
  size: string;
  icon: SemanticICONS;
};

type InputFileParticipantProps = {
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
  isCheckbox?: boolean;
};

const MAP_FILE_ICON: any = {
  'application/excel': 'file excel',
  'application/zip': 'file archive',
  // TODO: add more icon mapper
};

const InputFileParticipant = ({
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
  isCheckbox,
}: InputFileParticipantProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [blobFiles, setBlobFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsChecked(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

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

  const _onUploadPress = useCallback(() => {
    if (needExtraBody && !extraBody) return;
    fetch(
      blobFiles,
      (progressEvent: ProgressEvent) => {
        setUploadProgress(
          Math.round((100 * progressEvent.loaded) / progressEvent.total),
        );
      },
      isChecked,
    );
    setShowModal(false);
    setIsChecked(false);
  }, [fetch, blobFiles, extraBody, needExtraBody, isChecked, showModal]);

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
      <div className="body-perf-form-uploud">
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
            onClick={openModal}
            icon={'upload'}
            content={uploadButtonText || 'Upload'}
            size={'small'}
            compact
          />
        )}
        {isCheckbox && files.length > 0 && (
          <span className="perf-form-uploud">
            <label className="label-form-uploud">
              Overwrite Existing Participant
            </label>
            <Checkbox
              toggle
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </span>
        )}
        <input
          multiple={multiple}
          ref={fileInput as any}
          type="file"
          hidden
          onChange={onFileChange}
          accept={accept}
        />
      </div>
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
      <Modal open={showModal} onClose={closeModal} size="tiny">
        {/* <Modal.Header>
          <Header as={'h4'}>
            <Header.Content>
              Performance Participant Uploud
              <Header.Subheader>Configuration</Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header> */}
        <Modal.Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Header as={'h4'}>
                  <Header.Content>
                    Performance Participant Uploud
                    <Header.Subheader>Configuration</Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Button
                  onClick={closeModal}
                  icon={
                    <div>
                      <Image
                        src={'/icons/newClose.svg'}
                        width="90%"
                        height={20}
                      />
                    </div>
                  }
                  compact
                  floated="right"
                  size={'tiny'}
                  style={{
                    background: '#FFFFFF',
                    marginTop: '-5px',
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Header>
        <Modal.Content>
          <div className="wrap-icon-form-uploud">
            <Icon
              className="icon-form-uploud"
              name={'warning circle'}
              size="massive"
            />
          </div>
          {isChecked ? (
            <span>
              You’ve configured{' '}
              <span style={{ fontWeight: 'bold' }}>
                overwrite existing participant = true
              </span>{' '}
              in the template. If an employee-performance form combination
              already exists, this will remove all of the employee’s progress in
              the form. Are you sure you wish to proceed?
            </span>
          ) : (
            <span>
              You’ve configured{' '}
              <span style={{ fontWeight: 'bold' }}>
                overwrite existing participant = false
              </span>{' '}
              in the template. If an employee-performance form combination
              already exist, it will be skipped. Are you sure you wish to
              proceed?
            </span>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column></Grid.Column>
              <Grid.Column>
                <Button size="small" onClick={closeModal} fluid floated="right">
                  No
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  color="purple"
                  size="small"
                  onClick={_onUploadPress}
                  fluid
                  floated="right"
                  disabled={isLoading}
                >
                  Yes
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default InputFileParticipant;
