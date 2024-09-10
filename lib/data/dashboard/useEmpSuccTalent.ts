import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_EMP_SUCC_TALENT = '/api/succession/dashboard/employee';

const getEmpSuccTalent = (
  url: string = API_EMP_SUCC_TALENT,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const type = filter?.type || 'TALENT';
  const qsp = qs.stringify(
    { type, filter, sort, limit: perPage, offset: (page - 1) * perPage },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useEmpSuccTalent = (groupId: any = [], type = 'TALENT') => {
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
  } = useDataTable({
    api: API_EMP_SUCC_TALENT,
    fetcher: getEmpSuccTalent,
    defaultFilter: {
      groupId,
      type,
    },
  });

  return {
    empSuccTalent: data,
    isEmpSuccTalentEmpty: isDataEmpty,
    isEmpSuccTalentLoading: isDataLoading,
    isEmpSuccTalentError: isDataError,
    empSuccTalentTotalCount: dataTotalCount,
    empSuccTalentTotalPage: dataTotalPage,
    empSuccTalentPage: page,
    empSuccTalentPerPage: perPage,
    empSuccTalentRefreshPress: refreshPress,
    empSuccTalentPagePress: pagePress,
    empSuccTalentPerPagePress: perPagePress,
    empSuccTalentSort: sort,
    empSuccTalentSortPress: sortPress,
    setEmpSuccTalentFilter: setFilter,
    setEmpSuccTalentPage: setPage,
    setEmpSuccTalentPerPage: setPerPage,
  };
};

export default useEmpSuccTalent;
