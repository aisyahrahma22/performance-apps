import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_MID_YEAR = '/api/perf-mid-year/approval';

export const getPerfMidYearApprovals = (
  url: string = API_PERF_MID_YEAR,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    {
      filter,
      sort: isEmpty(sort) ? { createdAt: 'DESC' } : sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePerfMidYearApprovals = (defaultFilter?: any) => {
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
    filter,
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
    api: API_PERF_MID_YEAR,
    fetcher: getPerfMidYearApprovals,
    defaultFilter,
  });

  return {
    perfMidYearApprovals: data,
    isPerfMidYearApprovalsEmpty: isDataEmpty,
    isPerfMidYearApprovalsLoading: isDataLoading,
    isPerfMidYearApprovalsError: isDataError,
    perfMidYearApprovalsTotalCount: dataTotalCount,
    perfMidYearApprovalsTotalPage: dataTotalPage,
    perfMidYearApprovalsPage: page,
    perfMidYearApprovalsPerPage: perPage,
    perfMidYearApprovalsRefreshPress: refreshPress,
    perfMidYearApprovalsPagePress: pagePress,
    perfMidYearApprovalsPerPagePress: perPagePress,
    perfMidYearApprovalsSort: sort,
    perfMidYearApprovalsSortPress: sortPress,
    perfMidYearApprovalsFilter: filter,
    setPerfMidYearApprovalsFilter: setFilter,
    setPerfMidYearApprovalsPage: setPage,
    setPerfMidYearApprovalsPerPage: setPerPage,
    perfMidYearApprovalsSelectAllPress: selectAllPress,
    perfMidYearApprovalsSelectOnePress: selectOnePress,
    perfMidYearApprovalsSelected: selected,
    isPerfMidYearApprovalsSelectedAll: isSelectedAll,
    perfMidYearApprovalsDeletePress: deletePress,
    isPerfMidYearApprovalsDeleteLoading: isDeleteLoading,
    perfMidYearApprovalsNextFivePagePress: nextFivePagePress,
    perfMidYearApprovalsPrevFivePagePress: prevFivePagePress,
    perfMidYearApprovalsFirstPagePress: firstPagePress,
    perfMidYearApprovalsLastPagePress: lastPagePress,
  };
};

export default usePerfMidYearApprovals;
