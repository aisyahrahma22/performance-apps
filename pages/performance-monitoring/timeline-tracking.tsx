import React from 'react';
import { NextPage } from 'next';
// import { authentication } from '../../lib/authentication';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import { NoAccessRenderGuard, RenderGuard } from '../../components/RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TableTimelineControl from '../../components/table/TimelineControl';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import TimelineControlPublishProgress from '../../components/upload/TimelineControlPublishProgress';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Performance Monitoring';

const TimelineControl: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title={PAGE_TITLE} />
      <TabHeader
        icon={'chart line'}
        name={'Timeline Tracking'}
        parentName={PAGE_TITLE}
      />
      <TableTimelineControl showFilter />
    </>
  );
};


export default TimelineControl;
