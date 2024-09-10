import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_POSITION_PATH = '/api/position/Path';
const postCreatePositionPath = (postCreatePositionPathBody: {
  code: string;
  name: string;
  description: string;
  isActive: string;
}) => {
  return axios
    .post(API_CREATE_POSITION_PATH, postCreatePositionPathBody)
    .then((resp) => resp.data);
};

interface UsePositionPathsCreate {
  onSuccess?: any;
}

const usePositionPathsCreate = (args: UsePositionPathsCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a position Path');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreatePositionPath,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    positionPathsCreatePosting: fetch,
    isPositionPathsCreateLoading: isLoading,
  };
};

export default usePositionPathsCreate;
