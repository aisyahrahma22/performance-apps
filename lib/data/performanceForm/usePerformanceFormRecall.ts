import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_RECALL_FORM = '/api/performance-form/recall';
const postRecallPerfForm = (id: string) => {
  return axios.post(`${API_RECALL_FORM}/${id}`).then((resp) => resp.data);
};

interface UsePerfFormRecall {
  onSuccess?: any;
}

const usePerfFormRecall = (args: UsePerfFormRecall = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Recall Performance Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: postRecallPerfForm,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfFormRecallPosting: fetch,
    isPerfFormRecallLoading: isLoading,
  };
};

export default usePerfFormRecall;
