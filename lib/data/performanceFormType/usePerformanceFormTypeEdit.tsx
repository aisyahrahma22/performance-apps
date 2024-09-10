import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_FORM_TYPE = '/api/performance-measurement';
const patchEditPerformanceFormType = (patchEditPerformanceFormTypeBody: {
  code: string;
  name: string;
}) => {
  return axios
    .patch(API_PERFORMANCE_FORM_TYPE, patchEditPerformanceFormTypeBody)
    .then((resp) => resp.data);
};

interface UsePerformanceFormTypeEdit {
  onSuccess?: any;
}

const usePerformanceFormTypeEdit = (args: UsePerformanceFormTypeEdit = {}) => {
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
    fetcher: patchEditPerformanceFormType,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performancesEditPosting: fetch,
    isPerformancesEditLoading: isLoading,
  };
};

export default usePerformanceFormTypeEdit;
