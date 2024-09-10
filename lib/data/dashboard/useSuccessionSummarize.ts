import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';
import { join } from 'lodash';

const API_SUCCESSION_SUMMARIZE = '/api/succession/dashboard';

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
    } else if (key.includes('box')) {
      if (val?.length) {
        payload.box = {
          code: val?.join(',') || '',
        };
      }
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
  sort: any,
  page: any,
  perPage: any,
) => {
  const qsp = qs.stringify(
    {
      slicer: changeSlicer(slicer),
      paginationQuery: {
        filter: { code: join(slicer?.positionGroupsGroup, ',') },
        sort,
        limit: perPage,
        offset: (page - 1) * perPage,
      },
      isByLevel,
    },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useSuccessionSummarize = () => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
    sort,
    page,
    setPage,
    perPage,
    pagePress,
    dataTotalCount,
    dataTotalPage,
  } = useDataTable({
    api: API_SUCCESSION_SUMMARIZE,
    fetcher: getSuccessionSummarize,
    defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
  });

  return {
    successionSummarizes: data,
    isSuccessionSummarizesEmpty: isDataEmpty,
    isSuccessionSummarizesLoading: isDataLoading,
    isSuccessionSummarizesError: isDataError,
    successionSummarizesRefreshPress: refreshPress,
    setSuccessionSummarizesFilter: setFilter,
    successionSummarizeSort: sort,
    successionSummarizePage: page,
    setSuccessionSummarizePage: setPage,
    successionSummarizePerPage: perPage,
    successionSummarizePagePress: pagePress,
    successionSummarizeDataTotalCount: dataTotalCount,
    successionSummarizeDataTotalPage: dataTotalPage,
  };
};

export default useSuccessionSummarize;
