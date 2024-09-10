import useSWR from 'swr';
import axios from '../../../axios';

const API_PERFORMANCE_MID_YEAR_HISTORY = '/api/perf-mid-year/history';
const API_PERFORMANCE_END_YEAR_HISTORY = '/api/perf-end-year/history';

export const getPerformanceHistory = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

export default function usePerformanceHistory(id: string, isEndYear: boolean) {
  const { data, error } = useSWR<PerfGoalSettingHistory[]>(
    id
      ? [
          isEndYear
            ? API_PERFORMANCE_END_YEAR_HISTORY
            : API_PERFORMANCE_MID_YEAR_HISTORY,
          id,
        ]
      : null,
    getPerformanceHistory,
    {
      revalidateOnMount: true,
    },
  );

  return {
    performanceHistory: data,
    isPerformanceHistoryLoading: !error && !data,
    isPerformanceHistoryError: error,
  };
}

export type PerfGoalSettingHistory = {
  id: string;
  value: string;
};
