import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { getFilePerformanceMeasurementFormDetail } from '../../lib/data/performanceMeasurementForm/usePerfMeasurementDownloadDetail';
import { postPerformanceMeasurementUploadDetail } from '../../lib/data/performanceMeasurementForm/usePerfMeasurementUploadDetail';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';

const MeasurementPerformanceUploadDetail = () => {
  const uploadSuccessRefreshPerfMeasurementDetail = useRef<any>();
  const uploadSuccessPerfMeasurementDetail = useCallback(() => {
    uploadSuccessRefreshPerfMeasurementDetail.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Measurement Template Detail
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceMeasurementUploadDetail}
        downloadFormatFetcher={getFilePerformanceMeasurementFormDetail}
        onUploadSuccess={uploadSuccessPerfMeasurementDetail}
      />
      <Divider />
      <RenderGuard
        actionKey={
          RightEnum.MD_PERF_FORM_MEASUREMENT_UPLOAD_PROGRESS_LIST_DETAIL
        }
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERF_FORM_MEASUREMENT_UPLOADS}
          ref={uploadSuccessRefreshPerfMeasurementDetail}
        />
      </RenderGuard>
    </Segment>
  );
};

export default MeasurementPerformanceUploadDetail;
