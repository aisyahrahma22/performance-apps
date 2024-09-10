import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_GOAL_SETTING_APPROVAL = '/api/perf-superior';
const API_DELETE_ALL_PERF_GOAL_SETTING_APPROVAL = '/api/perf-superior/all';

const getPerfGoalSettingApproval = (
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

const deletePerfGoalSettingApproval = (ids: string) => {
  return axios
    .delete(API_PERF_GOAL_SETTING_APPROVAL, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerfGoalSettingApproval = () => {
  return axios
    .delete(API_DELETE_ALL_PERF_GOAL_SETTING_APPROVAL)
    .then((resp) => resp.data);
};

const usePerfGoalSettingApproval = (defaultFilter?: any) => {
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
    isDeleteLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_PERF_GOAL_SETTING_APPROVAL,
    fetcher: getPerfGoalSettingApproval,
    fetcherDelete: deletePerfGoalSettingApproval,
    fetcherDeleteAll: deleteAllPerfGoalSettingApproval,
    defaultFilter,
  });

  return {
    perfGoalSettingApproval: data,
    isPerfGoalSettingApprovalEmpty: isDataEmpty,
    isPerfGoalSettingApprovalLoading: isDataLoading,
    isPerfGoalSettingApprovalError: isDataError,
    perfGoalSettingApprovalTotalCount: dataTotalCount,
    perfGoalSettingApprovalTotalPage: dataTotalPage,
    perfGoalSettingApprovalPage: page,
    perfGoalSettingApprovalPerPage: perPage,
    perfGoalSettingApprovalRefreshPress: refreshPress,
    perfGoalSettingApprovalPagePress: pagePress,
    perfGoalSettingApprovalPerPagePress: perPagePress,
    perfGoalSettingApprovalSort: sort,
    perfGoalSettingApprovalSortPress: sortPress,
    setPerfGoalSettingApprovalFilter: setFilter,
    setPerfGoalSettingApprovalPage: setPage,
    setPerfGoalSettingApprovalPerPage: setPerPage,
    perfGoalSettingApprovalSelectAllPress: selectAllPress,
    perfGoalSettingApprovalSelectOnePress: selectOnePress,
    perfGoalSettingApprovalSelected: selected,
    isPerfGoalSettingApprovalSelectedAll: isSelectedAll,
    perfGoalSettingApprovalsDeletePress: deletePress,
    isPerfGoalSettingApprovalsDeleteLoading: isDeleteLoading,
    perfGoalSettingApprovalNextFivePagePress: nextFivePagePress,
    perfGoalSettingApprovalPrevFivePagePress: prevFivePagePress,
    perfGoalSettingApprovalFirstPagePress: firstPagePress,
    perfGoalSettingApprovalLastPagePress: lastPagePress,
  };
};

export default usePerfGoalSettingApproval;
