import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_GOAL_SETTING = '/api/perf-superior/notes';

export const getPerfGoalSettingNotes = (
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

const usePerfGoalSettingNotes = (defaultFilter?: any) => {
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
    fetcher: getPerfGoalSettingNotes,
    defaultFilter,
    defaultPerPage: 5,
  });

  return {
    perfGoalSettingNotes: data,
    isPerfGoalSettingNotesEmpty: isDataEmpty,
    isPerfGoalSettingNotesLoading: isDataLoading,
    isPerfGoalSettingNotesError: isDataError,
    perfGoalSettingNotesTotalCount: dataTotalCount,
    perfGoalSettingNotesTotalPage: dataTotalPage,
    perfGoalSettingNotesPage: page,
    perfGoalSettingNotesPerPage: perPage,
    perfGoalSettingNotesRefreshPress: refreshPress,
    perfGoalSettingNotesPagePress: pagePress,
    perfGoalSettingNotesPerPagePress: perPagePress,
    perfGoalSettingNotesSort: sort,
    perfGoalSettingNotesSortPress: sortPress,
    perfGoalSettingNotesFilter: filter,
    setPerfGoalSettingNotesFilter: setFilter,
    setPerfGoalSettingNotesPage: setPage,
    setPerfGoalSettingNotesPerPage: setPerPage,
    perfGoalSettingNotesSelectAllPress: selectAllPress,
    perfGoalSettingNotesSelectOnePress: selectOnePress,
    perfGoalSettingNotesSelected: selected,
    isPerfGoalSettingNotesSelectedAll: isSelectedAll,
    perfGoalSettingNotesDeletePress: deletePress,
    isPerfGoalSettingNotesDeleteLoading: isDeleteLoading,
    perfGoalSettingNotesNextFivePagePress: nextFivePagePress,
    perfGoalSettingNotesPrevFivePagePress: prevFivePagePress,
    perfGoalSettingNotesFirstPagePress: firstPagePress,
    perfGoalSettingNotesLastPagePress: lastPagePress,
  };
};

export default usePerfGoalSettingNotes;
