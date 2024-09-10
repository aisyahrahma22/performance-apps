import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_PROGRAM = '/api/performance-program';

export const getPerformanceProgram = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceProgram = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_PROGRAM, id] : null,
    getPerformanceProgram,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceProgram: data,
    isPerformanceProgramLoading: !error && !data,
    isPerformanceProgramError: error,
  };
};

export default usePerformanceProgram;
