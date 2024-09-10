import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_UPLOAD_PROGRESS = '/api/upload-progress';

export enum UploadProgressTypeEnum {
  DEMONSTRATE_SILOAM_VALUE = 'DEMONSTRATE_SILOAM_VALUE',
  EMP_TRAINING = 'EMP_TRAINING',
  MD_TRAINING = 'MD_TRAINING',
  MD_CA = 'MD_CA',
  MD_POSITION_PATH = 'MD_POSITION_PATH',
  IDP_WORKFLOW = 'IDP_WORKFLOW',
  CA_WORKFLOW = 'CA_WORKFLOW',
  EMP_PERFORMANCE = 'EMP_PERFORMANCE',
  EMP_PERFORMANCE_DETAIL = 'EMP_PERFORMANCE_DETAIL',
  EMP_LA = 'EMP_LA',
  EMP_LA_DETAIL = 'EMP_LA_DETAIL',
  MD_PA = 'MD_PA',
  MD_GSP = 'MD_GSP',
  EMP_CA = 'EMP_CA',
  MD_LA = 'MD_LA',
  IDP_REMINDER = 'IDP_REMINDER',
  FSP_REMINDER = 'FSP_REMINDER',
  MD_FSP = 'MD_FSP',
  SUCCESS_PROFILE_BYPASS = 'SUCCESS_PROFILE_BYPASS',
  MD_POSITION_LEVEL = 'MD_POSITION_LEVEL',
  DATA_ACCESS_MAPPING = 'DATA_ACCESS_MAPPING',
  MD_DEGREE_LEVEL = 'MD_DEGREE_LEVEL',
  LB_WORKFLOW = 'LB_WORKFLOW',
  LBE_WORKFLOW = 'LBE_WORKFLOW',
  LR_WORKFLOW = 'LR_WORKFLOW',
  LM_LF = 'LM_LF',
  LREAL_WORKFLOW = 'LREAL_WORKFLOW',
  MD_PERFORMANCE_TYPE = 'MD_PERFORMANCE_TYPE',
  MD_PERFORMANCE_KRA = 'MD_PERFORMANCE_KRA',
  MD_PERFORMANCE_KPI = 'MD_PERFORMANCE_KPI',
  MD_PERFORMANCE_TARGET = 'MD_PERFORMANCE_TARGET',
  MD_PERFORMANCE_CATEGORY = 'MD_PERFORMANCE_CATEGORY',
  PERF_WORKFLOW_POSITION = 'PERF_WORKFLOW_POSITION',
  PERF_WORKFLOW_EMPLOYEE = 'PERF_WORKFLOW_POSITION',
  PERF_PROGRAM = 'PERF_PROGRAM',
  PERF_PROGRAM_TIMELINE = 'PERF_PROGRAM_TIMELINE',
  MD_PERFORMANCE_FORM_TYPE_UPLOAD = 'MD_PERFORMANCE_FORM_TYPE_UPLOAD',
  MD_PERF_FORM_MEASUREMENT_UPLOAD = 'MD_PERF_FORM_MEASUREMENT_UPLOAD',
  MD_PERF_FORM_MEASUREMENT_UPLOADS = 'MD_PERF_FORM_MEASUREMENT_UPLOADS',
  MD_PERF_MEASURE_FINAL_UPLOAD = 'MD_PERF_MEASURE_FINAL_UPLOAD',
  MD_PERF_MEASURE_FINAL_UPLOADS = 'MD_PERF_MEASURE_FINAL_UPLOADS',
  LEVAL_WORKFLOW = 'LEVAL_WORKFLOW',
  PERF_FORM = 'PERF_FORM',
  PERF_FORM_PARTICIPANT = 'PERF_FORM_PARTICIPANT',
  PERFORMANCE_INQUIRY_ABSOLUTE_SCORE = 'PERFORMANCE_INQUIRY_ABSOLUTE_SCORE',
  MD_FSP_POSITION_LEVEL = 'MD_FSP_POSITION_LEVEL',
  MD_SCORING_GUIDELINE = 'MD_SCORING_GUIDELINE',
  DATA_ACCESS_MAPPING_DELETE = 'DATA_ACCESS_MAPPING_DELETE',
  MD_POSITION_GROUPING = 'MD_POSITION_GROUPING',
  MD_POSITION_GROUPING_TYPE = 'MD_POSITION_GROUPING_TYPE',
  MD_POSITION_GROUPS = 'MD_POSITION_GROUPS',
  MD_WL_GROUPING = 'MD_WL_GROUPING',
  MD_WL_GROUPING_TYPE = 'MD_WL_GROUPING_TYPE',
  MD_WL_GROUPS = 'MD_WL_GROUPS',
}

export enum UploadProgressStatusEnum {
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  WAITING = 'WAITING',
}

const getUploadProgresses = async (
  url: string = API_UPLOAD_PROGRESS,
  filter: any,
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    { filter, sort, limit: perPage, offset: (page - 1) * perPage },
    { skipNulls: true },
  );
  const resp = await axios.get(`${url}?${qsp}`);
  return resp.data;
};

const useUploadProgress = (type: UploadProgressTypeEnum) => {
  const defaultFilter = { type: type };
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
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_UPLOAD_PROGRESS,
    fetcher: getUploadProgresses,
    defaultPerPage: 5,
    defaultFilter,
  });

  return {
    uploadProgress: data,
    isUploadProgressEmpty: isDataEmpty,
    isUploadProgressLoading: isDataLoading,
    isUploadProgressError: isDataError,
    uploadProgressTotalCount: dataTotalCount,
    uploadProgressTotalPage: dataTotalPage,
    uploadProgressPage: page,
    uploadProgressPerPage: perPage,
    uploadProgressRefreshPress: refreshPress,
    uploadProgressPagePress: pagePress,
    uploadProgressPerPagePress: perPagePress,
    uploadProgressSort: sort,
    uploadProgressSortPress: sortPress,
    setUploadProgressFilter: setFilter,
    setUploadProgressPage: setPage,
    setUploadProgressPerPage: setPerPage,
    uploadProgressSelectAllPress: selectAllPress,
    uploadProgressSelectOnePress: selectOnePress,
    uploadProgressSelected: selected,
    isUploadProgressSelectedAll: isSelectedAll,
    uploadProgressNextFivePagePress: nextFivePagePress,
    uploadProgressPrevFivePagePress: prevFivePagePress,
    uploadProgressFirstPagePress: firstPagePress,
    uploadProgressLastPagePress: lastPagePress,
  };
};

export default useUploadProgress;
