import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_TIMELINE_CONTROL = '/api/timeline-control';
const API_DELETE_ALL_PERF_TIMELINE_CONTROL = '/api/timeline-control/all';

const getAllDataPerfTimelineControl = (
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

const deletePerfTimelineControl = (ids: string) => {
  return axios
    .delete(API_PERF_TIMELINE_CONTROL, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerfTimelineControl = () => {
  return axios
    .delete(API_DELETE_ALL_PERF_TIMELINE_CONTROL)
    .then((resp) => resp.data);
};

const usePerfTimelineControl = (defaultFilter?: any) => {
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
    api: API_PERF_TIMELINE_CONTROL,
    fetcher: getAllDataPerfTimelineControl,
    fetcherDelete: deletePerfTimelineControl,
    fetcherDeleteAll: deleteAllPerfTimelineControl,
    defaultFilter,
  });

  return {
    perfTimelineControl: data,
    isPerfTimelineControlEmpty: isDataEmpty,
    isPerfTimelineControlLoading: isDataLoading,
    isPerfTimelineControlError: isDataError,
    perfTimelineControlTotalCount: dataTotalCount,
    perfTimelineControlTotalPage: dataTotalPage,
    perfTimelineControlPage: page,
    perfTimelineControlPerPage: perPage,
    perfTimelineControlRefreshPress: refreshPress,
    perfTimelineControlPagePress: pagePress,
    perfTimelineControlPerPagePress: perPagePress,
    perfTimelineControlSort: sort,
    perfTimelineControlSortPress: sortPress,
    setPerfTimelineControlFilter: setFilter,
    setPerfTimelineControlPage: setPage,
    setPerfTimelineControlPerPage: setPerPage,
    perfTimelineControlSelectAllPress: selectAllPress,
    perfTimelineControlSelectOnePress: selectOnePress,
    perfTimelineControlSelected: selected,
    isPerfTimelineControlSelectedAll: isSelectedAll,
    perfTimelineControlsDeletePress: deletePress,
    isPerfTimelineControlsDeleteLoading: isDeleteLoading,
    perfTimelineControlNextFivePagePress: nextFivePagePress,
    perfTimelineControlPrevFivePagePress: prevFivePagePress,
    perfTimelineControlFirstPagePress: firstPagePress,
    perfTimelineControlLastPagePress: lastPagePress,
  };
};

export default usePerfTimelineControl;
