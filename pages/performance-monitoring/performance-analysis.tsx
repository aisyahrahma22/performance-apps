import React from 'react';
import { NextPage } from 'next';
import Title from '../../components/Title';
import TabHeader from '../../components/TabHeader';
import TablePerformanceInquiry from '../../components/performanceInquiry/PerformanceInquiry';
import PerformanceInquiryAbsoluteScoreUpload from '../../components/performanceInquiry/components/PerformanceInquiryAbsoluteScoreUpload';
import AbsoluteScoreDownloadProgress from '../../components/upload/AbsoluteScoreDownloadProgress';
import useInitialAuth from '../../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';

const PAGE_TITLE = 'Performance Monitoring';

const PerformanceInquiry: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);

  return (
    <>
      <Title title={PAGE_TITLE} />
      <TabHeader
        icon={'chart line'}
        name={'Performance Analysis'}
        parentName={PAGE_TITLE}
      />
      <TablePerformanceInquiry showFilter />
      <AbsoluteScoreDownloadProgress />
      <PerformanceInquiryAbsoluteScoreUpload />
    </>
  );
};

export default PerformanceInquiry;
