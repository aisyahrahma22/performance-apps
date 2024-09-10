import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PUBLISH_FORM = '/api/performance-form/publish';
const postPublishPerfForm = (id: string) => {
  return axios.post(`${API_PUBLISH_FORM}/${id}`).then((resp) => resp.data);
};

interface UsePerfFormPublish {
  onSuccess?: any;
}

const usePerfFormPublish = (args: UsePerfFormPublish = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Publish Performance Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postPublishPerfForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfFormPublishPosting: fetch,
    isPerfFormPublishLoading: isLoading,
  };
};

export default usePerfFormPublish;
