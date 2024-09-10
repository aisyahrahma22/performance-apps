import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { postPositionLevelUpload } from '../../lib/data/position/usePositionLevelUpload';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { getPositionLevelDownload } from '../../lib/data/position/usePositionLevelDownload';

const PositionLevelUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);

  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Form Position Level
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        downloadFormatFetcher={getPositionLevelDownload}
        uploadFetcher={postPositionLevelUpload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.MD_POSITION_LEVEL_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.MD_POSITION_LEVEL}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PositionLevelUpload;
