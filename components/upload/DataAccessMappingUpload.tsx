import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postDataAccessMappingUpload } from '../../lib/data/dataAccessMapping/useDataAccessMappingUpload';
import { getDataAccessMappingDownload } from '../../lib/data/dataAccessMapping/useDataAccessMappingDownload';

const DataAccessMappingUpload = () => {
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
        uploadFetcher={postDataAccessMappingUpload}
        downloadFormatFetcher={getDataAccessMappingDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.DATA_ACCESS_MAPPING_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.DATA_ACCESS_MAPPING}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default DataAccessMappingUpload;
