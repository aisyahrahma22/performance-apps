import React from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformanceForm from '../../components/performanceForm/TablePerformanceForm';
import PerformanceFormUpload from '../../components/upload/PerformanceFormUpload';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Performance Monitoring';

const PerformanceForm: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title={PAGE_TITLE} />
      <TabHeader
        icon={'chart line'}
        name={'Performance Review Form'}
        parentName={PAGE_TITLE}
      />
    <TablePerformanceForm showFilter />
    <PerformanceFormUpload />
    </>
  );
};


export default PerformanceForm;
