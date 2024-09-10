import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_MEASUREMENT = '/api/performance-measurement/grade';

export const getPerfMeasurementFinalResultsPrev = (
  url: string = API_PERFORMANCE_MEASUREMENT,
) => {
  return axios.get(url).then((resp) => resp.data);
};

const usePerfMeasurementResultsPrev = () => {
  const { data, error, mutate } = useSWR(
    API_PERFORMANCE_MEASUREMENT,
    getPerfMeasurementFinalResultsPrev,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfMeasurementResultsPrev: data?.data,
    isPerfMeasurementResultsPrevLoading: !error && !data,
    isPerfMeasurementResultsPrevError: error,
    perfMeasurementResultsPrevRefreshPress: mutate,
  };
};

export default usePerfMeasurementResultsPrev;
