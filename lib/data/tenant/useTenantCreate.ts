import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_TENANT = '/api/tenant';
const postCreateTenant = (postCreateTenantBody: any) => {
  return axios
    .post(API_CREATE_TENANT, postCreateTenantBody)
    .then((resp) => resp.data);
};

interface UseTenantCreate {
  onSuccess?: any;
}

const useTenantCreate = (args: UseTenantCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a Tenant data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreateTenant,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    tenantCreatePosting: fetch,
    isTenantCreateLoading: isLoading,
  };
};

export default useTenantCreate;
