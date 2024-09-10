import useSWR from 'swr';
import axios from '../../axios';

const API_AUTH_ROLES = '/api/auth/roles';
const getCurrentRoles = (url: string, userId: string) => {
  return axios.get(`${url}/${userId}`).then((resp) => resp.data);
};

const useRolesByUserId = (userId: string, selectRole: boolean) => {
  const { data, error } = useSWR(
    userId && selectRole ? [API_AUTH_ROLES, userId] : null,
    getCurrentRoles,
    {
      revalidateOnMount: true,
    },
  );
  return {
    roles: data,
    isRolesLoading: !error && !data,
    isRolesError: error,
  };
};

export default useRolesByUserId;
