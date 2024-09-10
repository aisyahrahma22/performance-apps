import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_CUSTOM_TOKEN = '/api/custom-token/token';

const getCustomToken = (
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

const useCustomToken = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    isSelectedAll,
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
  } = useDataTable({
    api: API_CUSTOM_TOKEN,
    fetcher: getCustomToken,
  });

  return {
    customToken: data,
    isCustomTokenEmpty: isDataEmpty,
    isCustomTokenLoading: isDataLoading,
    isCustomTokenError: isDataError,
    isCustomTokenSelectedAll: isSelectedAll,
    customTokenTotalCount: dataTotalCount,
    customTokenTotalPage: dataTotalPage,
    customTokenPage: page,
    customTokenPerPage: perPage,
    customTokenRefreshPress: refreshPress,
    customTokenPagePress: pagePress,
    customTokenPerPagePress: perPagePress,
    customTokenSort: sort,
    customTokenSortPress: sortPress,
    setCustomTokenFilter: setFilter,
    setCustomTokenPage: setPage,
    setCustomTokenPerPage: setPerPage,
  };
};

export default useCustomToken;
