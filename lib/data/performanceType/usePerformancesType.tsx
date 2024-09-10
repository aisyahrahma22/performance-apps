import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCETYPE = '/api/performancetype';
const API_DELETE_ALL_PERFORMANCETYPE = '/api/performancetype/all';

const getPerformanceType = (
  url: string = API_PERFORMANCETYPE,
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

const deletePerformancesType = (ids: string) => {
  return axios
    .delete(API_PERFORMANCETYPE, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesType = () => {
  return axios.delete(API_DELETE_ALL_PERFORMANCETYPE).then((resp) => resp.data);
};

const usePerformancesType = () => {
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
    api: API_PERFORMANCETYPE,
    fetcher: getPerformanceType,
    fetcherDelete: deletePerformancesType,
    fetcherDeleteAll: deleteAllPerformancesType,
  });

  return {
    performancesType: data,
    isPerformanceTypeEmpty: isDataEmpty,
    isPerformanceTypeLoading: isDataLoading,
    isPerformanceTypeError: isDataError,
    performanceTypeTotalCount: dataTotalCount,
    performanceTypeTotalPage: dataTotalPage,
    performanceTypePage: page,
    performanceTypePerPage: perPage,
    performanceTypeRefreshPress: refreshPress,
    performanceTypePagePress: pagePress,
    performanceTypePerPagePress: perPagePress,
    performanceTypeSort: sort,
    performanceTypeSortPress: sortPress,
    setPerformanceTypeFilter: setFilter,
    setPerformanceTypePage: setPage,
    setPerformanceTypePerPage: setPerPage,
    performanceTypeSelectAllPress: selectAllPress,
    performanceTypeSelectOnePress: selectOnePress,
    performanceTypeSelected: selected,
    isPerformanceTypeSelectedAll: isSelectedAll,
    performancesTypeDeletePress: deletePress,
    isPerformancesTypeDeleteLoading: isDeleteLoading,
    performancesTypeNextFivePagePress: nextFivePagePress,
    performancesTypePrevFivePagePress: prevFivePagePress,
    performancesTypeFirstPagePress: firstPagePress,
    performancesTypeLastPagePress: lastPagePress,
  };
};

export default usePerformancesType;
