import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { getPositionPathDownload } from '../../lib/data/position/usePositionPathDownload';
import { postPositionPathUpload } from '../../lib/data/position/usePositionPathUpload';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';

const PositionPathUpload = () => {
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
        downloadFormatFetcher={getPositionPathDownload}
        uploadFetcher={postPositionPathUpload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.MD_POSITION_PATH_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.MD_POSITION_PATH}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PositionPathUpload;
