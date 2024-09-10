import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_CREATE_BOX = '/api/boxes';
const postCreateBox = (postCreateBoxBody: {
  code: string;
  name: string;
  description: string;
}) => {
  return axios
    .post(API_CREATE_BOX, postCreateBoxBody)
    .then((resp) => resp.data);
};

interface UseBoxCreate {
  onSuccess?: any;
}

const useBoxCreate = (args: UseBoxCreate = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully create a box');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postCreateBox,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    boxCreatePosting: fetch,
    isBoxCreateLoading: isLoading,
  };
};

export default useBoxCreate;
