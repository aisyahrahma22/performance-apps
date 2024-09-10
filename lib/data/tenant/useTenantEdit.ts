import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_TENANT = '/api/tenant';
const patchEditTenant = (patchEditTenantBody: any) => {
  return axios
    .patch(API_EDIT_TENANT, patchEditTenantBody)
    .then((resp) => resp.data);
};

interface UseTenantEdit {
  onSuccess?: any;
}

const useTenantEdit = (args: UseTenantEdit = {}) => {
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
    fetcher: patchEditTenant,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    tenantEditPosting: fetch,
    isTenantEditLoading: isLoading,
  };
};

export default useTenantEdit;
