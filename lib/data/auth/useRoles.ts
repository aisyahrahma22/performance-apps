import useSWR from 'swr';
import axios from '../../axios';

const API_AUTH_ROLES = '/api/auth/roles';
const getCurrentRoles = (url: string) => {
  return axios.get(url).then((resp) => resp.data);
};

const useRoles = () => {
  const { data, error } = useSWR([API_AUTH_ROLES], getCurrentRoles, {
    revalidateOnMount: true,
  });
  return {
    roles: data,
    isRolesLoading: !error && !data,
    isRolesError: error,
  };
};

export default useRoles;
