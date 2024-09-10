import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCE_PROGRAM = '/api/performance-program';

const getPerformanceProgram = (
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

const deletePerformancesProgram = (ids: string) => {
  return axios
    .delete(API_PERFORMANCE_PROGRAM, { data: ids })
    .then((resp) => resp.data);
};

const usePerformancesProgram = () => {
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
    api: API_PERFORMANCE_PROGRAM,
    fetcher: getPerformanceProgram,
    fetcherDelete: deletePerformancesProgram,
  });

  return {
    performancesProgram: data,
    isPerformanceProgramEmpty: isDataEmpty,
    isPerformanceProgramLoading: isDataLoading,
    isPerformanceProgramError: isDataError,
    performanceProgramTotalCount: dataTotalCount,
    performanceProgramTotalPage: dataTotalPage,
    performanceProgramPage: page,
    performanceProgramPerPage: perPage,
    performanceProgramRefreshPress: refreshPress,
    performanceProgramPagePress: pagePress,
    performanceProgramPerPagePress: perPagePress,
    performanceProgramSort: sort,
    performanceProgramSortPress: sortPress,
    setPerformanceProgramFilter: setFilter,
    setPerformanceProgramPage: setPage,
    setPerformanceProgramPerPage: setPerPage,
    performanceProgramSelectAllPress: selectAllPress,
    performanceProgramSelectOnePress: selectOnePress,
    performanceProgramSelected: selected,
    isPerformanceProgramSelectedAll: isSelectedAll,
    performancesProgramDeletePress: deletePress,
    isPerformancesProgramDeleteLoading: isDeleteLoading,
    performancesProgramNextFivePagePress: nextFivePagePress,
    performancesProgramPrevFivePagePress: prevFivePagePress,
    performancesProgramFirstPagePress: firstPagePress,
    performancesProgramLastPagePress: lastPagePress,
  };
};

export default usePerformancesProgram;
