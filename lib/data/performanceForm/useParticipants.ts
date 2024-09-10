import { isEmpty } from 'lodash';
import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_FORM_EMPLOYEE_PARTICIPANT =
  '/api/performance-form/employee-participants';
const API_PERF_FORM_POSITION_PARTICIPANT =
  '/api/performance-form/position-participants';

export const getParticipant = (
  url: string = API_PERF_FORM_EMPLOYEE_PARTICIPANT,
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

const useParticipant = (isEmployee?: boolean) => {
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
    api: isEmployee
      ? API_PERF_FORM_EMPLOYEE_PARTICIPANT
      : API_PERF_FORM_POSITION_PARTICIPANT,
    fetcher: getParticipant,
    defaultPerPage: 10,
  });

  return {
    perfFormParticipant: data,
    isPerfFormParticipantEmpty: isDataEmpty,
    isPerfFormParticipantLoading: isDataLoading,
    isPerfFormParticipantError: isDataError,
    perfFormParticipantTotalCount: dataTotalCount,
    perfFormParticipantTotalPage: dataTotalPage,
    perfFormParticipantPage: page,
    perfFormParticipantPerPage: perPage,
    perfFormParticipantRefreshPress: refreshPress,
    perfFormParticipantPagePress: pagePress,
    perfFormParticipantPerPagePress: perPagePress,
    perfFormParticipantSort: sort,
    perfFormParticipantSortPress: sortPress,
    perfFormParticipantFilter: filter,
    setPerfFormParticipantFilter: setFilter,
    setPerfFormParticipantPage: setPage,
    setPerfFormParticipantPerPage: setPerPage,
    perfFormParticipantSelectAllPress: selectAllPress,
    perfFormParticipantSelectOnePress: selectOnePress,
    perfFormParticipantSelected: selected,
    isPerfFormParticipantSelectedAll: isSelectedAll,
    perfFormParticipantDeletePress: deletePress,
    isPerfFormParticipantDeleteLoading: isDeleteLoading,
    perfFormParticipantNextFivePagePress: nextFivePagePress,
    perfFormParticipantPrevFivePagePress: prevFivePagePress,
    perfFormParticipantFirstPagePress: firstPagePress,
    perfFormParticipantLastPagePress: lastPagePress,
  };
};

export default useParticipant;
