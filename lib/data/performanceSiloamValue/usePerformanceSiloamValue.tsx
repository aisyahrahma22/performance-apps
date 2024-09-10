import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_SILOAM_VALUE = '/api/siloam-value';

export const getPerformanceSiloamValue = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceSiloamValue = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_SILOAM_VALUE, id] : null,
    getPerformanceSiloamValue,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceSiloamValue: data,
    isPerformanceSiloamValueLoading: !error && !data,
    isPerformanceSiloamValueError: error,
  };
};

export default usePerformanceSiloamValue;
