import React, { useCallback, useRef } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import UploadProgress from '../UploadProgress';
import { UploadProgressTypeEnum } from '../../lib/data/uploadProgress/useUploadProgress';
import { postPerformanceFormParticipantUpload } from '../../lib/data/performanceForm/usePerformanceFormParticipantUpload';
import { getPerformanceFormParticipantDownload } from '../../lib/data/performanceForm/usePerformanceFormParticipantDownload';
import InputFileParticipant from '../performanceForm/components/InputFileParticipant';

const PerformanceFormParticipantUpload = () => {
  const uploadSuccessRefresh = useRef<any>();
  const uploadSuccess = useCallback(() => {
    uploadSuccessRefresh.current?.refresh();
  }, []);

  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Upload Performance Form Participant
      </Header>
      <InputFileParticipant
        accept={'.xlsx,.xls'}
        uploadFetcher={postPerformanceFormParticipantUpload}
        downloadFormatFetcher={getPerformanceFormParticipantDownload}
        onUploadSuccess={uploadSuccess}
        isCheckbox={true}
      />
      <Divider />
      <RenderGuard actionKey={RightEnum.PERFORMANCE_FORM_PARTICIPANT_UPLOAD}>
        <UploadProgress
          type={UploadProgressTypeEnum.PERF_FORM_PARTICIPANT}
          ref={uploadSuccessRefresh}
        />
      </RenderGuard>
    </Segment>
  );
};

export default PerformanceFormParticipantUpload;
