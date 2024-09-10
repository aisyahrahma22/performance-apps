import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_GOAL_SETTING = '/api/perf-employee';

const patchPerfGoalSetting = async (values: any) => {
  const resp = await axios.patch(API_PERFORMANCE_GOAL_SETTING, values);
  return resp.data;
};

interface UsePerfGoalSettingEdit {
  onSuccess?: any;
}

const usePerfGoalSettingEdit = (args: UsePerfGoalSettingEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfGoalSetting,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    perfGoalSettingEdit: fetch,
    isPerfGoalSettingEditLoading: isLoading,
  };
};

export default usePerfGoalSettingEdit;
