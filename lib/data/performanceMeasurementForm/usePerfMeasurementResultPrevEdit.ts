import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_MEASUREMENT_ID = '/api/performance-measurement/grade';

export const getPerformanceMeasurementGradeId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfMeasurementResultsPrevID = (id: string) => {
  const { data, error, mutate } = useSWR(
    id ? [API_PERFORMANCE_MEASUREMENT_ID, id] : null,
    getPerformanceMeasurementGradeId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfMeasurementResultsPrevId: data?.data,
    isPerfMeasurementResultsPrevLoadingId: !error && !data,
    isPerfMeasurementResultsPrevErrorId: error,
    perfMeasurementResultsPrevRefreshPressId: mutate,
  };
};

export default usePerfMeasurementResultsPrevID;
