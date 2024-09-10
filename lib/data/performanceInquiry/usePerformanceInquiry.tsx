import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_PERFORMANCE_INQUIRY = '/api/performance-inquiry';
const API_DELETE_ALL_PERFORMANCE_INQUIRY =
  '/api/performance-inquiry/delete/all';

const getPerformanceInquiry = (
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

const deletePerformancesInquiry = (ids: string) => {
  return axios
    .delete(API_PERFORMANCE_INQUIRY, { data: ids })
    .then((resp) => resp.data);
};

const deleteAllPerformancesInquiry = (filter: any) => {
  const qsp = qs.stringify({ filter }, { skipNulls: true });
  return axios
    .delete(`${API_DELETE_ALL_PERFORMANCE_INQUIRY}?${qsp}`)
    .then((resp: AxiosResponse) => {
      toast.success(resp.data || 'All data has been deleted!');
    });
};

const usePerformanceInquiry = (defaultFilter?: any) => {
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
    api: API_PERFORMANCE_INQUIRY,
    fetcher: getPerformanceInquiry,
    fetcherDelete: deletePerformancesInquiry,
    fetcherDeleteAll: deleteAllPerformancesInquiry,
    defaultFilter,
  });

  return {
    performancesInquiry: data,
    isPerformanceInquiryEmpty: isDataEmpty,
    isPerformanceInquiryLoading: isDataLoading,
    isPerformanceInquiryError: isDataError,
    performanceInquiryTotalCount: dataTotalCount,
    performanceInquiryTotalPage: dataTotalPage,
    performanceInquiryPage: page,
    performanceInquiryPerPage: perPage,
    performanceInquiryRefreshPress: refreshPress,
    performanceInquiryPagePress: pagePress,
    performanceInquiryPerPagePress: perPagePress,
    performanceInquirySort: sort,
    performanceInquirySortPress: sortPress,
    setPerformanceInquiryFilter: setFilter,
    setPerformanceInquiryPage: setPage,
    setPerformanceInquiryPerPage: setPerPage,
    performanceInquirySelectAllPress: selectAllPress,
    performanceInquirySelectOnePress: selectOnePress,
    performanceInquirySelected: selected,
    isPerformanceInquirySelectedAll: isSelectedAll,
    performancesInquiryDeletePress: deletePress,
    isPerformancesInquiryDeleteLoading: isDeleteLoading,
    performancesInquiryNextFivePagePress: nextFivePagePress,
    performancesInquiryPrevFivePagePress: prevFivePagePress,
    performancesInquiryFirstPagePress: firstPagePress,
    performancesInquiryLastPagePress: lastPagePress,
  };
};

export default usePerformanceInquiry;
