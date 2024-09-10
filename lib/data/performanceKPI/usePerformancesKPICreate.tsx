import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCEKPI = '/api/performancekpi';
const postCreatePerformanceKPI = (postCreatePerformanceKPIBody: {
  code: string;
  name: string;
  description: string;
  keyAction: string;
  behaviour: string;
}) => {
  return axios
    .post(API_PERFORMANCEKPI, postCreatePerformanceKPIBody)
    .then((resp) => resp.data);
};

interface UsePerformancesKPICreate {
  onSuccess?: any;
}

const usePerformancesKPICreate = (args: UsePerformancesKPICreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceKPI,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesKPICreatePosting: fetch,
    isPerformancesKPICreateLoading: isLoading,
  };
};

export default usePerformancesKPICreate;
