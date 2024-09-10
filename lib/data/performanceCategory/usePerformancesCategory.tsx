import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERFORMANCECATEGORY = '/api/category';
const API_DELETE_ALL_PERFORMANCECATEGORY = '/api/category/all';

const getPerformanceCategory = (
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

const deletePerformancesCategory = (ids: string) => {
  return axios
    .delete(API_PERFORMANCECATEGORY, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesCategory = () => {
  return axios
    .delete(API_DELETE_ALL_PERFORMANCECATEGORY)
    .then((resp) => resp.data);
};

const usePerformancesCategory = () => {
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
    api: API_PERFORMANCECATEGORY,
    fetcher: getPerformanceCategory,
    fetcherDelete: deletePerformancesCategory,
    fetcherDeleteAll: deleteAllPerformancesCategory,
  });

  return {
    performancesCategory: data,
    isPerformanceCategoryEmpty: isDataEmpty,
    isPerformanceCategoryLoading: isDataLoading,
    isPerformanceCategoryError: isDataError,
    performanceCategoryTotalCount: dataTotalCount,
    performanceCategoryTotalPage: dataTotalPage,
    performanceCategoryPage: page,
    performanceCategoryPerPage: perPage,
    performanceCategoryRefreshPress: refreshPress,
    performanceCategoryPagePress: pagePress,
    performanceCategoryPerPagePress: perPagePress,
    performanceCategorySort: sort,
    performanceCategorySortPress: sortPress,
    setPerformanceCategoryFilter: setFilter,
    setPerformanceCategoryPage: setPage,
    setPerformanceCategoryPerPage: setPerPage,
    performanceCategorySelectAllPress: selectAllPress,
    performanceCategorySelectOnePress: selectOnePress,
    performanceCategorySelected: selected,
    isPerformanceCategorySelectedAll: isSelectedAll,
    performancesCategoryDeletePress: deletePress,
    isPerformancesCategoryDeleteLoading: isDeleteLoading,
    performanceCategoryNextFivePagePress: nextFivePagePress,
    performanceCategoryPrevFivePagePress: prevFivePagePress,
    performanceCategoryFirstPagePress: firstPagePress,
    performanceCategoryLastPagePress: lastPagePress,
  };
};

export default usePerformancesCategory;
