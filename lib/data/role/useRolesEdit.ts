import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_ROLES = '/api/roles';
const patchEditRole = (patchEditRoleBody: {
  code: string;
  name: string;
  description: string;
  isActive: string;
}) => {
  return axios
    .patch(API_EDIT_ROLES, patchEditRoleBody)
    .then((resp) => resp.data);
};

interface UseRolesEdit {
  onSuccess?: any;
}

const useRolesEdit = (args: UseRolesEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data: any) => {
      onSuccess?.();
      toast.success(`${data.name} has been updated`);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditRole,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    rolesEditPosting: fetch,
    isRolesEditLoading: isLoading,
  };
};

export default useRolesEdit;
