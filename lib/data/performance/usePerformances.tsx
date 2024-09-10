import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE = '/api/performance';
const API_DELETE_ALL_PERFORMANCE = '/api/performance/all';

const getPerformance = (
  url: string,
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

const deletePerformances = (ids: string) => {
  return axios.delete(API_PERFORMANCE, { data: ids }).then((resp) => resp.data);
};

const deleteAllPerformances = () => {
  return axios.delete(API_DELETE_ALL_PERFORMANCE).then((resp) => resp.data);
};

const usePerformances = () => {
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
    api: API_PERFORMANCE,
    fetcher: getPerformance,
    fetcherDelete: deletePerformances,
    fetcherDeleteAll: deleteAllPerformances,
  });

  return {
    performances: data,
    isPerformanceEmpty: isDataEmpty,
    isPerformanceLoading: isDataLoading,
    isPerformanceError: isDataError,
    performanceTotalCount: dataTotalCount,
    performanceTotalPage: dataTotalPage,
    performancePage: page,
    performancePerPage: perPage,
    performanceRefreshPress: refreshPress,
    performancePagePress: pagePress,
    performancePerPagePress: perPagePress,
    performanceSort: sort,
    performanceSortPress: sortPress,
    setPerformanceFilter: setFilter,
    setPerformancePage: setPage,
    setPerformancePerPage: setPerPage,
    performanceSelectAllPress: selectAllPress,
    performanceSelectOnePress: selectOnePress,
    performanceSelected: selected,
    isPerformanceSelectedAll: isSelectedAll,
    performancesDeletePress: deletePress,
    isPerformancesDeleteLoading: isDeleteLoading,
    performanceNextFivePagePress: nextFivePagePress,
    performancePrevFivePagePress: prevFivePagePress,
    performanceFirstPagePress: firstPagePress,
    performanceLastPagePress: lastPagePress,
  };
};

export default usePerformances;
