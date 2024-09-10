import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_LA_DASHBOARD = '/api/emp-leadership-assessment/dashboard';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  for (const key in slicer) {
    const val = slicer[key];
    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('year')) {
      if (val) {
        const year = val.split(' - ');
        const startYear = year[0];
        const endYear = year[1] ? year[1] : startYear;
        payload.idpItem = {
          startDate: endYear,
          endDate: startYear,
        };
        payload.owner = {
          fullJoinDate: endYear,
        };
        payload.year = endYear;
      }
    } else if (key.includes('box')) {
      if (val?.length) {
        payload.box = {
          code: val?.join(',') || '',
        };
      }
    } else if (key === 'typeCode') {
      payload[key] = val;
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
      payload[key] = {
        code: val?.join(',') || '',
      };
    }
  }

  return payload;
};

export const getLADashboard = (url: string = API_LA_DASHBOARD, slicer: any) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useLADashboard = () => {
  const { data, isDataEmpty, isDataLoading, isDataError, setFilter } =
    useDataTable({
      api: API_LA_DASHBOARD,
      fetcher: getLADashboard,
      defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
    });

  return {
    laDashboard: data,
    isLADashboardEmpty: isDataEmpty,
    isLADashboardLoading: isDataLoading,
    isLADashboardError: isDataError,
    setLADashboardFilter: setFilter,
  };
};

export default useLADashboard;
