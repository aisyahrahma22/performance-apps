import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_FORM_EDIT =
  '/api/performance-form/new-participant/employee';
const patchEditPerformanceForm = (values: any) => {
  return axios
    .post(API_PERFORMANCE_FORM_EDIT, values)
    .then((resp) => resp.data);
};

interface UsePerformancesFormEdit {
  onSuccess?: any;
}

const usePerformEmpAdd = (args: UsePerformancesFormEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`New Participant has been added successfully`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerformanceForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    performEmpAddPosting: fetch,
    isPerformEmpAddPostingLoading: isLoading,
  };
};

export default usePerformEmpAdd;
