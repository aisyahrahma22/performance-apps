import useSWR from 'swr';
import axios from '../../axios';

const API_DDG_ROLES = '/api/ddg/roles';
const getCurrentRoles = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useDDGRoles = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_DDG_ROLES, id] : null,
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

export default useDDGRoles;
