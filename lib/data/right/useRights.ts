import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_RIGHTS = '/api/rights';

export const getRights = (
  url: string = API_RIGHTS,
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

const useRights = () => {
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
  } = useDataTable({
    api: API_RIGHTS,
    fetcher: getRights,
  });

  return {
    rights: data,
    isRightsEmpty: isDataEmpty,
    isRightsLoading: isDataLoading,
    isRightsError: isDataError,
    rightsTotalCount: dataTotalCount,
    rightsTotalPage: dataTotalPage,
    rightsPage: page,
    rightsPerPage: perPage,
    rightsRefreshPress: refreshPress,
    rightsPagePress: pagePress,
    rightsPerPagePress: perPagePress,
    rightsSort: sort,
    rightsSortPress: sortPress,
    setRightsFilter: setFilter,
    setRightsPage: setPage,
    setRightsPerPage: setPerPage,
    rightsSelectAllPress: selectAllPress,
    rightsSelectOnePress: selectOnePress,
    rightsSelected: selected,
    isRightsSelectedAll: isSelectedAll,
  };
};

export default useRights;
