import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_REPORT_PROGRESS = '/api/report/progress';

export enum ReportProgressStatusEnum {
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
}

const getReportProgresses =
  (limit: number) =>
  (url: string = API_REPORT_PROGRESS) => {
    const qsp = qs.stringify({ limit }, { skipNulls: true });
    return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
  };

const useReportProgress = (limit = 5) => {
  const { data, isDataEmpty, isDataLoading, isDataError, refreshPress } =
    useDataTable({
      api: API_REPORT_PROGRESS,
      fetcher: getReportProgresses(limit),
    });

  return {
    reportProgress: data,
    isReportProgressEmpty: isDataEmpty,
    isReportProgressLoading: isDataLoading,
    isReportProgressError: isDataError,
    reportProgressRefreshPress: refreshPress,
  };
};

export default useReportProgress;
