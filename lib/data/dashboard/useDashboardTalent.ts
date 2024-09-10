import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_DASHBOARD_TALENT = '/api/dashboard/talent';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  // check data latest
  const now = new Date().getFullYear();
  const isLatest = Number(slicer['year']) === now;

  for (const key in slicer) {
    const val = slicer[key];
    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('year')) {
      if (val) {
        payload.year = val;
        if (!isLatest) {
          payload.career = {
            startDate: val,
            endDate: val,
          };
        }
      }
    } else if (key.includes('box')) {
      if (val?.length) {
        payload.talentProfile = {
          isFinal: true,
        };
        payload.box = {
          code: val?.join(',') || '',
        };
      }
    } else if (key.includes('typeCode')) {
      payload.typeCode = val;
    } else if (
      key.includes('status') ||
      key.includes('period') ||
      key.includes('perfProgram') ||
      key.includes('perfFormName') ||
      key.includes('employee') ||
      key.includes('perfTerm')
    ) {
      // nothing happen
    } else if (key.includes('isRequiredAccessMapping')) {
      payload.isRequiredAccessMapping = val;
    } else {
      const keyName = slicer['year'] && !isLatest ? `${key}Career` : key;
      payload[keyName] = {
        code: val?.join(',') || '',
      };
    }
  }

  return payload;
};

const getDashboardTalent = (
  url: string = API_DASHBOARD_TALENT,
  slicer: any,
) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useDashboardTalent = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
  } = useDataTable({
    api: API_DASHBOARD_TALENT,
    fetcher: getDashboardTalent,
    defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
  });

  return {
    dashboardTalents: data,
    isDashboardTalentsEmpty: isDataEmpty,
    isDashboardTalentsLoading: isDataLoading,
    isDashboardTalentsError: isDataError,
    dashboardTalentsRefreshPress: refreshPress,
    setDashboardTalentsFilter: setFilter,
  };
};

export default useDashboardTalent;
