import qs from 'qs';
import { useCallback } from 'react';
import axios from '../../axios';
import useFetch from '../_useFetch';
import { toast } from 'react-toastify';
const API_GENERATE_REPORT = '/api/report';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  for (const key in slicer) {
    const val = slicer[key];
    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('period')) {
      payload.period = val || '';
    } else if (key.includes('status')) {
      if (val?.length) {
        payload.status = val || [];
      }
    } else if (key.includes('year')) {
      // nothing happen
    } else if (key.includes('box')) {
      // nothing happen
    } else if (key.includes('isRequiredAccessMapping')) {
      payload.isRequiredAccessMapping = val;
    } else {
      payload[key] = {
        code: val?.join(',') || '',
      };
    }
  }

  return payload;
};

const getReport = (slicer: any, type: string) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios
    .get(`${API_GENERATE_REPORT}/${type}?${qsp}`)
    .then((resp) => resp.data);
};

interface UsePerfKPIScoreReportProps {
  onSuccess?: any;
  onError?: any;
}

const usePerfKPIScoreReport = (args: UsePerfKPIScoreReportProps = {}) => {
  const { onSuccess, onError } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(
      'Your report is currently being processed. Please wait for a moment, and then click the refresh button periodically to check for updates.',
    );
  }, [onSuccess]);

  const _onError = useCallback(
    (e) => {
      onError?.();
      toast.error(`${e.response?.data?.message || e}`);
    },
    [onError],
  );

  const { fetch, isLoading } = useFetch({
    fetcher: getReport,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    fetchPerfKPIScoreReport: fetch,
    isPerfKPIScoreReportLoading: isLoading,
  };
};

export default usePerfKPIScoreReport;
