import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_VERIFICATION = '/api/employee/verification';
const API_EMPLOYEE_VERIFICATION_ALL = '/api/employee/verification/all';

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

const verifyEmployees = (ids: string) => {
  return axios.post(API_EMPLOYEE_VERIFICATION, ids).then((resp) => resp.data);
};

const verifyAllEmployee = (filter: any) => {
  const qsp = qs.stringify({ filter }, { skipNulls: true });
  return axios
    .post(`${API_EMPLOYEE_VERIFICATION_ALL}?${qsp}`)
    .then((resp) => resp.data);
};

const useEmployeeVerification = (defaultFilter?: any) => {
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
    verificationPress,
    isVerificationLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_EMPLOYEE_VERIFICATION,
    fetcher: getEmployees,
    fetcherVerification: verifyEmployees,
    fetcherVerificationAll: verifyAllEmployee,
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
    isEmployeesSelectedAll: isSelectedAll,
    employeeVerificationPress: verificationPress,
    isEmployeesVerificationLoading: isVerificationLoading,
    employeeNextFivePagePress: nextFivePagePress,
    employeePrevFivePagePress: prevFivePagePress,
    employeeFirstPagePress: firstPagePress,
    employeeLastPagePress: lastPagePress,
  };
};

export default useEmployeeVerification;
