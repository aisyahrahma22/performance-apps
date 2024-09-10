import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_CODE_LIST = '/api/performance-form/code';

export const getPerfCodeList = (
  url: string = API_PERF_CODE_LIST,
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

const usePerfCodeList = (isAll = false) => {
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
    api: API_PERF_CODE_LIST,
    fetcher: getPerfCodeList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    perfCode: data,
    isPerfCodeListEmpty: isDataEmpty,
    isPerfCodeListLoading: isDataLoading,
    isPerfCodeListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPerfCodeListFilter: setFilter,
    setPerfCodeListPage: setPage,
    setPerfCodeListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePerfCodeList;
