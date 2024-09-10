import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_PATH = '/api/position/path';
const API_POSITION_PATH_ALL = '/api/position/path/all';

export const getPositionPaths = (
  url: string = API_POSITION_PATH,
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

const deletePositionPaths = (ids: string[]) => {
  return axios
    .delete(API_POSITION_PATH, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPositionPath = () => {
  return axios.delete(API_POSITION_PATH_ALL).then((resp) => resp.data);
};

const usePositionPaths = () => {
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
    api: API_POSITION_PATH,
    fetcher: getPositionPaths,
    fetcherDelete: deletePositionPaths,
    fetcherDeleteAll: deleteAllPositionPath,
  });

  return {
    positionPaths: data,
    isPositionPathsEmpty: isDataEmpty,
    isPositionPathsLoading: isDataLoading,
    isPositionPathsError: isDataError,
    positionPathsTotalCount: dataTotalCount,
    positionPathsTotalPage: dataTotalPage,
    positionPathsPage: page,
    positionPathsPerPage: perPage,
    positionPathsRefreshPress: refreshPress,
    positionPathsPagePress: pagePress,
    positionPathsPerPagePress: perPagePress,
    positionPathsSort: sort,
    positionPathsSortPress: sortPress,
    setPositionPathsFilter: setFilter,
    setPositionPathsPage: setPage,
    setPositionPathsPerPage: setPerPage,
    positionPathsSelectAllPress: selectAllPress,
    positionPathsSelectOnePress: selectOnePress,
    positionPathsSelected: selected,
    isPositionPathsSelectedAll: isSelectedAll,
    positionPathsDeletePress: deletePress,
    positionPathsNextFivePagePress: nextFivePagePress,
    positionPathsPrevFivePagePress: prevFivePagePress,
    positionPathsFirstPagePress: firstPagePress,
    positionPathsLastPagePress: lastPagePress,
  };
};

export default usePositionPaths;
