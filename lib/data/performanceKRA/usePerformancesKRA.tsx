import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCEKRA = '/api/performancekra';
const API_DELETE_ALL_PERFORMANCEKRA = '/api/performancekra/all';

const getPerformanceKRA = (
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

const deletePerformancesKRA = (ids: string) => {
  return axios
    .delete(API_PERFORMANCEKRA, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesKRA = () => {
  return axios.delete(API_DELETE_ALL_PERFORMANCEKRA).then((resp) => resp.data);
};

const usePerformancesKRA = () => {
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
    api: API_PERFORMANCEKRA,
    fetcher: getPerformanceKRA,
    fetcherDelete: deletePerformancesKRA,
    fetcherDeleteAll: deleteAllPerformancesKRA,
  });

  return {
    performancesKRA: data,
    isPerformanceKRAEmpty: isDataEmpty,
    isPerformanceKRALoading: isDataLoading,
    isPerformanceKRAError: isDataError,
    performanceKRATotalCount: dataTotalCount,
    performanceKRATotalPage: dataTotalPage,
    performanceKRAPage: page,
    performanceKRAPerPage: perPage,
    performanceKRARefreshPress: refreshPress,
    performanceKRAPagePress: pagePress,
    performanceKRAPerPagePress: perPagePress,
    performanceKRASort: sort,
    performanceKRASortPress: sortPress,
    setPerformanceKRAFilter: setFilter,
    setPerformanceKRAPage: setPage,
    setPerformanceKRAPerPage: setPerPage,
    performanceKRASelectAllPress: selectAllPress,
    performanceKRASelectOnePress: selectOnePress,
    performanceKRASelected: selected,
    isPerformanceKRASelectedAll: isSelectedAll,
    performancesKRADeletePress: deletePress,
    isPerformancesKRADeleteLoading: isDeleteLoading,
    performanceKRANextFivePagePress: nextFivePagePress,
    performanceKRAPrevFivePagePress: prevFivePagePress,
    performanceKRAFirstPagePress: firstPagePress,
    performanceKRALastPagePress: lastPagePress,
  };
};

export default usePerformancesKRA;
