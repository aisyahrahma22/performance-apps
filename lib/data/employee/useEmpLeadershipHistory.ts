import axios from '../../axios';
import useSWR from 'swr';
import qs from 'qs';
import { useState } from 'react';

type Filter = {
  date?: string;
  currStreamline?: string;
  currRole?: boolean;
};

const API_EMPLOYEE_LA_HISTORY = '/api/emp-leadership-assessment/history';

const getEmployeeLeadershipHistory = (
  url: string = API_EMPLOYEE_LA_HISTORY,
  id: string,
  filter: Filter,
) => {
  const qsp = qs.stringify(filter, { skipNulls: true });
  return axios.get(`${url}/${id}?${qsp}`).then((resp) => resp.data);
};

const useEmployeeLeadershipHistory = (id: string) => {
  const [filter, setFilter] = useState<Filter>({});
  const { data, error } = useSWR(
    id ? [API_EMPLOYEE_LA_HISTORY, id, filter] : null,
    getEmployeeLeadershipHistory,
    {
      revalidateOnMount: true,
    },
  );

  return {
    empLeadershipHistory: data || null,
    isEmpLeadershipHistoryError: error,
    setFilterEmpLAHistory: setFilter,
  };
};

export default useEmployeeLeadershipHistory;
