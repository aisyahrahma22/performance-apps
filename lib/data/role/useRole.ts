import axios from '../../axios';
import useSWR from 'swr';

const API_USERS = '/api/roles';

const getRole = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useRole = (id: string) => {
  const { data, error } = useSWR(id ? [API_USERS, id] : null, getRole, {
    revalidateOnMount: true,
  });
  return {
    role: data,
    isRoleLoading: !error && !data,
    isRoleError: error,
  };
};

export default useRole;
