import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_END_YEAR = '/api/perf-end-year';

export const getPerfEndYears = (
  url: string = API_PERF_END_YEAR,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    {
      filter,
      sort: isEmpty(sort) ? { createdAt: 'desc' } : sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePerfEndYears = (defaultFilter?: any) => {
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
    api: API_PERF_END_YEAR,
    fetcher: getPerfEndYears,
    defaultFilter,
  });

  return {
    perfEndYears: data,
    isPerfEndYearsEmpty: isDataEmpty,
    isPerfEndYearsLoading: isDataLoading,
    isPerfEndYearsError: isDataError,
    perfEndYearsTotalCount: dataTotalCount,
    perfEndYearsTotalPage: dataTotalPage,
    perfEndYearsPage: page,
    perfEndYearsPerPage: perPage,
    perfEndYearsRefreshPress: refreshPress,
    perfEndYearsPagePress: pagePress,
    perfEndYearsPerPagePress: perPagePress,
    perfEndYearsSort: sort,
    perfEndYearsSortPress: sortPress,
    perfEndYearsFilter: filter,
    setPerfEndYearsFilter: setFilter,
    setPerfEndYearsPage: setPage,
    setPerfEndYearsPerPage: setPerPage,
    perfEndYearsSelectAllPress: selectAllPress,
    perfEndYearsSelectOnePress: selectOnePress,
    perfEndYearsSelected: selected,
    isPerfEndYearsSelectedAll: isSelectedAll,
    perfEndYearsDeletePress: deletePress,
    isPerfEndYearsDeleteLoading: isDeleteLoading,
    perfEndYearsNextFivePagePress: nextFivePagePress,
    perfEndYearsPrevFivePagePress: prevFivePagePress,
    perfEndYearsFirstPagePress: firstPagePress,
    perfEndYearsLastPagePress: lastPagePress,
  };
};

export default usePerfEndYears;
