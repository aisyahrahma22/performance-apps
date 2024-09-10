import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import { postPerformanceKRAUpload } from '../../lib/data/performanceKRA/usePerformanceKRAUpload';
import { getPerformanceKRADownload } from '../../lib/data/performanceKRA/usePerformanceKRADownload';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import InputFile from '../InputFile';

const PerformanceKRAUpload = () => {
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
        uploadFetcher={postPerformanceKRAUpload}
        downloadFormatFetcher={getPerformanceKRADownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.MD_PERFKRA_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERFORMANCE_KRA}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceKRAUpload;
