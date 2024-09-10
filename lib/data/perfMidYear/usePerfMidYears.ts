import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_MID_YEAR = '/api/perf-mid-year';

export const getPerfMidYears = (
  url: string = API_PERF_MID_YEAR,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    {
      filter,
      sort: isEmpty(sort) ? { createdAt: 'DESC' } : sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePerfMidYears = (defaultFilter?: any) => {
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
    filter,
    setFilter,
    setPage,
    setPerPage,
    selectAllPress,
    selectOnePress,
    selected,
    isSelectedAll,
    deletePress,
    isDeleteLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_PERF_MID_YEAR,
    fetcher: getPerfMidYears,
    defaultFilter,
  });

  return {
    perfMidYears: data,
    isPerfMidYearsEmpty: isDataEmpty,
    isPerfMidYearsLoading: isDataLoading,
    isPerfMidYearsError: isDataError,
    perfMidYearsTotalCount: dataTotalCount,
    perfMidYearsTotalPage: dataTotalPage,
    perfMidYearsPage: page,
    perfMidYearsPerPage: perPage,
    perfMidYearsRefreshPress: refreshPress,
    perfMidYearsPagePress: pagePress,
    perfMidYearsPerPagePress: perPagePress,
    perfMidYearsSort: sort,
    perfMidYearsSortPress: sortPress,
    perfMidYearsFilter: filter,
    setPerfMidYearsFilter: setFilter,
    setPerfMidYearsPage: setPage,
    setPerfMidYearsPerPage: setPerPage,
    perfMidYearsSelectAllPress: selectAllPress,
    perfMidYearsSelectOnePress: selectOnePress,
    perfMidYearsSelected: selected,
    isPerfMidYearsSelectedAll: isSelectedAll,
    perfMidYearsDeletePress: deletePress,
    isPerfMidYearsDeleteLoading: isDeleteLoading,
    perfMidYearsNextFivePagePress: nextFivePagePress,
    perfMidYearsPrevFivePagePress: prevFivePagePress,
    perfMidYearsFirstPagePress: firstPagePress,
    perfMidYearsLastPagePress: lastPagePress,
  };
};

export default usePerfMidYears;
