import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_POSITION_LEVEL = '/api/position/level';
const patchEditPositionLevel = (patchEditPositionLevelBody: any) => {
  return axios
    .patch(API_EDIT_POSITION_LEVEL, patchEditPositionLevelBody)
    .then((resp) => resp.data);
};

interface UsePositionLevelsEdit {
  onSuccess?: any;
}

const usePositionLevelsEdit = (args: UsePositionLevelsEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPositionLevel,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionLevelsEditPosting: fetch,
    isPositionLevelsEditLoading: isLoading,
  };
};

export default usePositionLevelsEdit;
