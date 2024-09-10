import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERF_MID_YEAR_EDIT = '/api/perf-mid-year/approval';
const patchPerfMidYearApprovals = (patchPerfMidYearApprovalBody: any) => {
  return axios
    .patch(API_PERF_MID_YEAR_EDIT, patchPerfMidYearApprovalBody)
    .then((resp) => resp.data);
};

interface UsePerfMidYearApprovalEdit {
  onSuccess?: any;
}

const usePerfMidYearApprovalEdit = (args: UsePerfMidYearApprovalEdit = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Edit Performance Mid Year Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfMidYearApprovals,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfMidYearEditPosting: fetch,
    isPerfMidYearApprovalEditLoading: isLoading,
  };
};

export default usePerfMidYearApprovalEdit;
