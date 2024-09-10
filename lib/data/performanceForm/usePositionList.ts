import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_LIST = '/api/performance-form/employee';

export const getPositionList = (
  url: string = API_POSITION_LIST,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePositionList = (isAll = false) => {
  const defaultFilter = isAll ? {} : { isActive: true };
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
    api: API_POSITION_LIST,
    fetcher: getPositionList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    positions: data,
    isPositionListEmpty: isDataEmpty,
    isPositionListLoading: isDataLoading,
    isPositionListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPositionListFilter: setFilter,
    setPositionListPage: setPage,
    setPositionListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePositionList;
