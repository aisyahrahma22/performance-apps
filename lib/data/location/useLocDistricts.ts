import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API = '/api/location/district';

export const getLocDistricts = (
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

const useLocDistricts = () => {
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
    fetcher: getLocDistricts,
  });

  return {
    locDistricts: data,
    isLocDistrictsEmpty: isDataEmpty,
    isLocDistrictsLoading: isDataLoading,
    isLocDistrictsError: isDataError,
    locDistrictsTotalCount: dataTotalCount,
    locDistrictsTotalPage: dataTotalPage,
    locDistrictsPage: page,
    locDistrictsPerPage: perPage,
    locDistrictsRefreshPress: refreshPress,
    locDistrictsPagePress: pagePress,
    locDistrictsPerPagePress: perPagePress,
    locDistrictsSort: sort,
    locDistrictsSortPress: sortPress,
    setLocDistrictsFilter: setFilter,
    setLocDistrictsPage: setPage,
    setLocDistrictsPerPage: setPerPage,
    locDistrictsSelectAllPress: selectAllPress,
    locDistrictsSelectOnePress: selectOnePress,
    locDistrictsSelected: selected,
    isLocDistrictsSelectedAll: isSelectedAll,
    isLocDistrictDeleteLoading: isDeleteLoading,
    locDistrictsNextFivePagePress: nextFivePagePress,
    locDistrictsPrevFivePagePress: prevFivePagePress,
    locDistrictsFirstPagePress: firstPagePress,
    locDistrictsLastPagePress: lastPagePress,
  };
};

export default useLocDistricts;
