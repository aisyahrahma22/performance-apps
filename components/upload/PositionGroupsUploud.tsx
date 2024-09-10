import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPositionGroupsUpload } from '../../lib/data/position/usePositionGroupsUpload';
import { getPositionGroupsDownload } from '../../lib/data/position/usePositionGroupsDownload';

const PositionGroupsUpload = () => {
  const uploadPositionGroupsRefresh = useRef<any>();
  const uploadPositionGroups = useCallback(() => {
    uploadPositionGroupsRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Position Groups
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPositionGroupsUpload}
        downloadFormatFetcher={getPositionGroupsDownload}
        onUploadSuccess={uploadPositionGroups}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.MD_POSITION_GROUPS_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_POSITION_GROUPS}
          ref={uploadPositionGroupsRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PositionGroupsUpload;
