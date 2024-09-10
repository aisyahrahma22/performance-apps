import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { RightEnum } from '../../lib/enums/RightEnum';
import { RenderGuard } from '../RenderGuard';
import DataProgress from '../DataProgress';
import { DataProgressTypeEnum } from '../../lib/data/dataProgress/useDataProgress';
import { getTimelineControlDownload } from '../../lib/data/perfTimelineControl/useTimelineControlDownload';

const API_DOWNLOAD_TIMELINE_CONTROL = '/api/timeline-control/download';

const TimelineControlPublishProgress = () => {
  return (
    <Segment raised>
      <Header as="h4" color={'teal'}>
        Publish Timeline Control Progress
      </Header>
      <RenderGuard actionKey={RightEnum.PERF_TIMELINE_CTRL_LIST_VIEW}>
        <DataProgress
          type={DataProgressTypeEnum.TIMELINE_CONTROL}
          api={API_DOWNLOAD_TIMELINE_CONTROL}
          getDownload={getTimelineControlDownload}
          isButtonDownload={true}
        />
      </RenderGuard>
    </Segment>
  );
};

export default TimelineControlPublishProgress;
