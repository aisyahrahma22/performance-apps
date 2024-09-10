import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPerformanceWorkflowPositionUpload } from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPositionUpload';
import { getPerformanceWorkflowPositionDownload } from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPositionDownload';

const PerformanceWorkflowPositionUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
  <div style={{marginTop: '15px'}}>
      <Header as="h4" color={'blue'}>
        Upload Principal Assignment by Position Form
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceWorkflowPositionUpload}
        downloadFormatFetcher={getPerformanceWorkflowPositionDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <UploadProgress
          type={UploadProgressTypeEnum.PERF_WORKFLOW_POSITION}
          ref={uploadSuccessRefresh}
        />
  </div>
  );
};

export default PerformanceWorkflowPositionUpload;
