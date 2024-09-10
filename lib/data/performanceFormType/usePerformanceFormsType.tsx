import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_FORM_TYPE = '/api/performance-measurement';

export const getPerformanceId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceFormsType = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_FORM_TYPE, id] : null,
    getPerformanceId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performance: data,
    isPerformanceLoading: !error && !data,
    isPerformanceError: error,
  };
};

export default usePerformanceFormsType;
