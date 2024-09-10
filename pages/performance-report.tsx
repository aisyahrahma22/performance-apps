import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Title from '../components/Title';
import { Tab } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import isActionGranted from '../lib/util/isActionGranted';
import { currentActionsSelector } from '../lib/slice/auth';
import TABS from '../helper/tabs';
import TabHeader from '../components/TabHeader';
import PerformanceReport from '../components/PerformanceReport';
import useInitialAuth from '../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Performance Report';

const Report: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);
 
  return (
    <>
      <Title title={PAGE_TITLE} />
      <PerformanceReport />
    </>
  );
};

export default Report;
