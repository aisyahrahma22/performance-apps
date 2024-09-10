import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_PERFORMANCE = '/api/emp-performance';

const getEmployeePerformances = (
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

const useEmployeePerformances = (defaultFilter?: any) => {
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_EMPLOYEE_PERFORMANCE,
    fetcher: getEmployeePerformances,
    defaultFilter,
  });

  return {
    empPerformances: data,
    isEmpPerformancesEmpty: isDataEmpty,
    isEmpPerformancesLoading: isDataLoading,
    isEmpPerformancesError: isDataError,
    empPerformancesTotalCount: dataTotalCount,
    empPerformancesTotalPage: dataTotalPage,
    empPerformancesPage: page,
    empPerformancesPerPage: perPage,
    empPerformancesRefreshPress: refreshPress,
    empPerformancesPagePress: pagePress,
    empPerformancesPerPagePress: perPagePress,
    empPerformancesSort: sort,
    empPerformancesSortPress: sortPress,
    setEmpPerformancesFilter: setFilter,
    setEmpPerformancesPage: setPage,
    setEmpPerformancesPerPage: setPerPage,
    empPerformancesNextFivePagePress: nextFivePagePress,
    empPerformancesPrevFivePagePress: prevFivePagePress,
    empPerformancesFirstPagePress: firstPagePress,
    empPerformancesLastPagePress: lastPagePress,
  };
};

export default useEmployeePerformances;
