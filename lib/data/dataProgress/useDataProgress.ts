import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_DOWNLOAD_PROGRESS = '/api/data-progress';

export enum DataProgressTypeEnum {
  PUBLISH_FORM = 'PUBLISH_FORM',
  SYNC_FORM_WF = 'SYNC_FORM_WF',
  DOWNLOAD_ABSOLUTE = 'DOWNLOAD_ABSOLUTE',
  TIMELINE_CONTROL = 'TIMELINE_CONTROL',
  PUBLISH_LNA = 'PUBLISH_LNA',
  DELETE_PERF_INQUIRY = 'DELETE_PERF_INQUIRY',
}

export enum DataProgressStatusEnum {
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  STOPPED = 'STOPPED',
}

const getDataProgresses = async (
  url: string = API_DOWNLOAD_PROGRESS,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage },
    { skipNulls: true },
  );
  const resp = await axios.get(`${url}?${qsp}`);
  return resp.data;
};
const useDataProgress = (type: DataProgressTypeEnum) => {
  const defaultFilter = { type: type };
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_DOWNLOAD_PROGRESS,
    fetcher: getDataProgresses,
    defaultPerPage: 5,
    defaultFilter,
    defaultSort: { createdAt: 'DESC' },
  });

  return {
    dataProgress: data,
    isDataProgressEmpty: isDataEmpty,
    isDataProgressLoading: isDataLoading,
    isDataProgressError: isDataError,
    dataProgressTotalCount: dataTotalCount,
    dataProgressTotalPage: dataTotalPage,
    dataProgressPage: page,
    dataProgressPerPage: perPage,
    dataProgressRefreshPress: refreshPress,
    dataProgressPagePress: pagePress,
    dataProgressPerPagePress: perPagePress,
    dataProgressSort: sort,
    dataProgressSortPress: sortPress,
    setDataProgressFilter: setFilter,
    setDataProgressPage: setPage,
    setDataProgressPerPage: setPerPage,
    dataProgressSelectAllPress: selectAllPress,
    dataProgressSelectOnePress: selectOnePress,
    dataProgressSelected: selected,
    isDataProgressSelectedAll: isSelectedAll,
    dataProgressNextFivePagePress: nextFivePagePress,
    dataProgressPrevFivePagePress: prevFivePagePress,
    dataProgressFirstPagePress: firstPagePress,
    dataProgressLastPagePress: lastPagePress,
  };
};

export default useDataProgress;
