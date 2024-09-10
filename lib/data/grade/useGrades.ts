import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_GRADE = '/api/grade';

export const getGrades = (
  url: string = API_GRADE,
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

const useGrades = () => {
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
    api: API_GRADE,
    fetcher: getGrades,
  });

  return {
    grades: data,
    isGradesEmpty: isDataEmpty,
    isGradesLoading: isDataLoading,
    isGradesError: isDataError,
    gradesTotalCount: dataTotalCount,
    gradesTotalPage: dataTotalPage,
    gradesPage: page,
    gradesPerPage: perPage,
    gradesRefreshPress: refreshPress,
    gradesPagePress: pagePress,
    gradesPerPagePress: perPagePress,
    gradesSort: sort,
    gradesSortPress: sortPress,
    setGradesFilter: setFilter,
    setGradesPage: setPage,
    setGradesPerPage: setPerPage,
    gradesSelectAllPress: selectAllPress,
    gradesSelectOnePress: selectOnePress,
    gradesSelected: selected,
    isGradesSelectedAll: isSelectedAll,
    gradesDeletePress: deletePress,
    isGradesDeleteLoading: isDeleteLoading,
    gradesNextFivePagePress: nextFivePagePress,
    gradesPrevFivePagePress: prevFivePagePress,
    gradesFirstPagePress: firstPagePress,
    gradesLastPagePress: lastPagePress,
  };
};

export default useGrades;
