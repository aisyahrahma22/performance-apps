import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_GOAL_SETTING_APPROVAL_PROGRAM = '/api/perf-superior/program';

export const getPerfGoalSettingApprovalProgram = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingApprovalProgram = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERF_GOAL_SETTING_APPROVAL_PROGRAM, id] : null,
    getPerfGoalSettingApprovalProgram,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettingApprovalProgram: data,
    isPerfGoalSettingApprovalProgramLoading: !error && !data,
    isPerfGoalSettingApprovalProgramError: error,
  };
};

export default usePerfGoalSettingApprovalProgram;
