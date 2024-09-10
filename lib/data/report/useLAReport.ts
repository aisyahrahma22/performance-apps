import axios from '../../axios';
import qs from 'qs';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_GENERATE_REPORT = '/api/report';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  for (const key in slicer) {
    const val = slicer[key];
    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('year')) {
      if (val) {
        const year = val.split(' - ');
        const startYear = year[0];
        const endYear = year[1] ? year[1] : startYear;
        payload.employee = {
          fullJoinDate: endYear,
        };
        // payload.career = {
        //   startDate: endYear,
        //   endDate: startYear,
        // };
        // payload.startYear = startYear;
        // payload.endYear = endYear;
      }
    } else if (key.includes('box')) {
      payload.box = {
        code: val?.join(',') || '',
      };
    } else if (key.includes('status') || key.includes('period')) {
      // nothing happen
    } else if (key.includes('isRequiredAccessMapping')) {
      payload.isRequiredAccessMapping = val;
    } else {
      // const keyName = slicer['year'] ? `${key}Career` : key;
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

interface UseLAReportProps {
  onSuccess?: any;
}

const useLAReport = (args: UseLAReportProps = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(
      'Your report is currently being processed. Please wait for a moment, and then click the refresh button periodically to check for updates.',
    );
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: getReport,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    fetchLAReport: fetch,
    isLAReportLoading: isLoading,
  };
};

export default useLAReport;
