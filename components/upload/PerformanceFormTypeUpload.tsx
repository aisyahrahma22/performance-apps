import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { getFilePerformanceForm } from '../../lib/data/performanceFormType/usePerformanceFormTypeDownload ';
import { postPerformanceFormTypeUpload } from '../../lib/data/performanceFormType/usePerformanceFormTypeUpload';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';

const PerformanceFormTypeUpload = () => {
  const uploadFormSuccessRefresh = useRef<any>();
  const uploadFormSuccess = useCallback(() => {
    uploadFormSuccessRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Form
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceFormTypeUpload}
        downloadFormatFetcher={getFilePerformanceForm}
        onUploadSuccess={uploadFormSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.MD_PERF_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERFORMANCE_FORM_TYPE_UPLOAD}
          ref={uploadFormSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceFormTypeUpload;
