import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import InputFile from '../InputFile';
import { getPerformanceFormDownload } from '../../lib/data/performanceForm/usePerformanceFormDownload';
import { postPerformanceFormUpload } from '../../lib/data/performanceForm/usePerformanceFormUpload';

const PerformanceFormUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
   <div style={{marginTop: '10px'}}>
     <Header as="h4" color={'black'}>
      Performance Review Upload Form
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceFormUpload}
        downloadFormatFetcher={getPerformanceFormDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <UploadProgress
          type={UploadProgressTypeEnum.PERF_FORM}
          ref={uploadSuccessRefresh}
        />
   </div>
  );
};

export default PerformanceFormUpload;
