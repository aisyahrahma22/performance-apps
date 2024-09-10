import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCEKRA = '/api/performancekra';

export const getPerformance = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceKRA = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCEKRA, id] : null,
    getPerformance,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceKRA: data,
    isPerformanceKRALoading: !error && !data,
    isPerformanceKRAError: error,
  };
};

export default usePerformanceKRA;
