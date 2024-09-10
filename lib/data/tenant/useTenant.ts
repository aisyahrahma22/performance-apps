import axios from '../../axios';
import useSWR from 'swr';

const API_TENANT = '/api/tenant';

const getTenant = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const useTenant = (id: string) => {
  const { data, error } = useSWR(id ? [API_TENANT, id] : null, getTenant, {
    revalidateOnMount: true,
  });
  return {
    tenant: data,
    isTenantLoading: !error && !data,
    isTenantError: error,
  };
};

export default useTenant;
