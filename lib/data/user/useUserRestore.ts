import axios from '../../axios';
import useFetch from '../_useFetch';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const API_USER_RESTORE = '/api/users/restore';
const postUser = (userRestoreBody: { id: string }) => {
  return axios
    .post(API_USER_RESTORE, userRestoreBody)
    .then((resp) => resp.data);
};

interface UseUserRestore {
  onSuccess?: any;
}

const useUserRestore = (args: UseUserRestore = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`User has been restored`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postUser,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    userRestore: fetch,
    isUserRestoreLoading: isLoading,
  };
};

export default useUserRestore;
