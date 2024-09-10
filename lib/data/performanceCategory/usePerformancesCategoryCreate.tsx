import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCECATEGORY = '/api/category';
const postCreatePerformanceCategory = (postCreatePerformanceCategoryBody: {
  code: string;
  name: string;
}) => {
  return axios
    .post(API_PERFORMANCECATEGORY, postCreatePerformanceCategoryBody)
    .then((resp) => resp.data);
};

interface UsePerformancesCategoryCreate {
  onSuccess?: any;
}

const usePerformancesCategoryCreate = (
  args: UsePerformancesCategoryCreate = {},
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
    fetcher: postCreatePerformanceCategory,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesCategoryCreatePosting: fetch,
    isPerformancesCategoryCreateLoading: isLoading,
  };
};

export default usePerformancesCategoryCreate;
