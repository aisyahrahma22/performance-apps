import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_MEASUREMENT_FINAL = '/api/performance-measurement/result';
const API_ALL_DELETE_PERFORMANCE_MEASUREMENT_FINAL =
  '/api/performance-measurement/overall';
const API_DELETE_ONE_PERFORMANCE_MEASUREMENT_FINAL =
  '/api/performance-measurement/final';

export const getPerfMeasurementFinalResult = (
  url: string = API_PERFORMANCE_MEASUREMENT_FINAL,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
  filterType: 'or' | 'and' = 'and',
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage, filterType },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const deletePerfMeasurementFinalResult = (ids: string) => {
  return axios
    .delete(API_DELETE_ONE_PERFORMANCE_MEASUREMENT_FINAL, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerfMeasurementFinalResult = () => {
  return axios
    .delete(API_ALL_DELETE_PERFORMANCE_MEASUREMENT_FINAL)
    .then((resp) => resp.data);
};

const usePerfMeasurementFinalResult = (defaultFilter?: any) => {
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
    api: API_PERFORMANCE_MEASUREMENT_FINAL,
    fetcher: getPerfMeasurementFinalResult,
    fetcherDelete: deletePerfMeasurementFinalResult,
    fetcherDeleteAll: deleteAllPerfMeasurementFinalResult,
    defaultFilter,
  });

  return {
    performanceMeasurementFinal: data,
    isPerformanceMeasurementFinalEmpty: isDataEmpty,
    isPerformanceMeasurementFinalLoading: isDataLoading,
    isPerformanceMeasurementFinalError: isDataError,
    performanceMeasurementFinalTotalCount: dataTotalCount,
    performanceMeasurementFinalTotalPage: dataTotalPage,
    performanceMeasurementFinalPage: page,
    performanceMeasurementFinalPerPage: perPage,
    performanceMeasurementFinalRefreshPress: refreshPress,
    performanceMeasurementFinalPagePress: pagePress,
    performanceMeasurementFinalPerPagePress: perPagePress,
    performanceMeasurementFinalSort: sort,
    performanceMeasurementFinalSortPress: sortPress,
    setPerformanceMeasurementFinalFilter: setFilter,
    setPerformanceMeasurementFinalPage: setPage,
    setPerformanceMeasurementFinalPerPage: setPerPage,
    performanceMeasurementFinalSelectAllPress: selectAllPress,
    performanceMeasurementFinalSelectOnePress: selectOnePress,
    performanceMeasurementFinalSelected: selected,
    isPerformanceMeasurementFinalSelectedAll: isSelectedAll,
    performanceMeasurementFinalDeletePress: deletePress,
    isPerformanceMeasurementFinalDeleteLoading: isDeleteLoading,
    performanceMeasurementFinalNextFivePagePress: nextFivePagePress,
    performanceMeasurementFinalPrevFivePagePress: prevFivePagePress,
    performanceMeasurementFinalFirstPagePress: firstPagePress,
    performanceMeasurementFinalLastPagePress: lastPagePress,
  };
};

export default usePerfMeasurementFinalResult;
