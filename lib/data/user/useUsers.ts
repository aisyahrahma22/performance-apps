import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const API_USERS = '/api/users';
const API_DELETE_USERS = '/api/users';

const getUsers = (
  url: string,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
  withDeleted: boolean,
) => {
  const qsp = qs.stringify(
    {
      filter,
      sort,
      limit: perPage,
      offset: (page - 1) * perPage,
      withDeleted,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const deleteUsers = (ids: string) => {
  return axios
    .delete(API_DELETE_USERS, { data: ids })
    .then((resp) => resp.data);
};

const useUsers = () => {
  const onDeleteSuccess = useCallback((dataDelete: any) => {
    let message = '';
    if (dataDelete.length > 1) {
      message = `${dataDelete.length} users has been deleted`;
    } else if (dataDelete.length === 1) {
      message = `${dataDelete[0].username} has been deleted`;
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
    withDeleted,
    refreshPress,
    pagePress,
    perPagePress,
    sort,
    sortPress,
    setFilter,
    setPage,
    setPerPage,
    setWithDeleted,
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
    api: API_USERS,
    fetcher: getUsers,
    fetcherDelete: deleteUsers,
    onDeleteSuccess,
    onDeleteError,
  });

  return {
    users: data,
    isUsersEmpty: isDataEmpty,
    isUsersLoading: isDataLoading,
    isUsersError: isDataError,
    usersTotalCount: dataTotalCount,
    usersTotalPage: dataTotalPage,
    usersPage: page,
    usersPerPage: perPage,
    usersWithDeleted: withDeleted,
    usersRefreshPress: refreshPress,
    usersPagePress: pagePress,
    usersPerPagePress: perPagePress,
    usersSort: sort,
    usersSortPress: sortPress,
    setUsersFilter: setFilter,
    setUsersPage: setPage,
    setUsersPerPage: setPerPage,
    setUsersWithDeleted: setWithDeleted,
    usersSelectAllPress: selectAllPress,
    usersSelectOnePress: selectOnePress,
    usersSelected: selected,
    isUsersSelectedAll: isSelectedAll,
    usersDeletePress: deletePress,
    isUsersDeleteLoading: isDeleteLoading,
    usersNextFivePagePress: nextFivePagePress,
    usersPrevFivePagePress: prevFivePagePress,
    usersFirstPagePress: firstPagePress,
    usersLastPagePress: lastPagePress,
  };
};

export default useUsers;
