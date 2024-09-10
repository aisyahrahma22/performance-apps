import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { getFilePerformanceMeasurementFinal } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalDownload ';
import { postPerformanceMeasurementFinalUpload } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalUpload';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';

const MeasurementFinalResultUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Final Result
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceMeasurementFinalUpload}
        downloadFormatFetcher={getFilePerformanceMeasurementFinal}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={
          RightEnum.MD_PERF_MEASUREMENT_FINAL_RESULT_UPLOAD_PROGRESS_LIST
        }
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERF_MEASURE_FINAL_UPLOAD}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default MeasurementFinalResultUpload;
