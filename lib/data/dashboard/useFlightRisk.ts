import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

// const API_FLIGHT_RISK = '/api/talent-review-meeting/flight-risk-dashboard';

const API_FLIGHT_RISK = '/api/data-bank-talent-mapping/flight-risk-dashboard';

const API_FLIGHT_RISK_FUTURE_POSITION =
  '/api/talent-review-meeting/flight-risk-dashboard-development';

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
        payload.box = {
          code: val?.join(',') || '',
        };
      }
    } else if (
      key.includes('retentionRisk') ||
      key.includes('criticalBusiness')
    ) {
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
    } else if (key.includes('empStatus')) {
      payload.empStatus = val;
    } else {
      const keyName = slicer['year'] && !isLatest ? `${key}Career` : key;
      payload[keyName] = {
        code: val?.join(',') || '',
      };
    }
  }

  return payload;
};

const getFlightRisk = (url: string = API_FLIGHT_RISK, slicer: any) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useFlightRisk = (futurePosition: boolean) => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
    dataTotalCount,
  } = useDataTable({
    api: !futurePosition ? API_FLIGHT_RISK : API_FLIGHT_RISK_FUTURE_POSITION,
    fetcher: getFlightRisk,
    defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
  });

  return {
    flightRisks: data,
    isFlightRisksEmpty: isDataEmpty,
    isFlightRisksLoading: isDataLoading,
    isFlightRisksError: isDataError,
    FlightRisksRefreshPress: refreshPress,
    setFlightRisksFilter: setFilter,
    flightRiskTotalCount: dataTotalCount,
  };
};

export default useFlightRisk;
