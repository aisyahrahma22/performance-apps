import axios from '../../axios';
import useFetch from '../_useFetch';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const API_AUTH_FORGOT_PASSWORD = '/api/auth/reset-password';
const postForgotPassword = (forgotPasswordBody: {
  usernameOrEmail: string;
}) => {
  return axios
    .post(API_AUTH_FORGOT_PASSWORD, forgotPasswordBody)
    .then((resp) => resp.data);
};

interface UseForgotPassword {
  onSuccess?: any;
}

const useForgotPassword = (args: UseForgotPassword = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data) => {
      onSuccess?.();
      toast.success(data);
    },
    [onSuccess],
  );

  const _onError = useCallback((e: any) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postForgotPassword,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    forgotPasswordPosting: fetch,
    isForgotPasswordLoading: isLoading,
  };
};

export default useForgotPassword;
