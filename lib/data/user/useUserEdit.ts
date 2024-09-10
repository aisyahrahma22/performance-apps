import axios from '../../axios';
import useFetch from '../_useFetch';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const API_USER_EDIT = '/api/users';
const patchUser = (userEditBody: { id: string; roles: string[] }) => {
  return axios.patch(API_USER_EDIT, userEditBody).then((resp) => resp.data);
};

interface UseUserEdit {
  onSuccess?: any;
}

const useUserEdit = (args: UseUserEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data) => {
      onSuccess?.();
      toast.success(`${data.username} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchUser,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    userEditPatch: fetch,
    isUserEditLoading: isLoading,
  };
};

export default useUserEdit;
