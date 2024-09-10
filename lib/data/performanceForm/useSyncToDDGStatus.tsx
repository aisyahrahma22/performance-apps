import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_FORM =
  '/api/performance-form/ddg/sync-form-to-ddg-status';

const getSyncToDDGStatus = (
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

const useSyncToDDGStatus = () => {
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
    // selectAllPress,
    // selectOnePress,
    // selected,
    // isSelectedAll,
  } = useDataTable({
    api: API_PERFORMANCE_FORM,
    fetcher: getSyncToDDGStatus,
    defaultPerPage: 5,
  });

  return {
    syncToDDGStatus: data,
    isSyncToDDGStatusEmpty: isDataEmpty,
    isSyncToDDGStatusLoading: isDataLoading,
    isSyncToDDGStatusError: isDataError,
    syncToDDGStatusTotalCount: dataTotalCount,
    syncToDDGStatusTotalPage: dataTotalPage,
    syncToDDGStatusPage: page,
    syncToDDGStatusPerPage: perPage,
    syncToDDGStatusRefreshPress: refreshPress,
    syncToDDGStatusPagePress: pagePress,
    syncToDDGStatusPerPagePress: perPagePress,
    syncToDDGStatusSort: sort,
    syncToDDGStatusSortPress: sortPress,
    setSyncToDDGStatusFilter: setFilter,
    setSyncToDDGStatusPage: setPage,
    setSyncToDDGStatusPerPage: setPerPage,
    // syncToDDGStatusSelectAllPress: selectAllPress,
    // syncToDDGStatusSelectOnePress: selectOnePress,
    // syncToDDGStatusSelected: selected,
    // isSyncToDDGStatusSelectedAll: isSelectedAll,
  };
};

export default useSyncToDDGStatus;
