import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERF_END_YEAR_EDIT = '/api/perf-end-year/approval';

const patchPerfEndYearApprovals = (patchPerfEndYearApprovalBody: any) => {
  return axios
    .patch(API_PERF_END_YEAR_EDIT, patchPerfEndYearApprovalBody)
    .then((resp) => resp.data);
};

interface UsePerfEndYearApprovalEdit {
  onSuccess?: any;
}

const usePerfEndYearApprovalEdit = (args: UsePerfEndYearApprovalEdit = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Edit Performance End Year Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfEndYearApprovals,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfEndYearEditPosting: fetch,
    isPerfEndYearApprovalEditLoading: isLoading,
  };
};

export default usePerfEndYearApprovalEdit;
