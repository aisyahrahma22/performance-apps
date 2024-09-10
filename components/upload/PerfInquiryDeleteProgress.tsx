import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import DataProgress from '../DataProgress';
import { DataProgressTypeEnum } from '../../lib/data/dataProgress/useDataProgress';

const PerfInquiryDeleteProgress = () => {
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Delete Performance Inquiry Progress
      </Header>
      <RenderGuard actionKey={RightEnum.PERFORMANCE_INQUIRY_LIST_VIEW}>
        <DataProgress type={DataProgressTypeEnum.DELETE_PERF_INQUIRY} />
      </RenderGuard>
    </Segment>
  );
};

export default PerfInquiryDeleteProgress;
