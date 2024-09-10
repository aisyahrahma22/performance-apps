import axios from '../../axios';
import useSWR from 'swr';
import { useCallback } from 'react';

const API_PERF_GOAL_SETTING_APPROVAL_DETAIL = '/api/perf-superior/details';

export const getPerfGoalSettingApprovalDetail = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingApprovalDetail = (id: string) => {
  const { data, error, mutate } = useSWR(
    id ? [API_PERF_GOAL_SETTING_APPROVAL_DETAIL, id] : null,
    getPerfGoalSettingApprovalDetail,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    perfGoalSettingApprovalDetail: data,
    refreshPress,
    isPerfGoalSettingApprovalDetailLoading: !error && !data,
    isPerfGoalSettingApprovalDetailError: error,
  };
};

export default usePerfGoalSettingApprovalDetail;
