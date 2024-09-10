import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCETARGET = '/api/performancetarget';
const API_DELETE_ALL_PERFORMANCETARGET = '/api/performancetarget/all';

const getPerformanceTarget = (
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

const deletePerformancesTarget = (ids: string) => {
  return axios
    .delete(API_PERFORMANCETARGET, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesTarget = () => {
  return axios
    .delete(API_DELETE_ALL_PERFORMANCETARGET)
    .then((resp) => resp.data);
};

const usePerformancesTarget = () => {
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
    api: API_PERFORMANCETARGET,
    fetcher: getPerformanceTarget,
    fetcherDelete: deletePerformancesTarget,
    fetcherDeleteAll: deleteAllPerformancesTarget,
  });

  return {
    performancesTarget: data,
    isPerformanceTargetEmpty: isDataEmpty,
    isPerformanceTargetLoading: isDataLoading,
    isPerformanceTargetError: isDataError,
    performanceTargetTotalCount: dataTotalCount,
    performanceTargetTotalPage: dataTotalPage,
    performanceTargetPage: page,
    performanceTargetPerPage: perPage,
    performanceTargetRefreshPress: refreshPress,
    performanceTargetPagePress: pagePress,
    performanceTargetPerPagePress: perPagePress,
    performanceTargetSort: sort,
    performanceTargetSortPress: sortPress,
    setPerformanceTargetFilter: setFilter,
    setPerformanceTargetPage: setPage,
    setPerformanceTargetPerPage: setPerPage,
    performanceTargetSelectAllPress: selectAllPress,
    performanceTargetSelectOnePress: selectOnePress,
    performanceTargetSelected: selected,
    isPerformanceTargetSelectedAll: isSelectedAll,
    performancesTargetDeletePress: deletePress,
    isPerformancesTargetDeleteLoading: isDeleteLoading,
    performanceTargetNextFivePagePress: nextFivePagePress,
    performanceTargetPrevFivePagePress: prevFivePagePress,
    performanceTargetFirstPagePress: firstPagePress,
    performanceTargetLastPagePress: lastPagePress,
  };
};

export default usePerformancesTarget;
