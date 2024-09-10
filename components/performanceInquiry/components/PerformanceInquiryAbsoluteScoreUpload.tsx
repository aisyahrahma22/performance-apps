import React, { useCallback, useRef } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import { postPerformanceInquiryAbsoluteScoreUpload } from '../../../lib/data/performanceInquiry/usePerformanceInquiryAbsoluteScoreUpload';
import { UploadProgressTypeEnum } from '../../../lib/data/uploadProgress/useUploadProgress';
import { RightEnum } from '../../../lib/enums/RightEnum';
import InputFile from '../../InputFile';
import { RenderGuard } from '../../RenderGuard';
import UploadProgress from '../../UploadProgress';

export default function PerformanceInquiryAbsoluteScoreUpload() {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);

  return (
    <div>
      <Header as="h4" color={'blue'}>
        Upload Score 
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceInquiryAbsoluteScoreUpload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <UploadProgress
          type={UploadProgressTypeEnum.PERFORMANCE_INQUIRY_ABSOLUTE_SCORE}
          ref={uploadSuccessRefresh}
        />
    </div>
  );
}
