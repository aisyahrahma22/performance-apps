import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_MEASUREMENT = '/api/performance-measurement/data';
const API_ALL_DELETE_PERFORMANCE_MEASUREMENT =
  '/api/performance-measurement/more';
const API_DELETE_ONE_PERFORMANCE_MEASUREMENT =
  '/api/performance-measurement/one';

const getPerformanceMeasurementForm = (
  url: string,
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

const deletePerformanceMeasurementForm = (ids: string) => {
  return axios
    .delete(API_DELETE_ONE_PERFORMANCE_MEASUREMENT, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformanceMeasurementForm = () => {
  return axios
    .delete(API_ALL_DELETE_PERFORMANCE_MEASUREMENT)
    .then((resp) => resp.data);
};

const usePerformanceMeasurementForm = (defaultFilter?: any) => {
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
    api: API_PERFORMANCE_MEASUREMENT,
    fetcher: getPerformanceMeasurementForm,
    fetcherDelete: deletePerformanceMeasurementForm,
    fetcherDeleteAll: deleteAllPerformanceMeasurementForm,
    defaultFilter,
  });

  return {
    performanceMeasurementForm: data,
    isPerformanceMeasurementFormEmpty: isDataEmpty,
    isPerformanceMeasurementFormLoading: isDataLoading,
    isPerformanceMeasurementFormError: isDataError,
    performanceMeasurementFormTotalCount: dataTotalCount,
    performanceMeasurementFormTotalPage: dataTotalPage,
    performanceMeasurementFormPage: page,
    performanceMeasurementFormPerPage: perPage,
    performanceMeasurementFormRefreshPress: refreshPress,
    performanceMeasurementFormPagePress: pagePress,
    performanceMeasurementFormPerPagePress: perPagePress,
    performanceMeasurementFormSort: sort,
    performanceMeasurementFormSortPress: sortPress,
    setPerformanceMeasurementFormFilter: setFilter,
    setPerformanceMeasurementFormPage: setPage,
    setPerformanceMeasurementFormPerPage: setPerPage,
    performanceMeasurementFormSelectAllPress: selectAllPress,
    performanceMeasurementFormSelectOnePress: selectOnePress,
    performanceMeasurementFormSelected: selected,
    isPerformanceMeasurementFormSelectedAll: isSelectedAll,
    performanceMeasurementFormDeletePress: deletePress,
    isPerformanceMeasurementFormDeleteLoading: isDeleteLoading,
    performanceMeasurementFormNextFivePagePress: nextFivePagePress,
    performanceMeasurementFormPrevFivePagePress: prevFivePagePress,
    performanceMeasurementFormFirstPagePress: firstPagePress,
    performanceMeasurementFormLastPagePress: lastPagePress,
  };
};

export default usePerformanceMeasurementForm;
