import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_SCHEDULER = '/api/system-configuration/edit-scheduler';
const editScheduler = (editSchedulerBody: any) => {
  return axios
    .post(API_EDIT_SCHEDULER, {
      ...editSchedulerBody,
    })
    .then((resp) => resp.data);
};

interface UseSchedulerUpdate {
  onSuccess?: any;
}

const useEditScheduler = (args: UseSchedulerUpdate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(
    (response: any) => {
      onSuccess?.();
      toast.success(response);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: editScheduler,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    editScheduler: fetch,
    isEditSchedulerLoading: isLoading,
  };
};

export default useEditScheduler;
