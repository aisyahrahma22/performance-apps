import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_NAME_LIST = '/api/performance-form/name';

export const getPerfNameList = (
  url: string = API_PERF_NAME_LIST,
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

const usePerfNameList = (isAll = false) => {
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
    api: API_PERF_NAME_LIST,
    fetcher: getPerfNameList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    perfNames: data,
    isPerfNameListEmpty: isDataEmpty,
    isPerfNameListLoading: isDataLoading,
    isPerfNameListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPerfNameListFilter: setFilter,
    setPerfNameListPage: setPage,
    setPerfNameListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePerfNameList;
