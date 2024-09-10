import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_SCHEDULER = '/api/system-configuration/scheduler';

const getScheduler = (
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
  return axios.get(`${url}?${qsp}`).then((resp: any) => resp.data);
};

const useScheduler = (defaultFilter?: any) => {
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
    verificationPress,
    isVerificationLoading,
  } = useDataTable({
    api: API_SCHEDULER,
    fetcher: getScheduler,
    defaultFilter,
  });

  return {
    scheduler: data,
    isSchedulerEmpty: isDataEmpty,
    isSchedulerLoading: isDataLoading,
    isSchedulerError: isDataError,
    isSchedulerSelectedAll: isSelectedAll,
    schedulerTotalCount: dataTotalCount,
    schedulerTotalPage: dataTotalPage,
    schedulerPage: page,
    schedulerPerPage: perPage,
    schedulerRefreshPress: refreshPress,
    schedulerPagePress: pagePress,
    schedulerPerPagePress: perPagePress,
    schedulerSort: sort,
    schedulerSortPress: sortPress,
    setSchedulerFilter: setFilter,
    setSchedulerPage: setPage,
    setSchedulerPerPage: setPerPage,
    schedulerSubmitPress: verificationPress,
    isSchedulerSubmitLoading: isVerificationLoading,
  };
};

export default useScheduler;
