import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_WORKFLOW_EMPLOYEE = '/api/performanceworkflow/employee';
const API_DELETE_PERFORMANCE_WORKFLOW_EMPLOYEE =
  '/api/performanceworkflow/delete';

const getPerformanceWorkflowEmployee = (
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

const deletePerformanceWorkflowEmployee = (id: string) => {
  return axios
    .patch(API_DELETE_PERFORMANCE_WORKFLOW_EMPLOYEE, { id: id })
    .then((resp) => resp.data);
};
const usePerformanceWorkflowEmployees = () => {
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
    isSelectedAll,
    deletePress,
    isDeleteLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_PERFORMANCE_WORKFLOW_EMPLOYEE,
    fetcher: getPerformanceWorkflowEmployee,
    fetcherDelete: deletePerformanceWorkflowEmployee,
  });

  return {
    performanceWorkflowEmployee: data,
    isPerformanceWorkflowEmployeeEmpty: isDataEmpty,
    isPerformanceWorkflowEmployeeLoading: isDataLoading,
    isPerformanceWorkflowEmployeeError: isDataError,
    performanceWorkflowEmployeeTotalCount: dataTotalCount,
    performanceWorkflowEmployeeTotalPage: dataTotalPage,
    performanceWorkflowEmployeePage: page,
    performanceWorkflowEmployeePerPage: perPage,
    performanceWorkflowEmployeeRefreshPress: refreshPress,
    performanceWorkflowEmployeePagePress: pagePress,
    performanceWorkflowEmployeePerPagePress: perPagePress,
    performanceWorkflowEmployeeSort: sort,
    performanceWorkflowEmployeeSortPress: sortPress,
    setPerformanceWorkflowEmployeeFilter: setFilter,
    setPerformanceWorkflowEmployeePage: setPage,
    setPerformanceWorkflowEmployeePerPage: setPerPage,
    isPerformanceWorkflowEmployeeSelectedAll: isSelectedAll,
    performanceWorkflowEmployeeDeletePress: deletePress,
    isPerformanceWorkflowEmployeeDeleteLoading: isDeleteLoading,
    performanceWorkflowEmployeeNextFivePagePress: nextFivePagePress,
    performanceWorkflowEmployeePrevFivePagePress: prevFivePagePress,
    performanceWorkflowEmployeeFirstPagePress: firstPagePress,
    performanceWorkflowEmployeeLastPagePress: lastPagePress,
  };
};

export default usePerformanceWorkflowEmployees;
