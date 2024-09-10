import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_EDIT_POSITION_PATH = '/api/position/path';
const patchEditPositionPath = (patchEditPositionPathBody: {
  id: string;
  positionId: string;
  nextPositionId: string;
  isPrimary: boolean;
}) => {
  return axios
    .patch(API_EDIT_POSITION_PATH, patchEditPositionPathBody)
    .then((resp) => resp.data);
};

interface UsePositionPathsEdit {
  onSuccess?: any;
}

const usePositionPathsEdit = (args: UsePositionPathsEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPositionPath,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionPathsEditPosting: fetch,
    isPositionPathsEditLoading: isLoading,
  };
};

export default usePositionPathsEdit;
