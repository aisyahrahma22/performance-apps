import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_TRAINING = '/api/emp-training';

const getEmployees = (
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

const useEmployeeTraining = (defaultFilter?: any) => {
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
    api: API_EMPLOYEE_TRAINING,
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
    employeeNextFivePagePress: nextFivePagePress,
    employeePrevFivePagePress: prevFivePagePress,
    employeeFirstPagePress: firstPagePress,
    employeeLastPagePress: lastPagePress,
  };
};

export default useEmployeeTraining;
