import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE = '/api/performance';
const patchEditPerformance = (patchEditPerformanceBody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCE, patchEditPerformanceBody)
    .then((resp) => resp.data);
};

interface UsePerformancesEdit {
  onSuccess?: any;
}

const usePerformancesEdit = (args: UsePerformancesEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.name} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerformance,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesEditPosting: fetch,
    isPerformancesEditLoading: isLoading,
  };
};

export default usePerformancesEdit;
