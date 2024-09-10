import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_KRA = '/api/perf-employee/kra';

export const getPerfGoalKRA = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalKRA = (perfFormId: string) => {
  const { data, error } = useSWR(
    perfFormId ? [API_PERFORMANCE_GOAL_KRA, perfFormId] : null,
    getPerfGoalKRA,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalKRA: data,
    isPerfGoalKRALoading: !error && !data,
    isPerfGoalKRAError: error,
  };
};

export default usePerfGoalKRA;
