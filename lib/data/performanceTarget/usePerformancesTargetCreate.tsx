import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCETARGET = '/api/performancetarget';
const postCreatePerformanceTarget = (postCreatePerformanceTargetBody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCETARGET, postCreatePerformanceTargetBody)
    .then((resp) => resp.data);
};

interface UsePerformancesTargetCreate {
  onSuccess?: any;
}

const usePerformancesTargetCreate = (
  args: UsePerformancesTargetCreate = {},
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
    fetcher: postCreatePerformanceTarget,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesTargetCreatePosting: fetch,
    isPerformancesTargetCreateLoading: isLoading,
  };
};

export default usePerformancesTargetCreate;
