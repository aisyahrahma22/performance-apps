import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformanceGoalSetting from '../../components/performanceGoalSetting/TablePerformanceGoalSetting';
import useInitialAuth from '../../lib/hooks/useInitialAuth';

const GoalSetting: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title="Goal Setting" />
      <TabHeader icon="chart bar" name="Goal Setting" parentName="Performance Evaluation" />
      <TablePerformanceGoalSetting showFilter />
    </>
  );
};

export default GoalSetting;
