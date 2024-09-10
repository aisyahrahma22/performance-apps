import axios from '../../axios';
import useDataTable from '../_useDataTable';
import qs from 'qs';

// const API_HUMAN_ASSET_VALUE =
//   '/api/talent-review-meeting/human-asset-value-dashboard';

const API_HUMAN_ASSET_VALUE =
  '/api/data-bank-talent-mapping/human-asset-value-dashboard';

const API_HUMAN_ASSET_VALUE_FUTURE_POSITION =
  '/api/talent-review-meeting/human-asset-value-dashboard-development';

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
      key.includes('NA') ||
      key.includes('singleBox') ||
      key.includes('globalBox')
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

const getHumanAssetValue = (
  url: string = API_HUMAN_ASSET_VALUE,
  slicer: any,
  // sort: any,
  // page: any,
  // perPage: any,
) => {
  const qsp = qs.stringify(
    { slicer: changeSlicer(slicer) },
    { skipNulls: true },
  );
  return axios.get(`${url}?${qsp}`).then((resp) => resp.data);
};

const useHumanAssetValue = (futurePosition: boolean) => {
  const {
    data,
    isDataEmpty,
    isDataLoading,
    isDataError,
    refreshPress,
    setFilter,
    dataTotalCount,
    setPerPage,
  } = useDataTable({
    api: !futurePosition
      ? API_HUMAN_ASSET_VALUE
      : API_HUMAN_ASSET_VALUE_FUTURE_POSITION,
    fetcher: getHumanAssetValue,
    defaultFilter: { isValidAccess: false, isRequiredAccessMapping: false },
  });

  return {
    humanAssetValues: data,
    isHumanAssetValuesEmpty: isDataEmpty,
    isHumanAssetValuesLoading: isDataLoading,
    isHumanAssetValuesError: isDataError,
    HumanAssetValuesRefreshPress: refreshPress,
    setHumanAssetValuesFilter: setFilter,
    humanAssetValueTotalCount: dataTotalCount,
    setHumanAssetValuePerPage: setPerPage,
  };
};

export default useHumanAssetValue;
