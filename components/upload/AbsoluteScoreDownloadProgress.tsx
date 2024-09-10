import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import DataProgress from '../DataProgress';
import { DataProgressTypeEnum } from '../../lib/data/dataProgress/useDataProgress';
import { stopDownloadInputAbsoluteScore } from '../../lib/data/performanceInquiry/usePerformanceInquiryAbsoluteScoreDownload';
import { downloadFile } from '../../lib/data/performanceInquiry/useDownloadFile';

const API_DOWNLOAD_ABSOLUTE_INPUT_SCORE = '/api/performance-inquiry/download';

const AbsoluteScoreDownloadProgress = () => {
  return (
   <div>
      <Header as="h4" color={'blue'}>
        Download Score 
      </Header>
      <DataProgress
          type={DataProgressTypeEnum.DOWNLOAD_ABSOLUTE}
          getDownload={downloadFile}
          isButtonDownload={true}
          isButtonStop={true}
          getStop={stopDownloadInputAbsoluteScore}
          api={API_DOWNLOAD_ABSOLUTE_INPUT_SCORE}
        />
   </div>
  );
};

export default AbsoluteScoreDownloadProgress;
