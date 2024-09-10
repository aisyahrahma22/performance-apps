import qs from 'qs';
import axios from '../../axios';
import useDataTable from '../_useDataTable';

const API_SYNC_PROGRESS = '/api/sync-progress';

export enum SyncProgressKeyEnum {
  MasterInstitution = 'siloam_FULL_MasterInstitution',
  MasterMajor = 'siloam_FULL_MasterMajor',
  MasterDegree = 'siloam_FULL_MasterEducationLevel',
  MasterEmploymentType = 'siloam_FULL_MasterEmploymentType',
  MasterJobTitle = 'siloam_FULL_MasterJobTitle',
  MasterTransitionType = 'siloam_FULL_MasterCareerType',
  MasterGrade = 'siloam_FULL_MasterGrade',
  MasterTerminateReason = 'siloam_FULL_MasterResignReason',
  MasterDiscipline = 'siloam_FULL_MasterDiscipline',
  MasterPositionGroupType = 'siloam_FULL_MasterPositionAdditionalType',
  MasterPositionGroup = 'siloam_Full_MasterPositionTypeGroup',
  MasterPosition = 'siloam_Full_MasterPosition',
  MasterEmployee = 'siloam_FULL_MainAttribute',
  MasterEmpEducation = 'siloam_FULL_EmployeeEducation',
  MasterEmpCareer = 'siloam_FULL_CareerHistory',
  MasterEmpDiscipline = 'siloam_FULL_DisciplineTransaction',
  MasterWorkLocation = 'siloam_FULL_MasterWorkLocation',
}

export enum SyncProgressStatusEnum {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

const getSyncProgresses =
  (key: SyncProgressKeyEnum, limit: number) =>
  (url: string = API_SYNC_PROGRESS, filter: any, sort: any, page: any) => {
    const qsp = qs.stringify(
      { key, limit, filter, sort, offset: (page - 1) * limit },
      { skipNulls: true },
    );
    return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
  };

const useSyncProgress = (key: SyncProgressKeyEnum, limit = 5) => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    dataTotalCount,
    dataTotalPage,
    page,
    perPage,
    pagePress,
    nextFivePagePress,
    prevFivePagePress,
    firstPagePress,
    lastPagePress,
  } = useDataTable({
    api: API_SYNC_PROGRESS,
    fetcher: getSyncProgresses(key, limit),
    defaultPerPage: limit,
  });

  return {
    syncProgress: data,
    isSyncProgressEmpty: isDataEmpty,
    isSyncProgressLoading: isDataLoading,
    isSyncProgressError: isDataError,
    syncProgressRefreshPress: refreshPress,
    syncProgressTotalCount: dataTotalCount,
    syncProgressTotalPage: dataTotalPage,
    syncProgressPage: page,
    syncProgressPerPage: perPage,
    syncProgressPagePress: pagePress,
    syncProgressNextFivePagePress: nextFivePagePress,
    syncProgressPrevFivePagePress: prevFivePagePress,
    syncProgressFirstPagePress: firstPagePress,
    syncProgressLastPagePress: lastPagePress,
  };
};

export default useSyncProgress;
