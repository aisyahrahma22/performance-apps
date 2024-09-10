import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_EMPLOYEE_LA_DETAILS = '/api/emp-leadership-assessment/details';
const API_EMPLOYEE_LA_DETAIL = '/api/emp-leadership-assessment/detail';
const API_EMPLOYEE_LA_DETAIL_ALL = '/api/emp-leadership-assessment/detail/all';

const getEmployeeLeadershipDetails = (
  url: string = API_EMPLOYEE_LA_DETAILS,
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

const deleteEmpLADetail = (ids: string[]) => {
  return axios
    .delete(API_EMPLOYEE_LA_DETAIL, { data: ids })
    .then((resp) => resp.data);
};

const useEmployeeLeadershipDetailList = (empLAId: string) => {
  const deleteAllEmpLADetail = () => {
    return axios
      .delete(API_EMPLOYEE_LA_DETAIL_ALL, { data: { empLAId } })
      .then((resp) => resp.data);
  };

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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_EMPLOYEE_LA_DETAILS,
    fetcher: getEmployeeLeadershipDetails,
    fetcherDelete: deleteEmpLADetail,
    fetcherDeleteAll: deleteAllEmpLADetail,
    defaultPerPage: 5,
  });

  return {
    empLADetail: data,
    isEmpLADetailEmpty: isDataEmpty,
    isEmpLADetailLoading: isDataLoading,
    isEmpLADetailError: isDataError,
    empLADetailTotalCount: dataTotalCount,
    empLADetailTotalPage: dataTotalPage,
    empLADetailPage: page,
    empLADetailPerPage: perPage,
    empLADetailRefreshPress: refreshPress,
    empLADetailPagePress: pagePress,
    empLADetailPerPagePress: perPagePress,
    empLADetailSort: sort,
    empLADetailSortPress: sortPress,
    setEmpLADetailFilter: setFilter,
    setEmpLADetailPage: setPage,
    setEmpLADetailPerPage: setPerPage,
    empLADetailSelectAllPress: selectAllPress,
    empLADetailSelectOnePress: selectOnePress,
    empLADetailSelected: selected,
    isEmpLADetailSelectedAll: isSelectedAll,
    empLADetailDeletePress: deletePress,
    empLADetailNextFivePagePress: nextFivePagePress,
    empLADetailPrevFivePagePress: prevFivePagePress,
    empLADetailFirstPagePress: firstPagePress,
    empLADetailLastPagePress: lastPagePress,
  };
};

export default useEmployeeLeadershipDetailList;
