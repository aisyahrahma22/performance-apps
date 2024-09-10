import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_WORKFLOW_POSITION = '/api/performanceworkflow/position';

const getPerformanceWorkflowPosition = (
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

const usePerformanceWorkflowPosition = (isAll = false) => {
  const defaultFilter = isAll ? {} : { isActive: true };
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
    api: API_PERFORMANCE_WORKFLOW_POSITION,
    fetcher: getPerformanceWorkflowPosition,
    defaultFilter,
  });

  return {
    performanceWorkflowPosition: data,
    isPerformanceWorkflowPositionEmpty: isDataEmpty,
    isPerformanceWorkflowPositionLoading: isDataLoading,
    isPerformanceWorkflowPositionError: isDataError,
    performanceWorkflowPositionTotalCount: dataTotalCount,
    performanceWorkflowPositionTotalPage: dataTotalPage,
    performanceWorkflowPositionPage: page,
    performanceWorkflowPositionPerPage: perPage,
    performanceWorkflowPositionRefreshPress: refreshPress,
    performanceWorkflowPositionPagePress: pagePress,
    performanceWorkflowPositionPerPagePress: perPagePress,
    performanceWorkflowPositionSort: sort,
    performanceWorkflowPositionSortPress: sortPress,
    setPerformanceWorkflowPositionFilter: setFilter,
    setPerformanceWorkflowPositionPage: setPage,
    setPerformanceWorkflowPositionPerPage: setPerPage,
    performanceWorkflowPositionSelectAllPress: selectAllPress,
    performanceWorkflowPositionSelectOnePress: selectOnePress,
    performanceWorkflowPositionSelected: selected,
    isPerformanceWorkflowPositionSelectedAll: isSelectedAll,
    defaultFilter,
    performanceWorkflowPositionNextFivePagePress: nextFivePagePress,
    performanceWorkflowPositionPrevFivePagePress: prevFivePagePress,
    performanceWorkflowPositionFirstPagePress: firstPagePress,
    performanceWorkflowPositionLastPagePress: lastPagePress,
  };
};

export default usePerformanceWorkflowPosition;
