import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPositionGroupingTypeUpload } from '../../lib/data/position/usePositionGroupingTypeUpload';
import { getPositionGroupingTypeDownload } from '../../lib/data/position/usePositionGroupingTypeDownload';

const PositionGroupingTypeUpload = () => {
  const uploadPositionGroupingTypeRefresh = useRef<any>();
  const uploadPositionGroupingType = useCallback(() => {
    uploadPositionGroupingTypeRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Position Grouping Type
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPositionGroupingTypeUpload}
        downloadFormatFetcher={getPositionGroupingTypeDownload}
        onUploadSuccess={uploadPositionGroupingType}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.MD_POSITION_GROUPING_TYPE_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_POSITION_GROUPING_TYPE}
          ref={uploadPositionGroupingTypeRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PositionGroupingTypeUpload;
