import axios from '../../axios';
import qs from 'qs';
import useFetch from '../_useFetch';
import { useCallback } from 'react';

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

interface UseListApproverIDPReportProps {
  onSuccess?: any;
}

const useListApproverIDPReport = (args: UseListApproverIDPReportProps = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
  }, [onSuccess]);

  const { fetch, isLoading } = useFetch({
    fetcher: getReport,
    onSuccess: _onSuccess,
  });

  return {
    fetchListApproverIDPReport: fetch,
    isListApproverIDPReportLoading: isLoading,
  };
};

export default useListApproverIDPReport;
