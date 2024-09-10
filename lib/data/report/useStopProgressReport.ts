import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_GENERATE_REPORT = '/api/report/stop';

const stopReport = (id: string) => {
  return axios.post(`${API_GENERATE_REPORT}/${id}`).then((resp) => resp.data);
};

interface UseStopProgressReportProps {
  onSuccess?: any;
}

const useStopProgressReport = (args: UseStopProgressReportProps = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: stopReport,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    stopProgressReport: fetch,
    isStopProgressReportLoading: isLoading,
  };
};

export default useStopProgressReport;
