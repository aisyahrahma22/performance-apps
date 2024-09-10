import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_GROUPING_LIST = '/api/position/grouping-list';

export const getPositionGroupingList = (
  url: string = API_POSITION_GROUPING_LIST,
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

const usePositionGroupingList = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    dataTotalCount,
    dataTotalPage,
    page,
    perPage,
    refreshPress,
    pagePress,
    perPagePress,
    sort,
    sortPress,
    setFilter,
    setPage,
    setPerPage,
  } = useDataTable({
    api: API_POSITION_GROUPING_LIST,
    fetcher: getPositionGroupingList,
  });

  return {
    positionGroupings: data,
    isPositionGroupingsEmpty: isDataEmpty,
    isPositionGroupingsLoading: isDataLoading,
    isPositionGroupingsError: isDataError,
    positionGroupingsTotalCount: dataTotalCount,
    positionGroupingsTotalPage: dataTotalPage,
    positionGroupingsPage: page,
    positionGroupingsPerPage: perPage,
    positionGroupingsRefreshPress: refreshPress,
    positionGroupingsPagePress: pagePress,
    positionGroupingsPerPagePress: perPagePress,
    positionGroupingsSort: sort,
    positionGroupingsSortPress: sortPress,
    setPositionGroupingsFilter: setFilter,
    setPositionGroupingsPage: setPage,
    setPositionGroupingsPerPage: setPerPage,
  };
};

export default usePositionGroupingList;
