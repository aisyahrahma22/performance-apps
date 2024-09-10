import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERF_END_YEAR_EDIT = '/api/perf-end-year';
const patchPerfEndYears = (patchPerfEndYearBody: any) => {
  return axios
    .patch(API_PERF_END_YEAR_EDIT, patchPerfEndYearBody)
    .then((resp) => resp.data);
};

interface UsePerfEndYearEdit {
  onSuccess?: any;
}

const usePerfEndYearEdit = (args: UsePerfEndYearEdit = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Edit Performance End Year Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfEndYears,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfEndYearEditPosting: fetch,
    isPerfEndYearEditLoading: isLoading,
  };
};

export default usePerfEndYearEdit;
