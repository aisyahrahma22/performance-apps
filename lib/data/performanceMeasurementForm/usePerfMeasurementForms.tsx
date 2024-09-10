import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_FORM_TYPE = '/api/performance-measurement/folder';

export const getPerformanceMeasurementId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceMeasurementForms = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_FORM_TYPE, id] : null,
    getPerformanceMeasurementId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceMeasurement: data,
    isPerformanceMeasurementLoading: !error && !data,
    isPerformanceMeasurementError: error,
  };
};

export default usePerformanceMeasurementForms;
