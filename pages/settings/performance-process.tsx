import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import { useSelector } from 'react-redux';
import isActionGranted from '../../lib/util/isActionGranted';
import { Tab } from 'semantic-ui-react';
import { currentActionsSelector } from '../../lib/slice/auth';
import TABS from '../../helper/tabs';
import TablePerformanceWorkflowPosition from '../../components/table/PerformancesWorkflowPosition';
import PerformanceWorkflowPositionUpload from '../../components/upload/performanceWorkflowPositionUpload';
import TablePerformanceWorkflowEmployee from '../../components/table/PerformancesWorkflowEmployee';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Settings';

const Reminder: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  const actions = useSelector(currentActionsSelector);
  const panes = useMemo(() => {
    const currentPanes = [];

    if (
      isActionGranted(
        actions,
        TABS.configurationPerformanceWorkflowPosition.actions,
      )
    ) {
      currentPanes.push({
        menuItem: TABS.configurationPerformanceWorkflowPosition,
        render: () => (
          <>
            <TabHeader
              icon={TABS.configurationPerformanceWorkflowPosition.icon}
              name={TABS.configurationPerformanceWorkflowPosition.name}
              parentName={PAGE_TITLE}
            />
         <TablePerformanceWorkflowPosition showFilter />
         <PerformanceWorkflowPositionUpload />
          </>
        ),
      });
    }

    if (
      isActionGranted(
        actions,
        TABS.configurationPerformanceWorkflowEmployee.actions,
      )
    ) {
      currentPanes.push({
        menuItem: TABS.configurationPerformanceWorkflowEmployee,
        render: () => (
          <>
            <TabHeader
              icon={TABS.configurationPerformanceWorkflowEmployee.icon}
              name={TABS.configurationPerformanceWorkflowEmployee.name}
              parentName={PAGE_TITLE}
            />
            <TablePerformanceWorkflowEmployee showFilter />
          </>
        ),
      });
    }

    return currentPanes;
  }, [actions]);
  return (
    <>
      <Title title={PAGE_TITLE} />
      <Tab
        menu={{
          color: 'black',
          inverted: true,
          attached: false,
          size: 'large',
          style: {
            flexGrow: 1,
            overflow: 'auto',
            position: 'relative',
            margin: 0,
          },
        }}
        panes={panes}
      />
    </>
  );
};

export default Reminder;
