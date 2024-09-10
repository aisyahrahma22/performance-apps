import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PATCH_PERFORMANCE_WORKFLOW_EMPLOYEE =
  '/api/performanceworkflow/editemployee';

const patchPerformanceWorkflowEmployee = async (values: any) => {
  const resp = await axios.patch(
    API_PATCH_PERFORMANCE_WORKFLOW_EMPLOYEE,
    values,
  );
  return resp.data;
};

interface UsePerformanceWorkflowEmployeeEdit {
  onSuccess?: any;
}

const usePerformanceWorkflowEmployeeEdit = (
  args: UsePerformanceWorkflowEmployeeEdit = {},
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
    fetcher: patchPerformanceWorkflowEmployee,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    performanceWorkflowEmployeeEdit: fetch,
    isPerformanceWorkflowEmployeeEditLoading: isLoading,
  };
};

export default usePerformanceWorkflowEmployeeEdit;
