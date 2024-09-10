import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_MEASUREMENT_FINAL_DETAIL =
  '/api/performance-measurement/detail';

export const getPerfMeasurementFinalId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceMeasurementFinalId = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_MEASUREMENT_FINAL_DETAIL, id] : null,
    getPerfMeasurementFinalId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    performanceMeasurementFinal: data,
    isPerformanceMeasurementFinalLoading: !error && !data,
    isPerformanceMeasurementFinalError: error,
  };
};

export default usePerformanceMeasurementFinalId;
