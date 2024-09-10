import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE_LA = '/api/emp-leadership-assessment';

const getEmployeeLeadership = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useEmployeeLeadership = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_EMPLOYEE_LA, id] : null,
    getEmployeeLeadership,
    {
      revalidateOnMount: true,
    },
  );
  return {
    employeeLeadership: data,
    isEmployeeLeadershipLoading: !error && !data,
    isEmployeeLeadershipError: error,
  };
};

export default useEmployeeLeadership;
