import axios from '../../axios';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useCallback } from 'react';

const API_PERF_MID_YEAR = '/api/perf-mid-year/approval-list';
const API_PERF_END_YEAR = '/api/perf-end-year/approval-list';

const getPerfEmpApprovalList = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfEmpApprovalList = (id: string, isEndYear: boolean) => {
  const url = isEndYear ? API_PERF_END_YEAR : API_PERF_MID_YEAR;

  const { data, error, mutate } = useSWR(
    id ? [url, id] : null,
    getPerfEmpApprovalList,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    perfEmpApprovalList: data,
    isPerfEmpApprovalListLoading: !error && !data,
    isPerfEmpApprovalListError: error,
    perfEmpApprovalListRefreshPress: refreshPress,
    isPerfEmpApprovalListEmpty: isEmpty(data),
  };
};

export default usePerfEmpApprovalList;
