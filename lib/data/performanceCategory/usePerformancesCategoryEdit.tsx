import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCECATEGORY = '/api/category';
const patchEditPerformanceCategory = (patchEditPerformanceCategoryBody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCECATEGORY, patchEditPerformanceCategoryBody)
    .then((resp) => resp.data);
};

interface UsePerformancesCategoryEdit {
  onSuccess?: any;
}

const usePerformancesCategoryEdit = (
  args: UsePerformancesCategoryEdit = {},
) => {
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
    fetcher: patchEditPerformanceCategory,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesCategoryEditPosting: fetch,
    isPerformancesCategoryEditLoading: isLoading,
  };
};

export default usePerformancesCategoryEdit;
