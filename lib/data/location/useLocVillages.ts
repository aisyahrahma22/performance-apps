import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API = '/api/location/village';

export const getLocVillages = (
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

const useLocVillages = () => {
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
    fetcher: getLocVillages,
  });

  return {
    locVillages: data,
    isLocVillagesEmpty: isDataEmpty,
    isLocVillagesLoading: isDataLoading,
    isLocVillagesError: isDataError,
    locVillagesTotalCount: dataTotalCount,
    locVillagesTotalPage: dataTotalPage,
    locVillagesPage: page,
    locVillagesPerPage: perPage,
    locVillagesRefreshPress: refreshPress,
    locVillagesPagePress: pagePress,
    locVillagesPerPagePress: perPagePress,
    locVillagesSort: sort,
    locVillagesSortPress: sortPress,
    setLocVillagesFilter: setFilter,
    setLocVillagesPage: setPage,
    setLocVillagesPerPage: setPerPage,
    locVillagesSelectAllPress: selectAllPress,
    locVillagesSelectOnePress: selectOnePress,
    locVillagesSelected: selected,
    isLocVillagesSelectedAll: isSelectedAll,
    isLocVillageDeleteLoading: isDeleteLoading,
    locVillagesNextFivePagePress: nextFivePagePress,
    locVillagesPrevFivePagePress: prevFivePagePress,
    locVillagesFirstPagePress: firstPagePress,
    locVillagesLastPagePress: lastPagePress,
  };
};

export default useLocVillages;
