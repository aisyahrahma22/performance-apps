import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_FORM = '/api/performance-form';
const API_DELETE_ALL_PERFORMANCE_FORM = '/api/performance-form/all';

const getPerformanceForm = (
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

const deletePerformancesForm = (ids: string) => {
  return axios
    .delete(API_PERFORMANCE_FORM, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesForm = () => {
  return axios
    .delete(API_DELETE_ALL_PERFORMANCE_FORM)
    .then((resp) => resp.data);
};

const usePerformancesForm = () => {
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
    api: API_PERFORMANCE_FORM,
    fetcher: getPerformanceForm,
    fetcherDelete: deletePerformancesForm,
    fetcherDeleteAll: deleteAllPerformancesForm,
  });

  return {
    performancesForm: data,
    isPerformanceFormEmpty: isDataEmpty,
    isPerformanceFormLoading: isDataLoading,
    isPerformanceFormError: isDataError,
    performanceFormTotalCount: dataTotalCount,
    performanceFormTotalPage: dataTotalPage,
    performanceFormPage: page,
    performanceFormPerPage: perPage,
    performanceFormRefreshPress: refreshPress,
    performanceFormPagePress: pagePress,
    performanceFormPerPagePress: perPagePress,
    performanceFormSort: sort,
    performanceFormSortPress: sortPress,
    setPerformanceFormFilter: setFilter,
    setPerformanceFormPage: setPage,
    setPerformanceFormPerPage: setPerPage,
    performanceFormSelectAllPress: selectAllPress,
    performanceFormSelectOnePress: selectOnePress,
    performanceFormSelected: selected,
    isPerformanceFormSelectedAll: isSelectedAll,
    performanceFormsDeletePress: deletePress,
    isPerformanceFormsDeleteLoading: isDeleteLoading,
    performanceFormNextFivePagePress: nextFivePagePress,
    performanceFormPrevFivePagePress: prevFivePagePress,
    performanceFormFirstPagePress: firstPagePress,
    performanceFormLastPagePress: lastPagePress,
  };
};

export default usePerformancesForm;
