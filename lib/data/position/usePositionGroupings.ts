import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_GROUPING = '/api/position/grouping';

export const getPositionGroupings = (
  url: string = API_POSITION_GROUPING,
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

const usePositionGroupings = (isAll = false) => {
  const defaultFilter = isAll ? {} : { isActive: true };
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_POSITION_GROUPING,
    fetcher: getPositionGroupings,
    defaultFilter,
  });

  return {
    positionGroupings: data,
    isPositionGroupingsEmpty: isDataEmpty,
    isPositionGroupingsLoading: isDataLoading,
    isPositionGroupingsError: isDataError,
    positionGroupingsTotalCount: dataTotalCount,
    positionGroupingsTotalPage: dataTotalPage,
    positionGroupingsPage: page,
    positionGroupingsPerPage: perPage,
    positionGroupingsRefreshPress: refreshPress,
    positionGroupingsPagePress: pagePress,
    positionGroupingsPerPagePress: perPagePress,
    positionGroupingsSort: sort,
    positionGroupingsSortPress: sortPress,
    setPositionGroupingsFilter: setFilter,
    setPositionGroupingsPage: setPage,
    setPositionGroupingsPerPage: setPerPage,
    defaultFilter,
    positionGroupingsNextFivePagePress: nextFivePagePress,
    positionGroupingsPrevFivePagePress: prevFivePagePress,
    positionGroupingsFirstPagePress: firstPagePress,
    positionGroupingsLastPagePress: lastPagePress,
  };
};

export default usePositionGroupings;
