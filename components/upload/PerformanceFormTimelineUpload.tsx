import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import InputFile from '../InputFile';
import { postTimelineUpload } from '../../lib/data/performanceForm/useTimelineUpload';
import { getTimelineDownload } from '../../lib/data/performanceForm/useTimelineDowload';

const PerformanceFormTimelineUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Timeline & Sequence
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postTimelineUpload}
        downloadFormatFetcher={getTimelineDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.PERF_PROGRAM_TIMELINE_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.PERF_PROGRAM_TIMELINE}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceFormTimelineUpload;
