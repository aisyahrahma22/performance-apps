import axios from '../../axios';
import useSWR from 'swr';

const API_EMPLOYEE = '/api/employee';

export const CURRENT_USER = `${API_EMPLOYEE}/current-user`;

const getEmployeeCurrentUser = (url: string) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};
const getEmployee = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useEmployee = (id: string, currentUser?: boolean) => {
  const { data, error } = useSWR(
    id && !currentUser
      ? [API_EMPLOYEE, id]
      : currentUser
      ? [CURRENT_USER]
      : null,
    currentUser ? getEmployeeCurrentUser : getEmployee,
    {
      revalidateOnMount: true,
    },
  );
  return {
    employee: data,
    isEmployeeLoading: !error && !data,
    isEmployeeError: error,
  };
};

export default useEmployee;
