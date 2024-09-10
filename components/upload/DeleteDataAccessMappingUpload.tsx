import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postDataAccessMappingDelete } from '../../lib/data/dataAccessMapping/useDataAccessMappingDeleteUpload';
import { getDataAccessMappingDownloadDelete } from '../../lib/data/dataAccessMapping/useDataAccessMappingDownloadDelete';

const DeleteDataAccessMappingUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);

  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Delete Data Access Upload
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postDataAccessMappingDelete}
        downloadFormatFetcher={getDataAccessMappingDownloadDelete}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.DATA_ACCESS_MAPPING_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.DATA_ACCESS_MAPPING_DELETE}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default DeleteDataAccessMappingUpload;
