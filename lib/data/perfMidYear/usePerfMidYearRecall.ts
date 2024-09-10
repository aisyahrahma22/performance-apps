import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_MID_YEAR_RECALL_FORM = '/api/perf-mid-year/recall';
const API_END_YEAR_RECALL_FORM = '/api/perf-end-year/recall';

const postRecallPerfMidYear = (id: string, isApproval = false) => {
  const url = isApproval
    ? `${API_MID_YEAR_RECALL_FORM}/approval`
    : API_MID_YEAR_RECALL_FORM;
  return axios.post(`${url}/${id}`).then((resp) => resp.data);
};

const postRecallPerfEndYear = (id: string, isApproval = false) => {
  const url = isApproval
    ? `${API_END_YEAR_RECALL_FORM}/approval`
    : API_END_YEAR_RECALL_FORM;
  return axios.post(`${url}/${id}`).then((resp) => resp.data);
};

interface UsePerfEmpRecall {
  onSuccess?: any;
}

const usePerfEmpRecall = (args: UsePerfEmpRecall = {}, isEndYear: boolean) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Recall Performance Employee');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: isEndYear ? postRecallPerfEndYear : postRecallPerfMidYear,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfEmpRecallPosting: fetch,
    isPerfEmpRecallLoading: isLoading,
  };
};

export default usePerfEmpRecall;
