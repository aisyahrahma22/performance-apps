import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

const API_SUCCESSION_SUMMARIZE = '/api/succession/dashboard/summary';

export const changeSlicer = (slicer: any) => {
  const payload: any = {};
  for (const key in slicer) {
    const val = slicer[key];
    if (key.includes('isValidAccess')) {
      payload.isValidAccess = val;
    } else if (key.includes('year')) {
      if (val) {
        payload.year = val;
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
      payload[key] = {
        code: val?.join(',') || '',
      };
    }
  }

  return payload;
};

export const getSuccessionSummarize = (
  url: string = API_SUCCESSION_SUMMARIZE,
  { isByLevel, ...slicer }: any,
) => {
  const qsp = qs.stringify(
    {
      slicer: changeSlicer(slicer),
      isByLevel,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useSuccessionSummarizeDash = () => {
  const { data, isDataEmpty, isDataLoading, isDataError, setFilter } =
    useDataTable({
      api: API_SUCCESSION_SUMMARIZE,
      fetcher: getSuccessionSummarize,
      defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
    });

  return {
    successionSummarizes: data,
    isSuccessionSummarizesEmpty: isDataEmpty,
    isSuccessionSummarizesLoading: isDataLoading,
    isSuccessionSummarizesError: isDataError,
    setSuccessionSummarizeFilter: setFilter,
  };
};

export default useSuccessionSummarizeDash;
