import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API = '/api/location/city';

export const getLocCities = (
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

const useLocCities = () => {
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API,
    fetcher: getLocCities,
  });

  return {
    locCities: data,
    isLocCitiesEmpty: isDataEmpty,
    isLocCitiesLoading: isDataLoading,
    isLocCitiesError: isDataError,
    locCitiesTotalCount: dataTotalCount,
    locCitiesTotalPage: dataTotalPage,
    locCitiesPage: page,
    locCitiesPerPage: perPage,
    locCitiesRefreshPress: refreshPress,
    locCitiesPagePress: pagePress,
    locCitiesPerPagePress: perPagePress,
    locCitiesSort: sort,
    locCitiesSortPress: sortPress,
    setLocCitiesFilter: setFilter,
    setLocCitiesPage: setPage,
    setLocCitiesPerPage: setPerPage,
    locCitiesSelectAllPress: selectAllPress,
    locCitiesSelectOnePress: selectOnePress,
    locCitiesSelected: selected,
    isLocCitiesSelectedAll: isSelectedAll,
    locCitiesNextFivePagePress: nextFivePagePress,
    locCitiesPrevFivePagePress: prevFivePagePress,
    locCitiesFirstPagePress: firstPagePress,
    locCitiesLastPagePress: lastPagePress,
  };
};

export default useLocCities;
