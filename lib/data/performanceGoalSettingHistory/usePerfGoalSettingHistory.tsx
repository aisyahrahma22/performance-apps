import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_SETTING_HISTORY = '/api/perf-superior/history';

export const getPerfGoalSettingHistory = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

export default function usePerfGoalSettingHistory(id: string) {
  const { data, error } = useSWR<PerfGoalSettingHistory[]>(
    id ? [API_PERFORMANCE_GOAL_SETTING_HISTORY, id] : null,
    getPerfGoalSettingHistory,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfGoalSettingHistory: data,
    isPerfGoalSettingHistoryLoading: !error && !data,
    isPerfGoalSettingHistoryError: error,
  };
}

export type PerfGoalSettingHistory = {
  id: string;
  value: string;
};
