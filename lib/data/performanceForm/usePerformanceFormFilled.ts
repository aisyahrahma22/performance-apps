import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_FORM = '/api/performance-form/filled';

export const getPerformanceFormFilled = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceFormFilled = (id: string) => {
  const { data, error } = useSWR<PerformanceFormFilledResponse>(
    id ? [API_PERFORMANCE_FORM, id] : null,
    getPerformanceFormFilled,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceFormFilled: data,
    isPerformanceFormFilledLoading: !error && !data,
    isPerformanceFormFilledError: error,
  };
};

export type PerformanceFormFilledResponse = {
  isFilled: boolean;
};

export default usePerformanceFormFilled;
