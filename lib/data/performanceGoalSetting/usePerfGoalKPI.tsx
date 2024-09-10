import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_GOAL_KPI = '/api/perf-employee/kpi';

export const getPerfGoalKPI = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalKPI = (perfFormId: string) => {
  const { data, error } = useSWR(
    perfFormId ? [API_PERFORMANCE_GOAL_KPI, perfFormId] : null,
    getPerfGoalKPI,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalKPI: data,
    isPerfGoalKPILoading: !error && !data,
    isPerfGoalKPIError: error,
  };
};

export default usePerfGoalKPI;
