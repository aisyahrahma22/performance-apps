import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_ROLES = '/api/roles';
const API_DELETE_ROLES = '/api/roles';

export const getRoles = (
  url: string = API_ROLES,
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

const deleteRoles = (ids: string) => {
  return axios
    .delete(API_DELETE_ROLES, { data: ids })
    .then((resp) => resp.data);
};

const useRoles = () => {
  const onDeleteSuccess = useCallback((dataDelete) => {
    let message = '';
    if (dataDelete.length > 1) {
      message = `${dataDelete.length} roles has been deleted.`;
    } else if (dataDelete.length === 1) {
      message = `${dataDelete[0].name} has been deleted.`;
    }
    toast.success(message);
  }, []);

  const onDeleteError = useCallback((e: any) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

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
    api: API_ROLES,
    fetcher: getRoles,
    fetcherDelete: deleteRoles,
    onDeleteSuccess,
    onDeleteError,
  });

  return {
    roles: data,
    isRolesEmpty: isDataEmpty,
    isRolesLoading: isDataLoading,
    isRolesError: isDataError,
    rolesTotalCount: dataTotalCount,
    rolesTotalPage: dataTotalPage,
    rolesPage: page,
    rolesPerPage: perPage,
    rolesRefreshPress: refreshPress,
    rolesPagePress: pagePress,
    rolesPerPagePress: perPagePress,
    rolesSort: sort,
    rolesSortPress: sortPress,
    setRolesFilter: setFilter,
    setRolesPage: setPage,
    setRolesPerPage: setPerPage,
    rolesSelectAllPress: selectAllPress,
    rolesSelectOnePress: selectOnePress,
    rolesSelected: selected,
    isRolesSelectedAll: isSelectedAll,
    rolesDeletePress: deletePress,
    isRolesDeleteLoading: isDeleteLoading,
    rolesNextFivePagePress: nextFivePagePress,
    rolesPrevFivePagePress: prevFivePagePress,
    rolesFirstPagePress: firstPagePress,
    rolesLastPagePress: lastPagePress,
  };
};

export default useRoles;
