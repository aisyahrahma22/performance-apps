import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_MEASUREMENT_LIST = '/api/performance-form/measurement';

export const getPerfMeasurementList = (
  url: string = API_PERF_MEASUREMENT_LIST,
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

const usePerfMeasurementList = (isAll = false) => {
  const defaultFilter = isAll ? {} : { isActive: true };
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
    api: API_PERF_MEASUREMENT_LIST,
    fetcher: getPerfMeasurementList,
    defaultFilter,
    defaultSort: { isActive: 'DESC' },
  });

  return {
    positions: data,
    isPerfMeasurementListEmpty: isDataEmpty,
    isPerfMeasurementListLoading: isDataLoading,
    isPerfMeasurementListError: isDataError,
    positionsTotalCount: dataTotalCount,
    positionsTotalPage: dataTotalPage,
    positionsPage: page,
    positionsPerPage: perPage,
    positionsRefreshPress: refreshPress,
    positionsPagePress: pagePress,
    positionsPerPagePress: perPagePress,
    positionsSort: sort,
    positionsSortPress: sortPress,
    setPerfMeasurementListFilter: setFilter,
    setPerfMeasurementListPage: setPage,
    setPerfMeasurementListPerPage: setPerPage,
    defaultFilter,
  };
};

export default usePerfMeasurementList;
