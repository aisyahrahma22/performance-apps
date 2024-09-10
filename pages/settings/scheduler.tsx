import React, { useState } from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import { NoAccessRenderGuard, RenderGuard } from '../../components/RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import TableSchedulerConfiguration from '../../components/table/SchedulerConfiguration';
import SchedulerDetail from '../../components/scheduler/SchedulerDetail';

const PAGE_TITLE = 'Scheduler';
export type SchedulerPageList = 'List' | 'Detail';

const SchedulerConfiguration: NextPage = () => {
  useInitialAuth();
  const [selectedData, setSelectedData] = useState(null);
  const [showDataList, setShowDataList] = useState(true);
  const handleDataSelect = (data: any) => {
    setSelectedData(data);
    setShowDataList(false);
  };
  const handleBack = () => {
    setSelectedData(null);
    setShowDataList(true);
  };

  return (
    <>
      <Title title={PAGE_TITLE} />
      <RenderGuard actionKey={RightEnum.SCHEDULER_LIST_VIEW}>
        <>
          {showDataList && (
            <TableSchedulerConfiguration
              onSelect={handleDataSelect}
              showFilter
            />
          )}
          {selectedData && (
            <SchedulerDetail data={selectedData} onBack={handleBack} />
          )}
        </>
      </RenderGuard>
      <NoAccessRenderGuard actionList={[RightEnum.SCHEDULER_LIST_VIEW]} />
    </>
  );
};

export default SchedulerConfiguration;
