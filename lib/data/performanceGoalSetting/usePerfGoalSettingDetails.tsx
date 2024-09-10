import axios from '../../axios';
import useSWR from 'swr';
import { useCallback } from 'react';

const API_PERFORMANCE_GOAL_SETTING_DETAILS = '/api/perf-employee/details';

export const getPerfGoalSettingDetails = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingDetails = (perfEmpId: string) => {
  const { data, error, mutate } = useSWR(
    perfEmpId ? [API_PERFORMANCE_GOAL_SETTING_DETAILS, perfEmpId] : null,
    getPerfGoalSettingDetails,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    perfGoalSettingDetails: data,
    refreshPress,
    isPerfGoalSettingDetailsLoading: !error && !data,
    isPerfGoalSettingDetailsError: error,
  };
};

export default usePerfGoalSettingDetails;
