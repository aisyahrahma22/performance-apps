import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_GOAL_SETTING = '/api/perf-superior/approval';

export const getPerfGSApproval = (
  url: string = API_PERF_GOAL_SETTING,
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

const usePerfGSApproval = (defaultFilter?: any) => {
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
    api: API_PERF_GOAL_SETTING,
    fetcher: getPerfGSApproval,
    defaultFilter,
    defaultPerPage: 5,
  });

  return {
    perfGSApproval: data,
    isPerfGSApprovalEmpty: isDataEmpty,
    isPerfGSApprovalLoading: isDataLoading,
    isPerfGSApprovalError: isDataError,
    perfGSApprovalTotalCount: dataTotalCount,
    perfGSApprovalTotalPage: dataTotalPage,
    perfGSApprovalPage: page,
    perfGSApprovalPerPage: perPage,
    perfGSApprovalRefreshPress: refreshPress,
    perfGSApprovalPagePress: pagePress,
    perfGSApprovalPerPagePress: perPagePress,
    perfGSApprovalSort: sort,
    perfGSApprovalSortPress: sortPress,
    perfGSApprovalFilter: filter,
    setPerfGSApprovalFilter: setFilter,
    setPerfGSApprovalPage: setPage,
    setPerfGSApprovalPerPage: setPerPage,
    perfGSApprovalSelectAllPress: selectAllPress,
    perfGSApprovalSelectOnePress: selectOnePress,
    perfGSApprovalSelected: selected,
    isPerfGSApprovalSelectedAll: isSelectedAll,
    perfGSApprovalDeletePress: deletePress,
    isPerfGSApprovalDeleteLoading: isDeleteLoading,
    perfGSApprovalNextFivePagePress: nextFivePagePress,
    perfGSApprovalPrevFivePagePress: prevFivePagePress,
    perfGSApprovalFirstPagePress: firstPagePress,
    perfGSApprovalLastPagePress: lastPagePress,
  };
};

export default usePerfGSApproval;
