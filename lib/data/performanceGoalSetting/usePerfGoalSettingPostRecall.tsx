import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_GOAL_SETTING_POST_RECALL = '/api/perf-superior';

const patchPerfGoalSettingPostRecall = async (values: any) => {
  const resp = await axios.post(
    API_PERFORMANCE_GOAL_SETTING_POST_RECALL,
    values,
  );
  return resp.data;
};

interface UsePerfGoalSettingPostRecall {
  onSuccess?: any;
}

const usePerfGoalSettingPostRecall = (
  args: UsePerfGoalSettingPostRecall = {},
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
    fetcher: patchPerfGoalSettingPostRecall,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    perfGoalSettingPostRecall: fetch,
    isPerfGoalSettingPostRecallLoading: isLoading,
  };
};

export default usePerfGoalSettingPostRecall;
