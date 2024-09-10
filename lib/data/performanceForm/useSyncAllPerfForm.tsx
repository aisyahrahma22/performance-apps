import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SYNC_ALL_PERFORMANCE_FORM = '/api/performanceworkflow/sync/all';

const patchSyncAllPerfForm = (filter: any) => {
  return axios
    .patch(API_SYNC_ALL_PERFORMANCE_FORM, filter)
    .then((resp) => resp.data);
};

interface UseSyncAllPerfFormData {
  onSuccess?: any;
}

const useSyncAllPerfFormData = (args: UseSyncAllPerfFormData = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Sync All Performance Workflow to Performance Form Success`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchSyncAllPerfForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    syncAllPerfForm: fetch,
    isSyncAllPerfFormLoading: isLoading,
  };
};

export default useSyncAllPerfFormData;
