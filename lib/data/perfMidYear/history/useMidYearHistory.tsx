import useSWR from 'swr';
import axios from '../../../axios';

const API_PERFORMANCE_MID_YEAR_HISTORY = '/api/perf-mid-year/history';

export const getPerfMidYearHistory = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

export default function usePerfMidYearHistory(id: string) {
  const { data, error } = useSWR<PerfGoalSettingHistory[]>(
    id ? [API_PERFORMANCE_MID_YEAR_HISTORY, id] : null,
    getPerfMidYearHistory,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfMidYearHistory: data,
    isPerfMidYearHistoryLoading: !error && !data,
    isPerfMidYearHistoryError: error,
  };
}

export type PerfGoalSettingHistory = {
  id: string;
  value: string;
};
