import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { currentActionsSelector } from '../../lib/slice/auth';
import TABS from '../../helper/tabs';
import { Tab } from 'semantic-ui-react';
import isActionGranted from '../../lib/util/isActionGranted';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformancesType from '../../components/table/PerformancesType';
import TablePerformancesCategory from '../../components/table/PerformancesCategory';
import TablePerformancesKRA from '../../components/table/PerformancesKRA';
import TablePerformancesKPI from '../../components/table/PerformancesKPI';
import TablePerformanceFormType from '../../components/table/PerformanceFormType';
import TablePerformancesTarget from '../../components/table/PerformancesTarget';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Key Data';

const PerformancePage: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  const actions = useSelector(currentActionsSelector);
  const panes = useMemo(() => {
    const currentPanes = [];
    if (isActionGranted(actions, TABS.masterDataPerformanceFormType.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceFormType,
        render: () => (
          <>
            <TabHeader
              icon={TABS.masterDataPerformanceFormType.icon}
              name={TABS.masterDataPerformanceFormType.name}
              parentName={PAGE_TITLE}
            />
             <TablePerformanceFormType showFilter />
          </>
        ),
      });
    }

    if (isActionGranted(actions, TABS.masterDataPerformanceType.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceType,
        render: () => (
          <>
            <TabHeader
              name={'Performance Type'}
              icon={TABS.masterDataPerformanceType.icon}
              parentName={PAGE_TITLE}
            />
           <TablePerformancesType showFilter />
          </>
        ),
      });
    }
    if (isActionGranted(actions, TABS.masterDataPerformanceCategory.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceCategory,
        render: () => (
          <>
            <TabHeader
              name={'Category'}
              icon={TABS.masterDataPerformanceCategory.icon}
              parentName={PAGE_TITLE}
            />
             <TablePerformancesCategory showFilter />
          </>
        ),
      });
    }
    if (isActionGranted(actions, TABS.masterDataPerformanceKRA.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceKRA,
        render: () => (
          <>
            <TabHeader
              name={'Key Responsibility Area'}
              icon={TABS.masterDataPerformanceKRA.icon}
              parentName={PAGE_TITLE}
            />
            <TablePerformancesKRA showFilter />
          </>
        ),
      });
    }
    if (isActionGranted(actions, TABS.masterDataPerformanceKPI.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceKPI,
        render: () => (
          <>
            <TabHeader
              name={'Key Performance Indicator'}
              icon={TABS.masterDataPerformanceKPI.icon}
              parentName={PAGE_TITLE}
            />
             <TablePerformancesKPI showFilter />
          </>
        ),
      });
    }
    if (isActionGranted(actions, TABS.masterDataPerformanceTarget.actions)) {
      currentPanes.push({
        menuItem: TABS.masterDataPerformanceTarget,
        render: () => (
          <>
            <TabHeader
              name={'Target'}
              icon={TABS.masterDataPerformanceTarget.icon}
              parentName={PAGE_TITLE}
            />
          <TablePerformancesTarget showFilter />
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
          tabular: false,
        }}
        panes={panes}
      />
    </>
  );
};

// export const getServerSideProps = authentication();

export default PerformancePage;
