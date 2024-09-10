import React from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerfEndYear from '../../components/performanceEndYear/TablePerfEndYear';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PerfEndYear: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);
  return (
    <>
      <Title title={'End Year Coaching'} />
      <TabHeader
        icon={'chart bar'}
        name={'End Year Coaching'}
        parentName={'Performance Evaluation'}
      />
       <TablePerfEndYear showFilter />
    </>
  );
};

export default PerfEndYear;
