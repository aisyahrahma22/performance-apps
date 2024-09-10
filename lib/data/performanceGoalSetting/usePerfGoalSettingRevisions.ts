import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_GOAL_SETTING = '/api/perf-superior/revision';

export const getGSRevisions = (
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

const usePerfGoalSettingRevisions = (defaultFilter?: any) => {
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
  } = useDataTable({
    api: API_PERF_GOAL_SETTING,
    fetcher: getGSRevisions,
    defaultFilter,
    defaultPerPage: 5,
  });

  return {
    perfGoalSettingRevisions: data,
    isPerfGoalSettingRevisionsEmpty: isDataEmpty,
    isPerfGoalSettingRevisionsLoading: isDataLoading,
    isPerfGoalSettingRevisionsError: isDataError,
    perfGoalSettingRevisionsTotalCount: dataTotalCount,
    perfGoalSettingRevisionsTotalPage: dataTotalPage,
    perfGoalSettingRevisionsPage: page,
    perfGoalSettingRevisionsPerPage: perPage,
    perfGoalSettingRevisionsRefreshPress: refreshPress,
    perfGoalSettingRevisionsPagePress: pagePress,
    perfGoalSettingRevisionsPerPagePress: perPagePress,
    perfGoalSettingRevisionsSort: sort,
    perfGoalSettingRevisionsSortPress: sortPress,
    perfGoalSettingRevisionsFilter: filter,
    setPerfGoalSettingRevisionsFilter: setFilter,
    setPerfGoalSettingRevisionsPage: setPage,
    setPerfGoalSettingRevisionsPerPage: setPerPage,
    perfGoalSettingRevisionsSelectAllPress: selectAllPress,
    perfGoalSettingRevisionsSelectOnePress: selectOnePress,
    perfGoalSettingRevisionsSelected: selected,
    isPerfGoalSettingRevisionsSelectedAll: isSelectedAll,
    perfGoalSettingRevisionsDeletePress: deletePress,
    isPerfGoalSettingRevisionsDeleteLoading: isDeleteLoading,
  };
};

export default usePerfGoalSettingRevisions;
