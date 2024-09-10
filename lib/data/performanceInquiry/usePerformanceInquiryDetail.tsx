import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_INQUIRY_DETAIL = '/api/performance-inquiry';

const getPerformanceInquiryDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceInquiryDetail = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_INQUIRY_DETAIL, id] : null,
    getPerformanceInquiryDetail,
    {
      revalidateOnMount: true,
    },
  );

  return {
    performanceInquiry: data,
    isPerformanceInquiryLoading: !error && !data,
    isPerformanceInquiryError: error,
  };
};

export default usePerformanceInquiryDetail;
