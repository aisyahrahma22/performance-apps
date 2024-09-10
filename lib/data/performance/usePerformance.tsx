import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE = '/api/performance';

export const getPerformance = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformance = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE, id] : null,
    getPerformance,
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

export default usePerformance;
