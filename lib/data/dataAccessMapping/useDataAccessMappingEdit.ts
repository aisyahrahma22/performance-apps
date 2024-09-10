import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PATCH_DATA_ACCESS_MAPPING = '/api/DataAccessMapping';

const patchDataAccessMapping = async (values: any) => {
  const resp = await axios.patch(API_PATCH_DATA_ACCESS_MAPPING, values);
  return resp.data;
};

interface UseDataAccessMappingEdit {
  onSuccess?: any;
}

const useDataAccessMappingEdit = (args: UseDataAccessMappingEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchDataAccessMapping,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    dataAccessMappingEdit: fetch,
    isDataAccessMappingEditLoading: isLoading,
  };
};

export default useDataAccessMappingEdit;
