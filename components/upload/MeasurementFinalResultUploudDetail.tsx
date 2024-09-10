import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import { postPerformanceMeasurementFinalUploadDetail } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalUploadDetail';
import { getFilePerformanceMeasurementFinalDetail } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalDownloadDetail';

const MeasurementFinalResultUploadDetail = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Final Result Detail
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceMeasurementFinalUploadDetail}
        downloadFormatFetcher={getFilePerformanceMeasurementFinalDetail}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={
          RightEnum.MD_PERF_MEASUREMENT_FINAL_RESULT_UPLOAD_PROGRESS_LIST_DETAIL
        }
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERF_MEASURE_FINAL_UPLOADS}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default MeasurementFinalResultUploadDetail;
