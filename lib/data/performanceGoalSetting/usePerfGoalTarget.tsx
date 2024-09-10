import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_TARGET = '/api/perf-employee/target';

export const getPerfGoalTarget = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalTarget = (perfFormId: string) => {
  const { data, error } = useSWR(
    perfFormId ? [API_PERFORMANCE_GOAL_TARGET, perfFormId] : null,
    getPerfGoalTarget,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalTarget: data,
    isPerfGoalTargetLoading: !error && !data,
    isPerfGoalTargetError: error,
  };
};

export default usePerfGoalTarget;
