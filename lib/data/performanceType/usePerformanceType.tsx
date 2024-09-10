import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCETYPE = '/api/performancetype';

export const getPerformance = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceType = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCETYPE, id] : null,
    getPerformance,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceType: data,
    isPerformanceTypeLoading: !error && !data,
    isPerformanceTypeError: error,
  };
};

export default usePerformanceType;
