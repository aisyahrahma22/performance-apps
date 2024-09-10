import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_IDP_SUMMARIZE = '/api/IDPRequest/dashboard-summary';
const API_IDP_TALENT = '/api/IDPRequest/talent-summary';

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
        payload.idpItem = {
          startDate: endYear + 1,
          endDate: startYear,
        };
        payload.owner = {
          fullJoinDate: endYear,
        };
        payload.year = endYear;
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
    } else if (key === 'typeCode') {
      payload[key] = val;
    } else if (key.includes('empWorkLocation')) {
      const keyName = slicer['year'] && !isLatest ? `${key}Career` : key;
      payload[keyName] = {
        code: [...val, ...val]?.join(',') || '',
      };
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

const getIDPSummarize = (url: string = API_IDP_SUMMARIZE, slicer: any) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useIDPSummarize = (isTalent?: boolean, defaultFilter?: any) => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
  } = useDataTable({
    api: isTalent ? API_IDP_TALENT : API_IDP_SUMMARIZE,
    fetcher: getIDPSummarize,
    defaultFilter: {
      ...defaultFilter,
      isValidAccess: false,
      isRequiredAccessMapping: false,
    },
  });

  return {
    idpSummarizes: data,
    isIDPSummarizesEmpty: isDataEmpty,
    isIDPSummarizesLoading: isDataLoading,
    isIDPSummarizesError: isDataError,
    idpSummarizesRefreshPress: refreshPress,
    setIDPSummarizesFilter: setFilter,
  };
};

export default useIDPSummarize;
