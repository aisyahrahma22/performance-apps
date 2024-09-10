import axios from '../../axios';
import useSWR from 'swr';

const API_USERS = '/api/users';

const getUser = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useUser = (id: string) => {
  const { data, error } = useSWR(id ? [API_USERS, id] : null, getUser, {
    revalidateOnMount: true,
  });
  return {
    user: data,
    isUserLoading: !error && !data,
    isUserError: error,
  };
};

export default useUser;
