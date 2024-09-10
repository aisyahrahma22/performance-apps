import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPositionGroupingUpload } from '../../lib/data/position/usePositionGroupingUpload';
import { getPositionGroupingDownload } from '../../lib/data/position/usePositionGroupingDownload';

const PositionGroupingUpload = () => {
  const uploadPositionGroupingRefresh = useRef<any>();
  const uploadPositionGrouping = useCallback(() => {
    uploadPositionGroupingRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Position Grouping
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPositionGroupingUpload}
        downloadFormatFetcher={getPositionGroupingDownload}
        onUploadSuccess={uploadPositionGrouping}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.MD_POSITION_GROUPING_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_POSITION_GROUPING}
          ref={uploadPositionGroupingRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PositionGroupingUpload;
