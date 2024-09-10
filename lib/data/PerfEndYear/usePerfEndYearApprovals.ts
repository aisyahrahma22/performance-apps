import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_END_YEAR = '/api/perf-end-year/approval';

export const getPerfEndYearApprovals = (
  url: string = API_PERF_END_YEAR,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    {
      filter,
      sort: isEmpty(sort) ? { createdAt: 'desc' } : sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const usePerfEndYearApprovals = (defaultFilter?: any) => {
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
    api: API_PERF_END_YEAR,
    fetcher: getPerfEndYearApprovals,
    defaultFilter,
  });

  return {
    perfEndYearApprovals: data,
    isPerfEndYearApprovalsEmpty: isDataEmpty,
    isPerfEndYearApprovalsLoading: isDataLoading,
    isPerfEndYearApprovalsError: isDataError,
    perfEndYearApprovalsTotalCount: dataTotalCount,
    perfEndYearApprovalsTotalPage: dataTotalPage,
    perfEndYearApprovalsPage: page,
    perfEndYearApprovalsPerPage: perPage,
    perfEndYearApprovalsRefreshPress: refreshPress,
    perfEndYearApprovalsPagePress: pagePress,
    perfEndYearApprovalsPerPagePress: perPagePress,
    perfEndYearApprovalsSort: sort,
    perfEndYearApprovalsSortPress: sortPress,
    perfEndYearApprovalsFilter: filter,
    setPerfEndYearApprovalsFilter: setFilter,
    setPerfEndYearApprovalsPage: setPage,
    setPerfEndYearApprovalsPerPage: setPerPage,
    perfEndYearApprovalsSelectAllPress: selectAllPress,
    perfEndYearApprovalsSelectOnePress: selectOnePress,
    perfEndYearApprovalsSelected: selected,
    isPerfEndYearApprovalsSelectedAll: isSelectedAll,
    perfEndYearApprovalsDeletePress: deletePress,
    isPerfEndYearApprovalsDeleteLoading: isDeleteLoading,
    perfEndYearApprovalsNextFivePagePress: nextFivePagePress,
    perfEndYearApprovalsPrevFivePagePress: prevFivePagePress,
    perfEndYearApprovalsFirstPagePress: firstPagePress,
    perfEndYearApprovalsLastPagePress: lastPagePress,
  };
};

export default usePerfEndYearApprovals;
