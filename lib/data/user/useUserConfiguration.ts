import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_USER_CONFIGURATION = '/api/users/configuration';

const getUserConfiguration = (
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

const useUserConfiguration = () => {
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
    api: API_USER_CONFIGURATION,
    fetcher: getUserConfiguration,
  });

  return {
    userConfiguration: data,
    isUserConfigurationEmpty: isDataEmpty,
    isUserConfigurationLoading: isDataLoading,
    isUserConfigurationError: isDataError,
    userConfigurationTotalCount: dataTotalCount,
    userConfigurationTotalPage: dataTotalPage,
    userConfigurationPage: page,
    userConfigurationPerPage: perPage,
    userConfigurationRefreshPress: refreshPress,
    userConfigurationPagePress: pagePress,
    userConfigurationPerPagePress: perPagePress,
    userConfigurationSort: sort,
    userConfigurationSortPress: sortPress,
    setUserConfigurationFilter: setFilter,
    setUserConfigurationPage: setPage,
    setUserConfigurationPerPage: setPerPage,
    userConfigurationSelectAllPress: selectAllPress,
    userConfigurationSelectOnePress: selectOnePress,
    userConfigurationSelected: selected,
    isUserConfigurationSelectedAll: isSelectedAll,
    userConfigurationNextFivePagePress: nextFivePagePress,
    userConfigurationPrevFivePagePress: prevFivePagePress,
    userConfigurationFirstPagePress: firstPagePress,
    userConfigurationLastPagePress: lastPagePress,
  };
};

export default useUserConfiguration;
