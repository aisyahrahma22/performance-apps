import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_GOAL_SET_APP_RECALL = '/api/perf-superior/approval/recall';

export const getPerfGoalSettingAppRecall = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingAppRecall = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERF_GOAL_SET_APP_RECALL, id] : null,
    getPerfGoalSettingAppRecall,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettAppRecall: data,
    isPerfGoalSettAppRecallLoading: !error && !data,
    isPerfGoalSettAppRecallError: error,
  };
};

export default usePerfGoalSettingAppRecall;
