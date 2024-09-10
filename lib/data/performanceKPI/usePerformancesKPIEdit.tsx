import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCEKPI = '/api/performancekpi';
const patchEditPerformanceKPI = (patchEditPerformanceKPIBody: {
  code: string;
  name: string;
  description: string;
  keyAction: string;
  behaviour: string;
}) => {
  return axios
    .patch(API_PERFORMANCEKPI, patchEditPerformanceKPIBody)
    .then((resp) => resp.data);
};

interface UsePerformancesKPIEdit {
  onSuccess?: any;
}

const usePerformancesKPIEdit = (args: UsePerformancesKPIEdit = {}) => {
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
    fetcher: patchEditPerformanceKPI,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesKPIEditPosting: fetch,
    isPerformancesKPIEditLoading: isLoading,
  };
};

export default usePerformancesKPIEdit;
