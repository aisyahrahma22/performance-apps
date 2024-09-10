import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCEKPI = '/api/performancekpi';

export const getPerformanceKPI = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceKPI = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCEKPI, id] : null,
    getPerformanceKPI,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceKPI: data,
    isPerformanceKPILoading: !error && !data,
    isPerformanceKPIError: error,
  };
};

export default usePerformanceKPI;
