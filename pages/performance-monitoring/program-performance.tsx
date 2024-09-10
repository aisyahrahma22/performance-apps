import React from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformanceProgram from '../../components/table/PerformancesProgram';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PerformanceProgram: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title={'Program Performance'} />
      <TabHeader
        icon={'chart bar'}
        name={'Program Performance'}
        parentName={'Performance Monitoring'}
      />
       <TablePerformanceProgram showFilter />
    </>
  );
};

export default PerformanceProgram;
