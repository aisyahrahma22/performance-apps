import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_TLC_HISTORY = `/api/timeline-control/history`;
const API_DELETE_TLC = '/api/timeline-control/history';
const API_DELETE_TLC_ALL = '/api/timeline-control/history/all';

export const getTLCHistory = (url: string, filter: any, sort: any) => {
  const qsp = qs.stringify({ filter, sort }, { skipNulls: true });
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const deleteTLCHistory = (ids: string) => {
  return axios.delete(API_DELETE_TLC, { data: ids }).then((resp) => resp.data);
};

const deleteTLCHistoryAll = () => {
  return axios.delete(API_DELETE_TLC_ALL).then((resp) => resp.data);
};

const useTLCHistory = (ids: string) => {
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
  } = useDataTable({
    api: `${API_TLC_HISTORY}/${ids}`,
    fetcher: getTLCHistory,
    fetcherDelete: deleteTLCHistory,
    fetcherDeleteAll: deleteTLCHistoryAll,
  });

  return {
    tLCHistorys: data,
    isTLCHistorysEmpty: isDataEmpty,
    isTLCHistorysLoading: isDataLoading,
    isTLCHistorysError: isDataError,
    tLCHistorysTotalCount: dataTotalCount,
    tLCHistorysTotalPage: dataTotalPage,
    tLCHistorysPage: page,
    tLCHistorysPerPage: perPage,
    tLCHistorysRefreshPress: refreshPress,
    tLCHistorysPagePress: pagePress,
    tLCHistorysPerPagePress: perPagePress,
    tLCHistorysSort: sort,
    tLCHistorysSortPress: sortPress,
    setTLCHistorysFilter: setFilter,
    setTLCHistorysPage: setPage,
    setTLCHistorysPerPage: setPerPage,
    tLCHistorysSelectAllPress: selectAllPress,
    tLCHistorysSelectOnePress: selectOnePress,
    tLCHistorysSelected: selected,
    isTLCHistorysSelectedAll: isSelectedAll,
    tLCHistoryDeletePress: deletePress,
    isTLCHistoryDeleteLoading: isDeleteLoading,
  };
};

export default useTLCHistory;
