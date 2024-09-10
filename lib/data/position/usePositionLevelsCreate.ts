import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_POSITION_LEVEL = '/api/position/level';
const postCreatePositionLevel = (postCreatePositionLevelBody: any) => {
  return axios
    .post(API_CREATE_POSITION_LEVEL, postCreatePositionLevelBody)
    .then((resp) => resp.data);
};

interface UsePositionLevelsCreate {
  onSuccess?: any;
}

const usePositionLevelsCreate = (args: UsePositionLevelsCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a position Level');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePositionLevel,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionLevelsCreatePosting: fetch,
    isPositionLevelsCreateLoading: isLoading,
  };
};

export default usePositionLevelsCreate;
