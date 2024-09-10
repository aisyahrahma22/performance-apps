import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_POST_PERFORMANCE_WORKFLOW_EMPLOYEE =
  '/api/performanceworkflow/employee';

const postPerformanceWorkflowEmployee = async (values: any) => {
  const resp = await axios.post(API_POST_PERFORMANCE_WORKFLOW_EMPLOYEE, values);
  return resp.data;
};

interface UsePerformanceWorkflowEmployeeCreate {
  onSuccess?: any;
}

const usePerformanceWorkflowEmployeeCreate = (
  args: UsePerformanceWorkflowEmployeeCreate = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postPerformanceWorkflowEmployee,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    performanceWorkflowEmployeeCreate: fetch,
    isPerformanceWorkflowEmployeeCreateLoading: isLoading,
  };
};

export default usePerformanceWorkflowEmployeeCreate;
