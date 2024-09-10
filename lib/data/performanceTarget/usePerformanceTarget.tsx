import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCETARGET = '/api/performancetarget';

export const getPerformanceTarget = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceTarget = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCETARGET, id] : null,
    getPerformanceTarget,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceTarget: data,
    isPerformanceTargetLoading: !error && !data,
    isPerformanceTargetError: error,
  };
};

export default usePerformanceTarget;
