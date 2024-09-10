import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_POSITION_GROUPING_TYPE = '/api/position/grouping-type';

export const getPositionGroupingTypes = (
  url: string = API_POSITION_GROUPING_TYPE,
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

const usePositionGroupingTypes = () => {
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
    api: API_POSITION_GROUPING_TYPE,
    fetcher: getPositionGroupingTypes,
  });

  return {
    positionGroupingTypes: data,
    isPositionGroupingTypesEmpty: isDataEmpty,
    isPositionGroupingTypesLoading: isDataLoading,
    isPositionGroupingTypesError: isDataError,
    positionGroupingTypesTotalCount: dataTotalCount,
    positionGroupingTypesTotalPage: dataTotalPage,
    positionGroupingTypesPage: page,
    positionGroupingTypesPerPage: perPage,
    positionGroupingTypesRefreshPress: refreshPress,
    positionGroupingTypesPagePress: pagePress,
    positionGroupingTypesPerPagePress: perPagePress,
    positionGroupingTypesSort: sort,
    positionGroupingTypesSortPress: sortPress,
    setPositionGroupingTypesFilter: setFilter,
    setPositionGroupingTypesPage: setPage,
    setPositionGroupingTypesPerPage: setPerPage,
    positionGroupingTypesNextFivePagePress: nextFivePagePress,
    positionGroupingTypesPrevFivePagePress: prevFivePagePress,
    positionGroupingTypesFirstPagePress: firstPagePress,
    positionGroupingTypesLastPagePress: lastPagePress,
  };
};

export default usePositionGroupingTypes;
