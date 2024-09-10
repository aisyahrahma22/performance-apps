import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { postSuccessProfileBypassUpload } from '../../lib/data/successProfile/useSuccessProfileBypassUpload';
import { getSuccessProfileBypassDownload } from '../../lib/data/successProfile/useSuccessProfileBypassDownload';

const SuccessProfileBypassUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);

  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Form
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postSuccessProfileBypassUpload}
        downloadFormatFetcher={getSuccessProfileBypassDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <UploadProgress
        type={UploadProgressTypeEnum.SUCCESS_PROFILE_BYPASS}
        ref={uploadSuccessRefresh}
      />
    </Segment>
  );
};

export default SuccessProfileBypassUpload;
