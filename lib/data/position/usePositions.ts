import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION = '/api/position';

export const getPositions = (
  url: string = API_POSITION,
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

const usePositions = (isAll = false) => {
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
    api: API_POSITION,
    fetcher: getPositions,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    positions: data,
    isPositionsEmpty: isDataEmpty,
    isPositionsLoading: isDataLoading,
    isPositionsError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPositionsFilter: setFilter,
    setPositionsPage: setPage,
    setPositionsPerPage: setPerPage,
    defaultFilter,
    positionsNextFivePagePress: nextFivePagePress,
    positionsPrevFivePagePress: prevFivePagePress,
    positionsFirstPagePress: firstPagePress,
    positionsLastPagePress: lastPagePress,
  };
};

export default usePositions;
