import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import InputFile from '../InputFile';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import UploadProgress from '../UploadProgress';
import { getFilePerformanceMeasurementForm } from '../../lib/data/performanceMeasurementForm/usePerfMeasurementFormDownload ';
import { postPerformanceMeasurementFormUpload } from '../../lib/data/performanceMeasurementForm/usePerfMeasurementFormUpload';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';

const MeasurementPerformanceUpload = () => {
  const uploadSuccessPerfMeasurementRefresh = useRef<any>();
  const uploadSuccessPerfMeasurement = useCallback(() => {
    uploadSuccessPerfMeasurementRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Master Data Measurement Template
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceMeasurementFormUpload}
        downloadFormatFetcher={getFilePerformanceMeasurementForm}
        onUploadSuccess={uploadSuccessPerfMeasurement}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.MD_PERF_FORM_MEASUREMENT_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.MD_PERF_FORM_MEASUREMENT_UPLOAD}
          ref={uploadSuccessPerfMeasurementRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default MeasurementPerformanceUpload;
