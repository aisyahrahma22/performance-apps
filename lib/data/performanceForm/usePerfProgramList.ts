import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_PROGRAM_LIST = '/api/performance-form/program';

export const getPerfProgramList = (
  url: string = API_PERF_PROGRAM_LIST,
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

const usePerfProgramList = (isAll = false) => {
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
    api: API_PERF_PROGRAM_LIST,
    fetcher: getPerfProgramList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    perfPrograms: data,
    isPerfProgramListEmpty: isDataEmpty,
    isPerfProgramListLoading: isDataLoading,
    isPerfProgramListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPerfProgramListFilter: setFilter,
    setPerfProgramListPage: setPage,
    setPerfProgramListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePerfProgramList;
