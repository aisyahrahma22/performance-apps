import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_SILOAM_VALUE = '/api/siloam-value';
const postCreatePerformanceSiloamValue =
  (postCreatePerformanceSiloamValueBody: {
    id: string;
    name: string;
    description: string;
  }) => {
    return axios
      .post(API_PERFORMANCE_SILOAM_VALUE, postCreatePerformanceSiloamValueBody)
      .then((resp) => resp.data);
  };

interface UsePerformancesSiloamValueCreate {
  onSuccess?: any;
}

const usePerformancesSiloamValueCreate = (
  args: UsePerformancesSiloamValueCreate = {},
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
    fetcher: postCreatePerformanceSiloamValue,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesSiloamValueCreatePosting: fetch,
    isPerformancesSiloamValueCreateLoading: isLoading,
  };
};

export default usePerformancesSiloamValueCreate;
