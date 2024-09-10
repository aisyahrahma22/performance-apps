import React from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerfMidYear from '../../components/performanceMidYear/TablePerfMidYear';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PerfMidYear: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title={'Mid Year Coaching'} />
      <TabHeader
        icon={'chart bar'}
        name={'Mid Year Coaching'}
        parentName={'Performance Evaluation'}
      />
       <TablePerfMidYear showFilter />
    </>
  );
};

export default PerfMidYear;
