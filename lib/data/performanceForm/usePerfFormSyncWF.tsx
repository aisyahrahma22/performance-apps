import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_FORM_SYNC = '/api/performance-form/allsync';

const getPerfFormSyncWF = (
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

const usePerfFormSyncWF = () => {
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
    api: API_PERFORMANCE_FORM_SYNC,
    fetcher: getPerfFormSyncWF,
  });

  return {
    perfFormSyncWF: data,
    isPerfFormSyncWFEmpty: isDataEmpty,
    isPerfFormSyncWFLoading: isDataLoading,
    isPerfFormSyncWFError: isDataError,
    perfFormSyncWFTotalCount: dataTotalCount,
    perfFormSyncWFTotalPage: dataTotalPage,
    perfFormSyncWFPage: page,
    perfFormSyncWFPerPage: perPage,
    perfFormSyncWFRefreshPress: refreshPress,
    perfFormSyncWFPagePress: pagePress,
    perfFormSyncWFPerPagePress: perPagePress,
    perfFormSyncWFSort: sort,
    perfFormSyncWFSortPress: sortPress,
    setPerfFormSyncWFFilter: setFilter,
    setPerfFormSyncWFPage: setPage,
    setPerfFormSyncWFPerPage: setPerPage,
    perfFormSyncWFSelectAllPress: selectAllPress,
    perfFormSyncWFSelectOnePress: selectOnePress,
    perfFormSyncWFSelected: selected,
    isPerfFormSyncWFSelectedAll: isSelectedAll,
    perfFormSyncWFsDeletePress: deletePress,
    isPerfFormSyncWFsDeleteLoading: isDeleteLoading,
    perfFormSyncWFNextFivePagePress: nextFivePagePress,
    perfFormSyncWFPrevFivePagePress: prevFivePagePress,
    perfFormSyncWFFirstPagePress: firstPagePress,
    perfFormSyncWFLastPagePress: lastPagePress,
  };
};

export default usePerfFormSyncWF;
