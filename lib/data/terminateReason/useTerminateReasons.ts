import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_TERMINATE_REASON = '/api/terminate-reason';

export const getTerminateReasons = (
  url: string = API_TERMINATE_REASON,
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

const useTerminateReasons = () => {
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
    api: API_TERMINATE_REASON,
    fetcher: getTerminateReasons,
  });

  return {
    terminateReasons: data,
    isTerminateReasonsEmpty: isDataEmpty,
    isTerminateReasonsLoading: isDataLoading,
    isTerminateReasonsError: isDataError,
    terminateReasonsTotalCount: dataTotalCount,
    terminateReasonsTotalPage: dataTotalPage,
    terminateReasonsPage: page,
    terminateReasonsPerPage: perPage,
    terminateReasonsRefreshPress: refreshPress,
    terminateReasonsPagePress: pagePress,
    terminateReasonsPerPagePress: perPagePress,
    terminateReasonsSort: sort,
    terminateReasonsSortPress: sortPress,
    setTerminateReasonsFilter: setFilter,
    setTerminateReasonsPage: setPage,
    setTerminateReasonsPerPage: setPerPage,
    terminateReasonsSelectAllPress: selectAllPress,
    terminateReasonsSelectOnePress: selectOnePress,
    terminateReasonsSelected: selected,
    isTerminateReasonsSelectedAll: isSelectedAll,
    terminateReasonsDeletePress: deletePress,
    isTerminateReasonsDeleteLoading: isDeleteLoading,
    terminateReasonsNextFivePagePress: nextFivePagePress,
    terminateReasonsPrevFivePagePress: prevFivePagePress,
    terminateReasonsFirstPagePress: firstPagePress,
    terminateReasonsLastPagePress: lastPagePress,
  };
};

export default useTerminateReasons;
