import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCETYPE = '/api/performancetype';
const patchEditPerformanceType = (patchEditPerformanceTypeBody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCETYPE, patchEditPerformanceTypeBody)
    .then((resp) => resp.data);
};

interface UsePerformancesTypeEdit {
  onSuccess?: any;
}

const usePerformancesTypeEdit = (args: UsePerformancesTypeEdit = {}) => {
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
    fetcher: patchEditPerformanceType,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesTypeEditPosting: fetch,
    isPerformancesTypeEditLoading: isLoading,
  };
};

export default usePerformancesTypeEdit;
