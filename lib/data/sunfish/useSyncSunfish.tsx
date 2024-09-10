import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SYNC = '/api/sync';
const postSync = (postSyncBody: { api: string; date: string }) => {
  return axios.post(API_SYNC, postSyncBody).then((resp) => resp.data);
};

interface UseSyncSunfish {
  onSuccess?: any;
}

const useSyncSunfish = (args: UseSyncSunfish = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully synchronize data');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postSync,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    syncSunfishPosting: fetch,
    isSyncSunfishLoading: isLoading,
  };
};

export default useSyncSunfish;
