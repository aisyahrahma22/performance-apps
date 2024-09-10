import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_MEASUREMENT_FINAL = '/api/performance-measurement/edit';
const patchEditPerfMeasurementFinalResult =
  (patchEditPerformanceMeasurementFinalBody: {
    measurementCode: string;
    measurementName: string;
    year: number;
    dataGradeFinal?: any;
  }) => {
    return axios
      .patch(
        API_PERFORMANCE_MEASUREMENT_FINAL,
        patchEditPerformanceMeasurementFinalBody,
      )
      .then((resp) => resp.data);
  };

interface UsePerformanceMeasurementFinalEdit {
  onSuccess?: any;
}

const usePerformanceMeasurementFinalEdit = (
  args: UsePerformanceMeasurementFinalEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.measurementName} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerfMeasurementFinalResult,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performanceMeasurementFinalEditPosting: fetch,
    isPerformanceMeasurementFinalEditLoading: isLoading,
  };
};

export default usePerformanceMeasurementFinalEdit;
