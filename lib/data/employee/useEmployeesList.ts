import qs from 'qs';
import axios from '../../axios';

const API_EMPLOYEE = '/api/employee/performance';

export const getEmployeesList = (
  url: string = API_EMPLOYEE,
  filter: any,
  filterType: 'or' | 'and' = 'and',
) => {
  const qsp = qs.stringify({ filter, filterType }, { skipNulls: true });
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};
