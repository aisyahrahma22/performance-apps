import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_TRAINING = '/api/emp-training/lks';

export const getEmpTrainingLKS = (
  url: string = API_EMPLOYEE_TRAINING,
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

const useEmpTrainingLKS = (defaultFilter?: any) => {
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
    api: API_EMPLOYEE_TRAINING,
    fetcher: getEmpTrainingLKS,
    defaultFilter,
  });

  return {
    empTrainingLKS: data,
    isEmpTrainingLKSEmpty: isDataEmpty,
    isEmpTrainingLKSLoading: isDataLoading,
    isEmpTrainingLKSError: isDataError,
    empTrainingLKSTotalCount: dataTotalCount,
    empTrainingLKSTotalPage: dataTotalPage,
    empTrainingLKSPage: page,
    empTrainingLKSPerPage: perPage,
    empTrainingLKSRefreshPress: refreshPress,
    empTrainingLKSPagePress: pagePress,
    empTrainingLKSPerPagePress: perPagePress,
    empTrainingLKSSort: sort,
    empTrainingLKSSortPress: sortPress,
    setEmpTrainingLKSFilter: setFilter,
    setEmpTrainingLKSPage: setPage,
    setEmpTrainingLKSPerPage: setPerPage,
  };
};

export default useEmpTrainingLKS;
