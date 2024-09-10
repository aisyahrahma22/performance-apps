import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_MEASUREMENT_FINAL_GRADE =
  '/api/performance-measurement/find';

export const getPerformanceMeasurementGradeFinal = (
  url: string = API_PERFORMANCE_MEASUREMENT_FINAL_GRADE,
) => {
  return axios.get(url).then((resp) => resp.data);
};

const usePerfMeasurementResultsPrevFinalResult = () => {
  const { data, error, mutate } = useSWR(
    API_PERFORMANCE_MEASUREMENT_FINAL_GRADE,
    getPerformanceMeasurementGradeFinal,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfMeasurementResultsPrevFinal: data?.data,
    isPerfMeasurementResultsPrevLoadingFinal: !error && !data,
    isPerfMeasurementResultsPrevErrorFinal: error,
    perfMeasurementResultsPrevRefreshPressFinal: mutate,
  };
};

export default usePerfMeasurementResultsPrevFinalResult;
