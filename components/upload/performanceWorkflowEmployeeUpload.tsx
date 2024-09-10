import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import InputFile from '../InputFile';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPerformanceWorkflowEmployeeUpload } from '../../lib/data/performanceWorkflowEmployee/usePerformanceWorkflowEmployeeUpload';
import { getPerformanceWorkflowEmployeeDownload } from '../../lib/data/performanceWorkflowEmployee/usePerformanceWorkflowEmployeeDownload';

const PerformanceWorkflowEmplyeeUpload = () => {
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
        uploadFetcher={postPerformanceWorkflowEmployeeUpload}
        downloadFormatFetcher={getPerformanceWorkflowEmployeeDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.PERF_WORKFLOW_EMP_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.PERF_WORKFLOW_EMPLOYEE}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceWorkflowEmplyeeUpload;
