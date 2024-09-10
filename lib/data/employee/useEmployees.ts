import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE = '/api/employee';

export const getEmployees = (
  url: string = API_EMPLOYEE,
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

const useEmployees = (defaultFilter?: any) => {
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
    api: API_EMPLOYEE,
    fetcher: getEmployees,
    defaultFilter,
  });

  return {
    employees: data,
    isEmployeeEmpty: isDataEmpty,
    isEmployeeLoading: isDataLoading,
    isEmployeeError: isDataError,
    employeeTotalCount: dataTotalCount,
    employeeTotalPage: dataTotalPage,
    employeePage: page,
    employeePerPage: perPage,
    employeeRefreshPress: refreshPress,
    employeePagePress: pagePress,
    employeePerPagePress: perPagePress,
    employeeSort: sort,
    employeeSortPress: sortPress,
    setEmployeeFilter: setFilter,
    setEmployeePage: setPage,
    setEmployeePerPage: setPerPage,
    employeeSelectAllPress: selectAllPress,
    employeeSelectOnePress: selectOnePress,
    employeeSelected: selected,
    isEmployeeSelectedAll: isSelectedAll,
    employeeNextFivePagePress: nextFivePagePress,
    employeePrevFivePagePress: prevFivePagePress,
    employeeFirstPagePress: firstPagePress,
    employeeLastPagePress: lastPagePress,
  };
};

export default useEmployees;
