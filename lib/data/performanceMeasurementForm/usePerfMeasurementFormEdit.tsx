import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_MEASUREMENT_FORM = '/api/performance-measurement/data';
const patchEditPerformanceMeasurementForm =
  (patchEditPerformanceMeasurementFormBody: {
    templateCode: string;
    templateName: string;
    year: number;
    performanceType: any;
    dataGrade?: any;
  }) => {
    return axios
      .patch(
        API_PERFORMANCE_MEASUREMENT_FORM,
        patchEditPerformanceMeasurementFormBody,
      )
      .then((resp) => resp.data);
  };

interface UsePerformanceMeasurementFormEdit {
  onSuccess?: any;
}

const usePerformanceMeasurementFormEdit = (
  args: UsePerformanceMeasurementFormEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.templateName} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerformanceMeasurementForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performanceMeasurementEditPosting: fetch,
    isPerformanceMeasurementEditLoading: isLoading,
  };
};

export default usePerformanceMeasurementFormEdit;
