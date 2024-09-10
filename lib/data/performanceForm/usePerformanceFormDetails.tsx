import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_FORM_DETAIL = '/api/performance-form/det';

export const getPerformanceFormDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceFormDetail = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_FORM_DETAIL, id] : null,
    getPerformanceFormDetail,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfFormDetail: data,
    isPerfFormDetailLoading: !error && !data,
    isPerfFormDetailError: error,
  };
};

export default usePerformanceFormDetail;
