import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API = '/api/location/state';

export const getLocStates = (
  url: string = API,
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

const useLocStates = () => {
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
    isDeleteLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API,
    fetcher: getLocStates,
  });

  return {
    locStates: data,
    isLocStatesEmpty: isDataEmpty,
    isLocStatesLoading: isDataLoading,
    isLocStatesError: isDataError,
    locStatesTotalCount: dataTotalCount,
    locStatesTotalPage: dataTotalPage,
    locStatesPage: page,
    locStatesPerPage: perPage,
    locStatesRefreshPress: refreshPress,
    locStatesPagePress: pagePress,
    locStatesPerPagePress: perPagePress,
    locStatesSort: sort,
    locStatesSortPress: sortPress,
    setLocStatesFilter: setFilter,
    setLocStatesPage: setPage,
    setLocStatesPerPage: setPerPage,
    locStatesSelectAllPress: selectAllPress,
    locStatesSelectOnePress: selectOnePress,
    locStatesSelected: selected,
    isLocStatesSelectedAll: isSelectedAll,
    isLocStateDeleteLoading: isDeleteLoading,
    locStatesNextFivePagePress: nextFivePagePress,
    locStatesPrevFivePagePress: prevFivePagePress,
    locStatesFirstPagePress: firstPagePress,
    locStatesLastPagePress: lastPagePress,
  };
};

export default useLocStates;
