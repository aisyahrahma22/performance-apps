import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_PERF_FORM_PROGRESS = '/api/performance-form/async';

const getPerfFormProgresses =
  (limit: number) =>
  (url: string = API_PERF_FORM_PROGRESS) => {
    const qsp = qs.stringify({ limit }, { skipNulls: true });
    return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
  };

const usePerfFormProgress = (limit: number) => {
  const { data, isDataEmpty, isDataLoading, isDataError, refreshPress } =
    useDataTable({
      api: API_PERF_FORM_PROGRESS,
      fetcher: getPerfFormProgresses(limit),
    });

  return {
    perfFormProgress: data,
    isPerfFormProgressEmpty: isDataEmpty,
    isPerfFormProgressLoading: isDataLoading,
    isPerfFormProgressError: isDataError,
    perfFormProgressRefreshPress: refreshPress,
  };
};

export default usePerfFormProgress;
