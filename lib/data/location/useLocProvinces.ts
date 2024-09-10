import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API = '/api/location/province';

export const getLocProvinces = (
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

const useLocProvinces = () => {
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
    fetcher: getLocProvinces,
  });

  return {
    locProvinces: data,
    isLocProvincesEmpty: isDataEmpty,
    isLocProvincesLoading: isDataLoading,
    isLocProvincesError: isDataError,
    locProvincesTotalCount: dataTotalCount,
    locProvincesTotalPage: dataTotalPage,
    locProvincesPage: page,
    locProvincesPerPage: perPage,
    locProvincesRefreshPress: refreshPress,
    locProvincesPagePress: pagePress,
    locProvincesPerPagePress: perPagePress,
    locProvincesSort: sort,
    locProvincesSortPress: sortPress,
    setLocProvincesFilter: setFilter,
    setLocProvincesPage: setPage,
    setLocProvincesPerPage: setPerPage,
    locProvincesSelectAllPress: selectAllPress,
    locProvincesSelectOnePress: selectOnePress,
    locProvincesSelected: selected,
    isLocProvincesSelectedAll: isSelectedAll,
    isLocProvinceDeleteLoading: isDeleteLoading,
    locProvincesNextFivePagePress: nextFivePagePress,
    locProvincesPrevFivePagePress: prevFivePagePress,
    locProvincesFirstPagePress: firstPagePress,
    locProvincesLastPagePress: lastPagePress,
  };
};

export default useLocProvinces;
