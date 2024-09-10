import axios from '../../axios';
import useFetch from '../_useFetch';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const API_AUTH_CHANGE_PASSWORD = '/api/auth/change-password';
const postChangePassword = (changePasswordBody: {
  oldPassword: string;
  newPassword: string;
}) => {
  return axios
    .post(API_AUTH_CHANGE_PASSWORD, changePasswordBody)
    .then((resp) => resp.data);
};

interface UseChangePassword {
  onSuccess?: any;
}

const useChangePassword = (args: UseChangePassword = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`New password has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postChangePassword,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    changePasswordPosting: fetch,
    isChangePasswordLoading: isLoading,
  };
};

export default useChangePassword;
