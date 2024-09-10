import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_SETTING_HISTORY_DETAIL = '/api/perf-superior/data';

export const getPerfGoalSettingHistoryDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

function usePerfGoalSettingHistoryDetail(id: string) {
  const { data, error } = useSWR<PerfGoalSettingHistoryDetail[]>(
    id ? [API_PERFORMANCE_GOAL_SETTING_HISTORY_DETAIL, id] : null,
    getPerfGoalSettingHistoryDetail,
    {
      revalidateOnMount: true,
    },
  );

  return {
    perfGoalSettingHistoryDetail: data,
    isPerfGoalSettingHistoryDetailLoading: !error && !data,
    isPerfGoalSettingHistoryDetailError: error,
  };
}

export default usePerfGoalSettingHistoryDetail;

export type PerfGoalSettingHistoryDetail = {
  id: string;
  kpi: string;
  kra: string;
  target: string;
  weight: number;
  achievement: string;
  perfEmpVersionHistory: {
    id: string;
    version: number;
    type: string;
  };
  perfEmpItemPerKPI: {
    id: string;
  };
  perfEmpItem: {
    id: string;
    perfCategory: {
      id: string;
      type: string;
    };
  };
};
