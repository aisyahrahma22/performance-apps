import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_LA = '/api/emp-leadership-assessment';

const getEmployeeLeaderships = (
  url: string = API_EMPLOYEE_LA,
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

const useEmployeeLeaderships = (defaultFilter?: any) => {
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
    api: API_EMPLOYEE_LA,
    fetcher: getEmployeeLeaderships,
    defaultFilter,
  });

  return {
    empLeaderships: data,
    isEmpLeadershipsEmpty: isDataEmpty,
    isEmpLeadershipsLoading: isDataLoading,
    isEmpLeadershipsError: isDataError,
    empLeadershipsTotalCount: dataTotalCount,
    empLeadershipsTotalPage: dataTotalPage,
    empLeadershipsPage: page,
    empLeadershipsPerPage: perPage,
    empLeadershipsRefreshPress: refreshPress,
    empLeadershipsPagePress: pagePress,
    empLeadershipsPerPagePress: perPagePress,
    empLeadershipsSort: sort,
    empLeadershipsSortPress: sortPress,
    setEmpLeadershipsFilter: setFilter,
    setEmpLeadershipsPage: setPage,
    setEmpLeadershipsPerPage: setPerPage,
    empLeadershipsNextFivePagePress: nextFivePagePress,
    empLeadershipsPrevFivePagePress: prevFivePagePress,
    empLeadershipsFirstPagePress: firstPagePress,
    empLeadershipsLastPagePress: lastPagePress,
  };
};

export default useEmployeeLeaderships;
