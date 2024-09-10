import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_DATA_ACCESS_MAPPING = '/api/DataAccessMapping';

const getDataAccessMappings = (
  url: string,
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

const useDataAccessMappings = () => {
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
    api: API_DATA_ACCESS_MAPPING,
    fetcher: getDataAccessMappings,
  });

  return {
    dataAccessMappings: data,
    isDataAccessMappingsEmpty: isDataEmpty,
    isDataAccessMappingsLoading: isDataLoading,
    isDataAccessMappingsError: isDataError,
    DataAccessMappingsTotalCount: dataTotalCount,
    DataAccessMappingsTotalPage: dataTotalPage,
    DataAccessMappingsPage: page,
    DataAccessMappingsPerPage: perPage,
    DataAccessMappingsRefreshPress: refreshPress,
    DataAccessMappingsPagePress: pagePress,
    DataAccessMappingsPerPagePress: perPagePress,
    DataAccessMappingsSort: sort,
    DataAccessMappingsSortPress: sortPress,
    setDataAccessMappingsFilter: setFilter,
    setDataAccessMappingsPage: setPage,
    setDataAccessMappingsPerPage: setPerPage,
    DataAccessMappingsSelectAllPress: selectAllPress,
    DataAccessMappingsSelectOnePress: selectOnePress,
    DataAccessMappingsSelected: selected,
    isDataAccessMappingsSelectedAll: isSelectedAll,
    DataAccessMappingsNextFivePagePress: nextFivePagePress,
    DataAccessMappingsPrevFivePagePress: prevFivePagePress,
    DataAccessMappingsFirstPagePress: firstPagePress,
    DataAccessMappingsLastPagePress: lastPagePress,
  };
};

export default useDataAccessMappings;
