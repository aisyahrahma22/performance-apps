import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE = '/api/performance';
const postCreatePerformance = (postCreatePerformanceBody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCE, postCreatePerformanceBody)
    .then((resp) => resp.data);
};

interface UsePerformancesCreate {
  onSuccess?: any;
}

const usePerformancesCreate = (args: UsePerformancesCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformance,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesCreatePosting: fetch,
    isPerformancesCreateLoading: isLoading,
  };
};

export default usePerformancesCreate;
