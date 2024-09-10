import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCEKRA = '/api/performancekra';
const postCreatePerformanceKRA = (postCreatePerformanceKRABody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCEKRA, postCreatePerformanceKRABody)
    .then((resp) => resp.data);
};

interface UsePerformancesKRACreate {
  onSuccess?: any;
}

const usePerformancesKRACreate = (args: UsePerformancesKRACreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceKRA,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesKRACreatePosting: fetch,
    isPerformancesKRACreateLoading: isLoading,
  };
};

export default usePerformancesKRACreate;
