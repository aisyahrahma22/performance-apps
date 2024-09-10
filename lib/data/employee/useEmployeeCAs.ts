import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_EMPLOYEE_CA = '/api/emp-ca';
const API_EMPLOYEE_CA_VERIFY = '/api/emp-ca/verify';

const getEmployeeCAs = (
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

const verifyRequestInquiry = ([requestId]: string[]) => {
  return axios
    .post(API_EMPLOYEE_CA_VERIFY, { id: requestId })
    .then((resp) => resp.data);
};

const useEmployeeCAs = (defaultFilter?: any) => {
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
    verificationPress,
    isVerificationLoading,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_EMPLOYEE_CA,
    fetcher: getEmployeeCAs,
    fetcherVerification: verifyRequestInquiry,
    defaultFilter,
  });

  return {
    empCAs: data,
    isEmpCAsEmpty: isDataEmpty,
    isEmpCAsLoading: isDataLoading,
    isEmpCAsError: isDataError,
    empCAsTotalCount: dataTotalCount,
    empCAsTotalPage: dataTotalPage,
    empCAsPage: page,
    empCAsPerPage: perPage,
    empCAsRefreshPress: refreshPress,
    empCAsPagePress: pagePress,
    empCAsPerPagePress: perPagePress,
    empCAsSort: sort,
    empCAsSortPress: sortPress,
    setEmpCAsFilter: setFilter,
    setEmpCAsPage: setPage,
    setEmpCAsPerPage: setPerPage,
    empCAsVerificationPress: verificationPress,
    isEmpCAsVerificationLoading: isVerificationLoading,
    empCANextFivePagePress: nextFivePagePress,
    empCAPrevFivePagePress: prevFivePagePress,
    empCAFirstPagePress: firstPagePress,
    empCALastPagePress: lastPagePress,
  };
};

export default useEmployeeCAs;
