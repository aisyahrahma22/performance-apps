import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCEKPI = '/api/performancekpi';
const API_DELETE_ALL_PERFORMANCEKPI = '/api/performancekpi/all';

const getPerformanceKPI = (
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

const deletePerformancesKPI = (ids: string) => {
  return axios
    .delete(API_PERFORMANCEKPI, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesKPI = () => {
  return axios.delete(API_DELETE_ALL_PERFORMANCEKPI).then((resp) => resp.data);
};

const usePerformancesKPI = () => {
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
    api: API_PERFORMANCEKPI,
    fetcher: getPerformanceKPI,
    fetcherDelete: deletePerformancesKPI,
    fetcherDeleteAll: deleteAllPerformancesKPI,
  });

  return {
    performancesKPI: data,
    isPerformanceKPIEmpty: isDataEmpty,
    isPerformanceKPILoading: isDataLoading,
    isPerformanceKPIError: isDataError,
    performanceKPITotalCount: dataTotalCount,
    performanceKPITotalPage: dataTotalPage,
    performanceKPIPage: page,
    performanceKPIPerPage: perPage,
    performanceKPIRefreshPress: refreshPress,
    performanceKPIPagePress: pagePress,
    performanceKPIPerPagePress: perPagePress,
    performanceKPISort: sort,
    performanceKPISortPress: sortPress,
    setPerformanceKPIFilter: setFilter,
    setPerformanceKPIPage: setPage,
    setPerformanceKPIPerPage: setPerPage,
    performanceKPISelectAllPress: selectAllPress,
    performanceKPISelectOnePress: selectOnePress,
    performanceKPISelected: selected,
    isPerformanceKPISelectedAll: isSelectedAll,
    performancesKPIDeletePress: deletePress,
    isPerformancesKPIDeleteLoading: isDeleteLoading,
    performanceKPINextFivePagePress: nextFivePagePress,
    performanceKPIPrevFivePagePress: prevFivePagePress,
    performanceKPIFirstPagePress: firstPagePress,
    performanceKPILastPagePress: lastPagePress,
  };
};

export default usePerformancesKPI;
