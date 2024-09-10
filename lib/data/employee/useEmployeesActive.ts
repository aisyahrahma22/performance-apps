import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_ACTIVE = '/api/employee/active';

export const getEmployeesActive = (
  url: string = API_EMPLOYEE_ACTIVE,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
  filterType: 'or' | 'and' = 'and',
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage, filterType },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useEmployeesActive = (defaultFilter?: any) => {
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_EMPLOYEE_ACTIVE,
    fetcher: getEmployeesActive,
    defaultFilter,
  });

  return {
    employeeActivesActive: data,
    isEmployeeActiveEmpty: isDataEmpty,
    isEmployeeActiveLoading: isDataLoading,
    isEmployeeActiveError: isDataError,
    employeeActiveTotalCount: dataTotalCount,
    employeeActiveTotalPage: dataTotalPage,
    employeeActivePage: page,
    employeeActivePerPage: perPage,
    employeeActiveRefreshPress: refreshPress,
    employeeActivePagePress: pagePress,
    employeeActivePerPagePress: perPagePress,
    employeeActiveSort: sort,
    employeeActiveSortPress: sortPress,
    setEmployeeActiveFilter: setFilter,
    setEmployeeActivePage: setPage,
    setEmployeeActivePerPage: setPerPage,
    employeeActiveSelectAllPress: selectAllPress,
    employeeActiveSelectOnePress: selectOnePress,
    employeeActiveSelected: selected,
    isEmployeeActiveSelectedAll: isSelectedAll,
    employeeActiveNextFivePagePress: nextFivePagePress,
    employeeActivePrevFivePagePress: prevFivePagePress,
    employeeActiveFirstPagePress: firstPagePress,
    employeeActiveLastPagePress: lastPagePress,
  };
};

export default useEmployeesActive;
