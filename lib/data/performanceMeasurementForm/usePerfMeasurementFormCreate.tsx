import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_MEASUREMENT = '/api/performance-measurement/add';
const postCreatePerformanceMeasurementForm =
  (postCreatePerformanceMeasurementFormBody: {
    templateCode: string;
    templateName: string;
    year: number;
    dataGrade: [
      {
        point: number;
        gradeCode: string;
        gradeName: string;
      },
    ];
  }) => {
    return axios
      .post(
        API_PERFORMANCE_MEASUREMENT,
        postCreatePerformanceMeasurementFormBody,
      )
      .then((resp) => resp.data);
  };

interface UsePerformanceMeasurementFormCreate {
  onSuccess?: any;
}

const usePerformanceMeasurementFormCreate = (
  args: UsePerformanceMeasurementFormCreate = {},
) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceMeasurementForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesCreatePosting: fetch,
    isPerformancesCreateLoading: isLoading,
  };
};

export default usePerformanceMeasurementFormCreate;
