import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import InputFile from '../InputFile';
import { getSiloamValueConfigDownload } from '../../lib/data/performanceForm/useFormSiloamValueConfigDowload';
import { postSiloamValueConfigUpload } from '../../lib/data/performanceForm/useFormSiloamValueConfigUpload';

const PerformanceFormSiloamValueUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Update Form Siloam Value Config
      </Header>
      <InputFile
        accept={'.xlsx,.xls'}
        uploadFetcher={postSiloamValueConfigUpload}
        downloadFormatFetcher={getSiloamValueConfigDownload}
        onUploadSuccess={uploadSuccess}
      />
      <Divider />
      <RenderGuard
        actionKey={RightEnum.PERF_PROGRAM_TIMELINE_UPLOAD_PROGRESS_LIST}
      >
        <UploadProgress
          type={UploadProgressTypeEnum.DEMONSTRATE_SILOAM_VALUE}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceFormSiloamValueUpload;
