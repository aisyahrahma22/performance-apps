import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  SystemConfigurationCodeEnum,
  useSystemConfiguration,
} from './useSystemConfiguration';

const API_PATCH_SYSTEM_CONFIGURATION = '/api/system-configuration';

const patchSystemConfiguration = async (values: any) => {
  const resp = await axios.patch(API_PATCH_SYSTEM_CONFIGURATION, values);
  return resp.data;
};

interface UseSystemConfigurationEdit {
  onSuccess?: any;
}

export const useSystemConfigurationEdit = (
  args: UseSystemConfigurationEdit = {},
  id: SystemConfigurationCodeEnum,
) => {
  const { onSuccess } = args;
  const { systemConfigurationMutate } = useSystemConfiguration(id);

  const _onSuccess = useCallback(
    (response) => {
      systemConfigurationMutate(response);
      onSuccess?.();
      toast.success(`Data ${response.name} has been updated`);
    },
    [onSuccess, systemConfigurationMutate],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchSystemConfiguration,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    systemConfigurationEditPosting: fetch,
    isSystemConfigurationEditLoading: isLoading,
  };
};

export default useSystemConfigurationEdit;
