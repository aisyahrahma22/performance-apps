import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

export enum ReportProgressStatusEnum {
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
}
const API_REPORT_PROGRESS = '/api/report/progress';

const getReportProgressPagination = (
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

const useReportProgressPagination = (defaultFilter?: any) => {
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
    api: API_REPORT_PROGRESS,
    fetcher: getReportProgressPagination,
    defaultPerPage: 5,
    defaultFilter,
  });

  return {
    reportProgress: data,
    isReportProgressEmpty: isDataEmpty,
    isReportProgressLoading: isDataLoading,
    isReportProgressError: isDataError,
    reportProgressTotalCount: dataTotalCount,
    reportProgressTotalPage: dataTotalPage,
    reportProgressPage: page,
    reportProgressPerPage: perPage,
    reportProgressRefreshPress: refreshPress,
    reportProgressPagePress: pagePress,
    reportProgressPerPagePress: perPagePress,
    reportProgressSort: sort,
    reportProgressSortPress: sortPress,
    setReportProgressFilter: setFilter,
    setReportProgressPage: setPage,
    setReportProgressPerPage: setPerPage,
    reportProgressSelectAllPress: selectAllPress,
    reportProgressSelectOnePress: selectOnePress,
    reportProgressSelected: selected,
    isReportProgressSelectedAll: isSelectedAll,
    reportProgressNextFivePagePress: nextFivePagePress,
    reportProgressPrevFivePagePress: prevFivePagePress,
    reportProgressFirstPagePress: firstPagePress,
    reportProgressLastPagePress: lastPagePress,
  };
};

export default useReportProgressPagination;
