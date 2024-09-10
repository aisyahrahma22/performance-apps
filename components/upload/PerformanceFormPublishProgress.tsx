import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import DataProgress from '../DataProgress';
import { DataProgressTypeEnum } from '../../lib/data/dataProgress/useDataProgress';

const PerformanceFormPublishProgress = () => {
  return (
    <Segment raised>
      <Header as="h4" color={'black'}>
        Publish Performance Form Progress
      </Header>
      <DataProgress type={DataProgressTypeEnum.PUBLISH_FORM} />
    </Segment>
  );
};

export default PerformanceFormPublishProgress;
