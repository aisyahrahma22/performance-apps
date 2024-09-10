import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_BOX = '/api/boxes';
const patchEditRole = (patchEditRoleBody: any) => {
  return axios.patch(API_EDIT_BOX, patchEditRoleBody).then((resp) => resp.data);
};

interface UseBoxEdit {
  onSuccess?: any;
}

const useBoxEdit = (args: UseBoxEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditRole,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    boxEditPosting: fetch,
    isBoxEditLoading: isLoading,
  };
};

export default useBoxEdit;
