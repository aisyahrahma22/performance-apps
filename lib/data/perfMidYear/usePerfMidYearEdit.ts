import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERF_MID_YEAR_EDIT = '/api/perf-mid-year';
const patchPerfMidYears = (patchPerfMidYearBody: any) => {
  return axios
    .patch(API_PERF_MID_YEAR_EDIT, patchPerfMidYearBody)
    .then((resp) => resp.data);
};

interface UsePerfMidYearEdit {
  onSuccess?: any;
}

const usePerfMidYearEdit = (args: UsePerfMidYearEdit = {}) => {
  const { onSuccess } = args;
  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success('Successfully Edit Performance Mid Year Form');
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerfMidYears,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfMidYearEditPosting: fetch,
    isPerfMidYearEditLoading: isLoading,
  };
};

export default usePerfMidYearEdit;
