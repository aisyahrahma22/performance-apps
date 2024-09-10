import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCETYPE = '/api/performanceType';
const postCreatePerformanceType = (postCreatePerformanceTypeBody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCETYPE, postCreatePerformanceTypeBody)
    .then((resp) => resp.data);
};

interface UsePerformancesTypeCreate {
  onSuccess?: any;
}

const usePerformancesTypeCreate = (args: UsePerformancesTypeCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create new data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePerformanceType,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesTypeCreatePosting: fetch,
    isPerformancesTypeCreateLoading: isLoading,
  };
};

export default usePerformancesTypeCreate;
