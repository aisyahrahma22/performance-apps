import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformanceMeasurementForm from '../../components/table/PerformanceMeasurementForm';
import TableMeasurementFinalResult from '../../components/table/MeasurementFinalResult';
import { useSelector } from 'react-redux';
import isActionGranted from '../../lib/util/isActionGranted';
import TABS from '../../helper/tabs';
import { currentActionsSelector } from '../../lib/slice/auth';
import { Tab } from 'semantic-ui-react';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Key Data Performance Metrics';

const MasterDataPerformanceMeasurement: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  const actions = useSelector(currentActionsSelector);
  const panes = useMemo(() => {
    const currentPanes = [];
    if (
      isActionGranted(actions, TABS.masterDataPerformanceMeasurement.actions)
    ) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceMeasurement,
        render: () => (
          <>
            <TabHeader
              icon={TABS.masterDataPerformanceMeasurement.icon}
              name={TABS.masterDataPerformanceMeasurement.name}
              parentName={PAGE_TITLE}
            />
            <TablePerformanceMeasurementForm showFilter />
          </>
        ),
      });
    }
    if (
      isActionGranted(actions, TABS.masterDataPerformanceFinalResult.actions)
    ) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceFinalResult,
        render: () => (
          <>
            <TabHeader
              icon={TABS.masterDataPerformanceFinalResult.icon}
              name={TABS.masterDataPerformanceFinalResult.name}
              parentName={PAGE_TITLE}
            />
           <TableMeasurementFinalResult showFilter />
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
        menu={{ color: 'black', inverted: true, attached: false }}
        panes={panes}
      />
    </>
  );
};

export default MasterDataPerformanceMeasurement;
