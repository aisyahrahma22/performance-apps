import axios from '../../axios';
import useSWR from 'swr';
import qs from 'qs';

type Filter = {
  empId?: string;
  isCurrentStreamline?: boolean;
};

const API_EMPLOYEE_LA_HISTORY_DATE =
  '/api/emp-leadership-assessment/history/date';

export const getEmpLAHistoryDate = (
  url: string = API_EMPLOYEE_LA_HISTORY_DATE,
  filter: Filter,
) => {
  const qsp = qs.stringify(filter, { skipNulls: true });
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useEmployeeLAHistoryDate = (filter: Filter) => {
  const { data, error } = useSWR(
    [API_EMPLOYEE_LA_HISTORY_DATE, filter],
    getEmpLAHistoryDate,
    {
      revalidateOnMount: true,
    },
  );

  return {
    empLAHistoryDate: data || null,
    isEmpLAHistoryDateError: error,
  };
};

export default useEmployeeLAHistoryDate;
