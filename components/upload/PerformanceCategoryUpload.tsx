import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import { postPerformanceCategoryUpload } from '../../lib/data/performanceCategory/usePerformanceCategoryUpload';
import { getPerformanceCategoryDownload } from '../../lib/data/performanceCategory/usePerformanceCategoryDownload';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import InputFile from '../InputFile';

const PerformanceCategoryUpload = () => {
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
        uploadFetcher={postPerformanceCategoryUpload}
        downloadFormatFetcher={getPerformanceCategoryDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.MD_PERFCATEGORY_UPLOAD_PROGRESS_LIST}>
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERFORMANCE_CATEGORY}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceCategoryUpload;
