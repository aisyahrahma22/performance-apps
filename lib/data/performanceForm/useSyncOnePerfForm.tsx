import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SYNC_ONE_PERFORMANCE_FORM = '/api/performanceworkflow/sync';

const patchSyncOnePerfForm = (ids: string) => {
  return axios
    .patch(API_SYNC_ONE_PERFORMANCE_FORM, ids)
    .then((resp) => resp.data);
};

interface UseSyncOnePerfFormData {
  onSuccess?: any;
}

const useSyncOnePerfFormData = (args: UseSyncOnePerfFormData = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Sync Performance Workflow to Performance Form Success`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchSyncOnePerfForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    syncOnePerfForm: fetch,
    isSyncOnePerfFormLoading: isLoading,
  };
};

export default useSyncOnePerfFormData;
