import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_SETTING_RECALL = '/api/perf-superior/recall';

export const getPerfGoalSettingRecall = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingRecall = (perfEmpId: string) => {
  const { data, error } = useSWR(
    perfEmpId ? [API_PERFORMANCE_GOAL_SETTING_RECALL, perfEmpId] : null,
    getPerfGoalSettingRecall,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettingRecall: data,
    isPerfGoalSettingRecallLoading: !error && !data,
    isPerfGoalSettingRecallError: error,
  };
};

export default usePerfGoalSettingRecall;
