import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_TYPE_LIST = '/api/performance-form/type';

export const getPerfTypeList = (
  url: string = API_PERF_TYPE_LIST,
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

const usePerfTypeList = (isAll = false) => {
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
    api: API_PERF_TYPE_LIST,
    fetcher: getPerfTypeList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    positions: data,
    isPerfTypeListEmpty: isDataEmpty,
    isPerfTypeListLoading: isDataLoading,
    isPerfTypeListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPerfTypeListFilter: setFilter,
    setPerfTypeListPage: setPage,
    setPerfTypeListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePerfTypeList;
