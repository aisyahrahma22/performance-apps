import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_GOAL_SET_APP_ID = '/api/perf-superior';

export const getPerfGoalSettingAppId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingAppId = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERF_GOAL_SET_APP_ID, id] : null,
    getPerfGoalSettingAppId,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettAppId: data,
    isPerfGoalSettAppIdLoading: !error && !data,
    isPerfGoalSettAppIdError: error,
  };
};

export default usePerfGoalSettingAppId;
