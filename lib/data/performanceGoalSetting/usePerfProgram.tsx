import axios from '../../axios';
import useSWR from 'swr';

const API_PERFORMANCE_PROGRAM = '/api/perf-employee/program';

export const getPerfProgram = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};
API_PERFORMANCE_PROGRAM;

const usePerfProgram = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_PROGRAM, id] : null,
    getPerfProgram,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfProgram: data,
    isPerfProgramLoading: !error && !data,
    isPerfProgramError: error,
  };
};

export default usePerfProgram;
