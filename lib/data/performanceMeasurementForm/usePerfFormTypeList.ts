import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_FORM_TYPE = '/api/performance-measurement';

export const getPerfFormType = (
  url: string = API_PERF_FORM_TYPE,
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

const usePerfFormType = () => {
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
  } = useDataTable({
    api: API_PERF_FORM_TYPE,
    fetcher: getPerfFormType,
  });

  return {
    perfFormLists: data,
    isPerfFormListsEmpty: isDataEmpty,
    isPerfFormListsLoading: isDataLoading,
    isPerfFormListsError: isDataError,
    perfFormListsTotalCount: dataTotalCount,
    perfFormListsTotalPage: dataTotalPage,
    perfFormListsPage: page,
    perfFormListsPerPage: perPage,
    perfFormListsRefreshPress: refreshPress,
    perfFormListsPagePress: pagePress,
    perfFormListsPerPagePress: perPagePress,
    perfFormListsSort: sort,
    perfFormListsSortPress: sortPress,
    setPerfFormListsFilter: setFilter,
    setPerfFormListsPage: setPage,
    setPerfFormListsPerPage: setPerPage,
    perfFormListsSelectAllPress: selectAllPress,
    perfFormListsSelectOnePress: selectOnePress,
    perfFormListsSelected: selected,
    isPerfFormListsSelectedAll: isSelectedAll,
    perfFormListsDeletePress: deletePress,
    isPerfFormListDeleteLoading: isDeleteLoading,
  };
};

export default usePerfFormType;
