import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_GOAL_SETTING = '/api/perf-employee';

const getPerfGoalSettings = (
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

const usePerfGoalSetting = (defaultFilter?: any) => {
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
    api: API_PERFORMANCE_GOAL_SETTING,
    fetcher: getPerfGoalSettings,
    defaultFilter,
  });

  return {
    perfGoalSetting: data,
    isPerfGoalSettingEmpty: isDataEmpty,
    isPerfGoalSettingLoading: isDataLoading,
    isPerfGoalSettingError: isDataError,
    perfGoalSettingTotalCount: dataTotalCount,
    perfGoalSettingTotalPage: dataTotalPage,
    perfGoalSettingPage: page,
    perfGoalSettingPerPage: perPage,
    perfGoalSettingRefreshPress: refreshPress,
    perfGoalSettingPagePress: pagePress,
    perfGoalSettingPerPagePress: perPagePress,
    perfGoalSettingSort: sort,
    perfGoalSettingSortPress: sortPress,
    setPerfGoalSettingFilter: setFilter,
    setPerfGoalSettingPage: setPage,
    setPerfGoalSettingPerPage: setPerPage,
    perfGoalSettingSelectAllPress: selectAllPress,
    perfGoalSettingSelectOnePress: selectOnePress,
    perfGoalSettingSelected: selected,
    isPerfGoalSettingSelectedAll: isSelectedAll,
    perfGoalSettingsDeletePress: deletePress,
    isPerfGoalSettingsDeleteLoading: isDeleteLoading,
    perfGoalSettingNextFivePagePress: nextFivePagePress,
    perfGoalSettingPrevFivePagePress: prevFivePagePress,
    perfGoalSettingFirstPagePress: firstPagePress,
    perfGoalSettingLastPagePress: lastPagePress,
  };
};

export default usePerfGoalSetting;
