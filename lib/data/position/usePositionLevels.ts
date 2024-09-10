import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_LEVEL = '/api/position/level';
const API_POSITION_LEVEL_ALL = '/api/position/level/all';

export const getPositionLevels = (
  url: string = API_POSITION_LEVEL,
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

const deletePositionLevels = (ids: string[]) => {
  return axios
    .delete(API_POSITION_LEVEL, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPositionLevel = () => {
  return axios.delete(API_POSITION_LEVEL_ALL).then((resp) => resp.data);
};

const usePositionLevels = () => {
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
    deletePress,
    selected,
    isSelectedAll,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_POSITION_LEVEL,
    fetcher: getPositionLevels,
    fetcherDelete: deletePositionLevels,
    fetcherDeleteAll: deleteAllPositionLevel,
  });

  return {
    positionLevels: data,
    isPositionLevelsEmpty: isDataEmpty,
    isPositionLevelsLoading: isDataLoading,
    isPositionLevelsError: isDataError,
    positionLevelsTotalCount: dataTotalCount,
    positionLevelsTotalPage: dataTotalPage,
    positionLevelsPage: page,
    positionLevelsPerPage: perPage,
    positionLevelsRefreshPress: refreshPress,
    positionLevelsPagePress: pagePress,
    positionLevelsPerPagePress: perPagePress,
    positionLevelsSort: sort,
    positionLevelsSortPress: sortPress,
    setPositionLevelsFilter: setFilter,
    setPositionLevelsPage: setPage,
    setPositionLevelsPerPage: setPerPage,
    positionLevelsSelectAllPress: selectAllPress,
    positionLevelsSelectOnePress: selectOnePress,
    positionLevelsSelected: selected,
    isPositionLevelsSelectedAll: isSelectedAll,
    positionLevelsDeletePress: deletePress,
    positionLevelsNextFivePagePress: nextFivePagePress,
    positionLevelsPrevFivePagePress: prevFivePagePress,
    positionLevelsFirstPagePress: firstPagePress,
    positionLevelsLastPagePress: lastPagePress,
  };
};

export default usePositionLevels;
