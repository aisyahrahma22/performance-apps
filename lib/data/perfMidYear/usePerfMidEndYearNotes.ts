import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_MID_YEAR = '/api/perf-mid-year/notes';
const API_PERF_END_YEAR = '/api/perf-end-year/notes';

export const getPerfMidYearNotes = (
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

export const getPerfEndYearNotes = (
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

const usePerfEmpNotes = (defaultFilter?: any, isEndYear?: boolean) => {
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
    api: isEndYear ? API_PERF_END_YEAR : API_PERF_MID_YEAR,
    fetcher: isEndYear ? getPerfEndYearNotes : getPerfMidYearNotes,
    defaultFilter,
    defaultPerPage: 5,
  });

  return {
    perfEmpNotes: data,
    isPerfEmpNotesEmpty: isDataEmpty,
    isPerfEmpNotesLoading: isDataLoading,
    isPerfEmpNotesError: isDataError,
    perfEmpNotesTotalCount: dataTotalCount,
    perfEmpNotesTotalPage: dataTotalPage,
    perfEmpNotesPage: page,
    perfEmpNotesPerPage: perPage,
    perfEmpNotesRefreshPress: refreshPress,
    perfEmpNotesPagePress: pagePress,
    perfEmpNotesPerPagePress: perPagePress,
    perfEmpNotesSort: sort,
    perfEmpNotesSortPress: sortPress,
    perfEmpNotesFilter: filter,
    setPerfEmpNotesFilter: setFilter,
    setPerfEmpNotesPage: setPage,
    setPerfEmpNotesPerPage: setPerPage,
    perfEmpNotesSelectAllPress: selectAllPress,
    perfEmpNotesSelectOnePress: selectOnePress,
    perfEmpNotesSelected: selected,
    isPerfEmpNotesSelectedAll: isSelectedAll,
    perfEmpNotesDeletePress: deletePress,
    isPerfEmpNotesDeleteLoading: isDeleteLoading,
    perfEmpNotesNextFivePagePress: nextFivePagePress,
    perfEmpNotesPrevFivePagePress: prevFivePagePress,
    perfEmpNotesFirstPagePress: firstPagePress,
    perfEmpNotesLastPagePress: lastPagePress,
  };
};

export default usePerfEmpNotes;
