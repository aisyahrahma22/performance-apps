import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_FORM_TYPE = '/api/performance-measurement';
const API_DELETE_ALL_PERFORMANCE = '/api/performance/all';

export const getPerformanceFormType = (
  url: string = API_PERFORMANCE_FORM_TYPE,
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

const deletePerformanceFormType = (ids: string) => {
  return axios
    .delete(API_PERFORMANCE_FORM_TYPE, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformanceFormType = () => {
  return axios.delete(API_DELETE_ALL_PERFORMANCE).then((resp) => resp.data);
};

const usePerformanceFormType = () => {
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
    api: API_PERFORMANCE_FORM_TYPE,
    fetcher: getPerformanceFormType,
    fetcherDelete: deletePerformanceFormType,
    fetcherDeleteAll: deleteAllPerformanceFormType,
  });

  return {
    performanceFormType: data,
    isPerformanceFormTypeEmpty: isDataEmpty,
    isPerformanceFormTypeLoading: isDataLoading,
    isPerformanceFormTypeError: isDataError,
    performanceFormTypeTotalCount: dataTotalCount,
    performanceFormTypeTotalPage: dataTotalPage,
    performanceFormTypePage: page,
    performanceFormTypePerPage: perPage,
    performanceFormTypeRefreshPress: refreshPress,
    performanceFormTypePagePress: pagePress,
    performanceFormTypePerPagePress: perPagePress,
    performanceFormTypeSort: sort,
    performanceFormTypeSortPress: sortPress,
    setPerformanceFormTypeFilter: setFilter,
    setPerformanceFormTypePage: setPage,
    setPerformanceFormTypePerPage: setPerPage,
    performanceFormTypeSelectAllPress: selectAllPress,
    performanceFormTypeSelectOnePress: selectOnePress,
    performanceFormTypeSelected: selected,
    isPerformanceFormTypeSelectedAll: isSelectedAll,
    performanceFormTypeDeletePress: deletePress,
    isPerformanceFormTypeDeleteLoading: isDeleteLoading,
    performanceFormTypeNextFivePagePress: nextFivePagePress,
    performanceFormTypePrevFivePagePress: prevFivePagePress,
    performanceFormTypeFirstPagePress: firstPagePress,
    performanceFormTypeLastPagePress: lastPagePress,
  };
};

export default usePerformanceFormType;
