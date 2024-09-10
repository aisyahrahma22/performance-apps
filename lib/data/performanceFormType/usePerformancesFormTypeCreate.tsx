import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_FORM_TYPE = '/api/performance-measurement';
const postCreatePerformanceFormType = (postCreatePerformanceFormTypeBody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCE_FORM_TYPE, postCreatePerformanceFormTypeBody)
    .then((resp) => resp.data);
};

interface UsePerformanceFormTypeCreate {
  onSuccess?: any;
}

const usePerformanceFormTypeCreate = (
  args: UsePerformanceFormTypeCreate = {},
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
    fetcher: postCreatePerformanceFormType,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesCreatePosting: fetch,
    isPerformancesCreateLoading: isLoading,
  };
};

export default usePerformanceFormTypeCreate;
