import qs from 'qs';
import axios from '../../axios';

const API_PERFORMANCETYPE = '/api/performancetype';

const getPerformanceTypes = (
  url: string = API_PERFORMANCETYPE,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
  filterType: 'or' | 'and' = 'and',
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage, filterType },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

export default getPerformanceTypes;
