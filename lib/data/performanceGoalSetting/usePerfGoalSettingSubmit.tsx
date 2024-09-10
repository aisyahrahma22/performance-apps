import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_SETTING_SUBMIT = '/api/perf-superior/submit';

export const getPerfGoalSettingSubmit = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingSubmit = (perfEmpId: string) => {
  const { data, error } = useSWR(
    perfEmpId ? [API_PERFORMANCE_GOAL_SETTING_SUBMIT, perfEmpId] : null,
    getPerfGoalSettingSubmit,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettingSubmit: data,
    isPerfGoalSettingSubmitLoading: !error && !data,
    isPerfGoalSettingSubmitError: error,
  };
};

export default usePerfGoalSettingSubmit;
