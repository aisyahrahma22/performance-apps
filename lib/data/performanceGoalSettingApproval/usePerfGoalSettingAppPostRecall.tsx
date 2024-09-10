import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_GOAL_SETTING_APP_POST_RECALL =
  '/api/perf-superior/approval/recall-data';

const patchPerfGoalSettingAppPostRecall = async (values: any) => {
  const resp = await axios.post(
    API_PERFORMANCE_GOAL_SETTING_APP_POST_RECALL,
    values,
  );
  return resp.data;
};

interface UsePerfGoalSettingAppPostRecall {
  onSuccess?: any;
}

const usePerfGoalSettingAppPostRecall = (
  args: UsePerfGoalSettingAppPostRecall = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Recall data success`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfGoalSettingAppPostRecall,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    perfGoalSettingAppPostRecall: fetch,
    isPerfGoalSettingAppPostRecallLoading: isLoading,
  };
};

export default usePerfGoalSettingAppPostRecall;
