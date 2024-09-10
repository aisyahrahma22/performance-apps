import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_SILOAM_VALUE = '/api/siloam-value';
const API_DELETE_ALL_PERFORMANCE_SILOAM_VALUE = '/api/siloam-value/all';

const getPerformanceSiloamValue = (
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

const deletePerformancesSiloamValue = (ids: string) => {
  return axios
    .delete(API_PERFORMANCE_SILOAM_VALUE, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesSiloamValue = () => {
  return axios
    .delete(API_DELETE_ALL_PERFORMANCE_SILOAM_VALUE)
    .then((resp) => resp.data);
};

const usePerformancesSiloamValues = () => {
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
    api: API_PERFORMANCE_SILOAM_VALUE,
    fetcher: getPerformanceSiloamValue,
    fetcherDelete: deletePerformancesSiloamValue,
    fetcherDeleteAll: deleteAllPerformancesSiloamValue,
  });

  return {
    performancesSiloamValue: data,
    isPerformanceSiloamValueEmpty: isDataEmpty,
    isPerformanceSiloamValueLoading: isDataLoading && !data,
    isPerformanceSiloamValueError: isDataError,
    performanceSiloamValueTotalCount: dataTotalCount,
    performanceSiloamValueTotalPage: dataTotalPage,
    performanceSiloamValuePage: page,
    performanceSiloamValuePerPage: perPage,
    performanceSiloamValueRefreshPress: refreshPress,
    performanceSiloamValuePagePress: pagePress,
    performanceSiloamValuePerPagePress: perPagePress,
    performanceSiloamValueSort: sort,
    performanceSiloamValueSortPress: sortPress,
    setPerformanceSiloamValueFilter: setFilter,
    setPerformanceSiloamValuePage: setPage,
    setPerformanceSiloamValuePerPage: setPerPage,
    performanceSiloamValueSelectAllPress: selectAllPress,
    performanceSiloamValueSelectOnePress: selectOnePress,
    performanceSiloamValueSelected: selected,
    isPerformanceSiloamValueSelectedAll: isSelectedAll,
    performancesSiloamValueDeletePress: deletePress,
    isPerformancesSiloamValueDeleteLoading: isDeleteLoading,
    performanceSiloamValueNextFivePagePress: nextFivePagePress,
    performanceSiloamValuePrevFivePagePress: prevFivePagePress,
    performanceSiloamValueFirstPagePress: firstPagePress,
    performanceSiloamValueLastPagePress: lastPagePress,
  };
};

export default usePerformancesSiloamValues;
