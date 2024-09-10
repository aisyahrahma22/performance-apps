import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PATCH_PERFORMANCE_WORKFLOW_POSITION =
  '/api/performanceworkflow/editposition';

const patchPerformanceWorkflowPosition = async (values: any) => {
  const resp = await axios.patch(
    API_PATCH_PERFORMANCE_WORKFLOW_POSITION,
    values,
  );
  return resp.data;
};

interface UsePerformanceWorkflowPositionEdit {
  onSuccess?: any;
}

const usePerformanceWorkflowPositionEdit = (
  args: UsePerformanceWorkflowPositionEdit = {},
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
    fetcher: patchPerformanceWorkflowPosition,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    performanceWorkflowPositionEdit: fetch,
    isPerformanceWorkflowPositionEditLoading: isLoading,
  };
};

export default usePerformanceWorkflowPositionEdit;
