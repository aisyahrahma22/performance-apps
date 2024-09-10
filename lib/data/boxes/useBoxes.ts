import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_BOXES = '/api/boxes';
const API_DELETE_BOXES = '/api/boxes';
const API_DELETE_BOXES_ALL = '/api/boxes/all';

export const getBoxes = (
  url: string = API_BOXES,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const defaultSort = {
    code: 'ASC',
  };
  if (JSON.stringify(sort) === '{}') {
    sort = defaultSort;
  }
  const qsp = qs.stringify(
    {
      filter,
      sort,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const deleteBoxes = (ids: string) => {
  return axios
    .delete(API_DELETE_BOXES, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllBoxes = () => {
  return axios.delete(API_DELETE_BOXES_ALL).then((resp) => resp.data);
};

const useBoxes = () => {
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
    api: API_BOXES,
    fetcher: getBoxes,
    fetcherDelete: deleteBoxes,
    fetcherDeleteAll: deleteAllBoxes,
  });

  return {
    boxes: data,
    isBoxesEmpty: isDataEmpty,
    isBoxesLoading: isDataLoading,
    isBoxesError: isDataError,
    boxesTotalCount: dataTotalCount,
    boxesTotalPage: dataTotalPage,
    boxesPage: page,
    boxesPerPage: perPage,
    boxesRefreshPress: refreshPress,
    boxesPagePress: pagePress,
    boxesPerPagePress: perPagePress,
    boxesSort: sort,
    boxesSortPress: sortPress,
    setBoxesFilter: setFilter,
    setBoxesPage: setPage,
    setBoxesPerPage: setPerPage,
    boxesSelectAllPress: selectAllPress,
    boxesSelectOnePress: selectOnePress,
    boxesSelected: selected,
    isBoxesSelectedAll: isSelectedAll,
    boxesDeletePress: deletePress,
    isBoxesDeleteLoading: isDeleteLoading,
    boxesNextFivePagePress: nextFivePagePress,
    boxesPrevFivePagePress: prevFivePagePress,
    boxesFirstPagePress: firstPagePress,
    boxesLastPagePress: lastPagePress,
  };
};

export default useBoxes;
