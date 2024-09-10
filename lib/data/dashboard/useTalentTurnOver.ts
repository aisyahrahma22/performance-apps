import axios from '../../axios';
import qs from 'qs';
import useDataTable from '../_useDataTable';

const API_DASHBOARD_TALENT = '/api/dashboard/talent/turn-over';

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
        const year = val.split(' - ');
        const startYear = year[0];
        const endYear = year[1] ? year[1] : startYear;
        payload.year = endYear;
        if (!isLatest) {
          payload.career = {
            startDate: endYear,
            endDate: startYear,
          };
        }
        payload.startYear = startYear;
        payload.endYear = endYear;
      }
    } else if (key.includes('box')) {
      if (val?.length) {
        payload.box = {
          code: val?.join(',') || '',
        };
      }
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

const getTalentTurnOver = (url: string = API_DASHBOARD_TALENT, slicer: any) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useTalentTurnOver = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
  } = useDataTable({
    api: API_DASHBOARD_TALENT,
    fetcher: getTalentTurnOver,
    defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
  });

  return {
    talentTurnOvers: data,
    isTalentTurnOversEmpty: isDataEmpty,
    isTalentTurnOversLoading: isDataLoading,
    isTalentTurnOversError: isDataError,
    talentTurnOversRefreshPress: refreshPress,
    setTalentTurnOversFilter: setFilter,
  };
};

export default useTalentTurnOver;
