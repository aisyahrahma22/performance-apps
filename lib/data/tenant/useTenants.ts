import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_TENANTS = '/api/tenant';
const API_DELETE_TENANT = '/api/tenant';
const API_DELETE_TENANT_ALL = '/api/tenant/all';

export const getTenants = (
  url: string = API_TENANTS,
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

const deleteTenant = (ids: string) => {
  return axios
    .delete(API_DELETE_TENANT, { data: ids })
    .then((resp) => resp.data);
};

const deleteTenantAll = () => {
  return axios.delete(API_DELETE_TENANT_ALL).then((resp) => resp.data);
};

const useTenants = () => {
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
    api: API_TENANTS,
    fetcher: getTenants,
    fetcherDelete: deleteTenant,
    fetcherDeleteAll: deleteTenantAll,
  });

  return {
    tenants: data,
    isTenantsEmpty: isDataEmpty,
    isTenantsLoading: isDataLoading,
    isTenantsError: isDataError,
    tenantsTotalCount: dataTotalCount,
    tenantsTotalPage: dataTotalPage,
    tenantsPage: page,
    tenantsPerPage: perPage,
    tenantsRefreshPress: refreshPress,
    tenantsPagePress: pagePress,
    tenantsPerPagePress: perPagePress,
    tenantsSort: sort,
    tenantsSortPress: sortPress,
    setTenantsFilter: setFilter,
    setTenantsPage: setPage,
    setTenantsPerPage: setPerPage,
    tenantsSelectAllPress: selectAllPress,
    tenantsSelectOnePress: selectOnePress,
    tenantsSelected: selected,
    isTenantsSelectedAll: isSelectedAll,
    tenantsDeletePress: deletePress,
    isTenantDeleteLoading: isDeleteLoading,
    tenantsNextFivePagePress: nextFivePagePress,
    tenantsPrevFivePagePress: prevFivePagePress,
    tenantsFirstPagePress: firstPagePress,
    tenantsLastPagePress: lastPagePress,
  };
};

export default useTenants;
