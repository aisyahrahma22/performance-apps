import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_SYNC = '/api/location/sync';
const postSync = () => {
  return axios.post(API_SYNC).then((resp) => resp.data);
};

interface UseSyncLocation {
  onSuccess?: any;
}

const useSyncLocation = (args: UseSyncLocation = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Synchronize location data on progress');
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
    syncLocationPosting: fetch,
    isSyncLocationLoading: isLoading,
  };
};

export default useSyncLocation;
