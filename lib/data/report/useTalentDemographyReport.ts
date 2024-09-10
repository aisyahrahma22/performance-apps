import axios from '../../axios';
import qs from 'qs';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_GENERATE_REPORT = '/api/report';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  // check data latest
  const now = new Date().getFullYear();
  const isLatest = Number(slicer['year']) === now;

  for (const key in slicer) {
    const val = slicer[key];

    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('year')) {
      if (val) {
        payload.year = val;
        if (!isLatest) {
          payload.career = {
            startDate: val,
            endDate: val,
          };
        }
      }
    } else if (key.includes('box')) {
      if (val?.length) {
        payload.isFinal = true;
        payload.box = {
          code: val?.join(',') || '',
        };
      }
    } else if (key.includes('status') || key.includes('period')) {
      // nothing happen
    } else if (key.includes('isRequiredAccessMapping')) {
      payload.isRequiredAccessMapping = val;
    } else {
      const keyName = slicer['year'] && !isLatest ? `${key}Career` : key;
      payload[keyName] = {
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

interface UseTalentDemographyReportProps {
  onSuccess?: any;
}

const useTalentDemographyReport = (
  args: UseTalentDemographyReportProps = {},
) => {
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
    fetchTalentDemographyReport: fetch,
    isTalentDemographyReportLoading: isLoading,
  };
};

export default useTalentDemographyReport;
