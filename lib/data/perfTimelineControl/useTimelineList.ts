import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_TIMELINE_LIST = '/api/timeline-control/data';

export const getTimelinesList = (
  url: string = API_TIMELINE_LIST,
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

const useTimelinesList = () => {
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
    api: API_TIMELINE_LIST,
    fetcher: getTimelinesList,
  });

  return {
    timelines: data,
    isTimelinesListEmpty: isDataEmpty,
    isTimelinesListLoading: isDataLoading,
    isTimelinesListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setTimelinesListFilter: setFilter,
    setTimelinesListPage: setPage,
    setTimelinesListPerPage: setPerPage,
  };
};

export default useTimelinesList;
