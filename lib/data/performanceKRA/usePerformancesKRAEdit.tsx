import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCEKRA = '/api/performancekra';
const patchEditPerformanceKRA = (patchEditPerformanceKRABody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCEKRA, patchEditPerformanceKRABody)
    .then((resp) => resp.data);
};

interface UsePerformancesKRAEdit {
  onSuccess?: any;
}

const usePerformancesKRAEdit = (args: UsePerformancesKRAEdit = {}) => {
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
    fetcher: patchEditPerformanceKRA,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesKRAEditPosting: fetch,
    isPerformancesKRAEditLoading: isLoading,
  };
};

export default usePerformancesKRAEdit;
