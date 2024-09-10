import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERF_GOAL_SETTING_APPROVAL_EDIT = '/api/perf-superior';
const patchEditPerfGoalSettingApproval = (patchEditPerformanceBody: {
  data: any;
}) => {
  return axios
    .patch(API_PERF_GOAL_SETTING_APPROVAL_EDIT, patchEditPerformanceBody)
    .then((resp) => resp.data);
};

interface UsePerfGoalSettingApprovalEdit {
  onSuccess?: any;
}

const usePerfGoalSettingApprovalEdit = (
  args: UsePerfGoalSettingApprovalEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Data has been updated');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerfGoalSettingApproval,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfGoalSettingApprovalEditPosting: fetch,
    isPerfGoalSettingApprovalEditLoading: isLoading,
  };
};

export default usePerfGoalSettingApprovalEdit;
