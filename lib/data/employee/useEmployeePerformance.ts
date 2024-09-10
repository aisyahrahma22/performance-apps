import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE_PERFORMANCE = '/api/emp-performance';

const getEmployeePerformance = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useEmployeePerformance = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_EMPLOYEE_PERFORMANCE, id] : null,
    getEmployeePerformance,
    {
      revalidateOnMount: true,
    },
  );
  return {
    employeePerformance: data,
    isEmployeePerformanceLoading: !error && !data,
    isEmployeePerformanceError: error,
  };
};

export default useEmployeePerformance;
