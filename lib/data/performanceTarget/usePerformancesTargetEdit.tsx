import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCETARGET = '/api/performancetarget';
const patchEditPerformanceTarget = (patchEditPerformanceTargetBody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCETARGET, patchEditPerformanceTargetBody)
    .then((resp) => resp.data);
};

interface UsePerformancesTargetEdit {
  onSuccess?: any;
}

const usePerformancesTargetEdit = (args: UsePerformancesTargetEdit = {}) => {
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
    fetcher: patchEditPerformanceTarget,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesTargetEditPosting: fetch,
    isPerformancesTargetEditLoading: isLoading,
  };
};

export default usePerformancesTargetEdit;
