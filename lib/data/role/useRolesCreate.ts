import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_ROLES = '/api/roles';
const postCreateRole = (postCreateRoleBody: {
  code: string;
  name: string;
  description: string;
  isActive: string;
}) => {
  return axios
    .post(API_CREATE_ROLES, postCreateRoleBody)
    .then((resp) => resp.data);
};

interface UseRolesCreate {
  onSuccess?: any;
}

const useRolesCreate = (args: UseRolesCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a role');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreateRole,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    rolesCreatePosting: fetch,
    isRolesCreateLoading: isLoading,
  };
};

export default useRolesCreate;
