import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';
import { TimelineNoteType } from '../../enums/GoalSetting';

const API_PERF_GOAL_SETTING = '/api/perf-superior/revision';
const API_PERF_MID_YEAR = '/api/perf-mid-year/revision';
const API_PERF_END_YEAR = '/api/perf-end-year/revision';

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

export const getPerfMidYearRevisions = (
  url: string = API_PERF_MID_YEAR,
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

export const getPerfEndYearRevisions = (
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

const usePerfEmpRevisions = (
  defaultFilter?: any,
  timelineNoteType?: TimelineNoteType,
) => {
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
    api:
      timelineNoteType === TimelineNoteType.GOAL_SETTING
        ? API_PERF_GOAL_SETTING
        : timelineNoteType === TimelineNoteType.MID_YEAR
        ? API_PERF_MID_YEAR
        : API_PERF_END_YEAR,
    fetcher:
      timelineNoteType === TimelineNoteType.GOAL_SETTING
        ? getGSRevisions
        : timelineNoteType === TimelineNoteType.MID_YEAR
        ? getPerfMidYearRevisions
        : getPerfEndYearRevisions,
    defaultFilter,
    defaultPerPage: 5,
  });

  return {
    perfEmpRevisions: data,
    isPerfEmpRevisionsEmpty: isDataEmpty,
    isPerfEmpRevisionsLoading: isDataLoading,
    isPerfEmpRevisionsError: isDataError,
    perfEmpRevisionsTotalCount: dataTotalCount,
    perfEmpRevisionsTotalPage: dataTotalPage,
    perfEmpRevisionsPage: page,
    perfEmpRevisionsPerPage: perPage,
    perfEmpRevisionsRefreshPress: refreshPress,
    perfEmpRevisionsPagePress: pagePress,
    perfEmpRevisionsPerPagePress: perPagePress,
    perfEmpRevisionsSort: sort,
    perfEmpRevisionsSortPress: sortPress,
    perfEmpRevisionsFilter: filter,
    setPerfEmpRevisionsFilter: setFilter,
    setPerfEmpRevisionsPage: setPage,
    setPerfEmpRevisionsPerPage: setPerPage,
    perfEmpRevisionsSelectAllPress: selectAllPress,
    perfEmpRevisionsSelectOnePress: selectOnePress,
    perfEmpRevisionsSelected: selected,
    isPerfEmpRevisionsSelectedAll: isSelectedAll,
    perfEmpRevisionsDeletePress: deletePress,
    isPerfEmpRevisionsDeleteLoading: isDeleteLoading,
    perfEmpRevisionsNextFivePagePress: nextFivePagePress,
    perfEmpRevisionsPrevFivePagePress: prevFivePagePress,
    perfEmpRevisionsFirstPagePress: firstPagePress,
    perfEmpRevisionsLastPagePress: lastPagePress,
  };
};

export default usePerfEmpRevisions;
