import axios from '../../axios';
import useSWR from 'swr';
import {
  MaxKPICount,
  MaxKPIWeight,
  PerfFormEnum,
  PerfFormStatusEnum,
} from '../../enums/PerfForm';
import { timelineEnum } from '../../enums/PerformanceEnum';
import { useCallback } from 'react';

const API_PERFORMANCE_FORM_ID = '/api/performance-form';

export const getPerformanceFormId = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceFormId = (id: string) => {
  const { data, error, mutate } = useSWR<PerfFormResponse>(
    id ? [API_PERFORMANCE_FORM_ID, id] : null,
    getPerformanceFormId,
    {
      revalidateOnMount: true,
    },
  );

  const refreshPress = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    performanceForm: data,
    isPerformanceFormLoading: !error && !data,
    isPerformanceFormError: error,
    performanceFormRefreshPress: refreshPress,
  };
};

export type PerfFormResponse = {
  isCaptureSiloamValue: boolean;
  id?: string;
  performanceFormCode: string;
  perfProgram: PerfFormProgram;
  perfFormName: PerfFormName;
  dataPosition: DataPosition[];
  dataEmployee: DataEmployee[];
  finalResultCalc?: PerfFormEnum;
  status?: PerfFormStatusEnum;
  dataPerfType: DataPerfType[];
  sequences: DataSequence[];
};

export type PerfFormProgram = {
  id: string;
  name: string;
  code: string;
  formTerm: string;
  finalResultMethod: string;
  startDate: string;
  endDate: string;
  formMember: string;
};

export type PerfFormName = {
  id: string;
  name: string;
  code: string;
};

export type DataPosition = {
  id: string;
  position: any;
};

export type DataEmployee = {
  id: string;
  employee: {
    id: string;
    code: string;
    no: string;
    fullName: string;
    email: string;
  };
};

export type DataSequence = {
  id: string;
  perfFormId: string;
  order: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  timeline: timelineEnum;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

// type section
export type DataPerfType = {
  id: string;
  weight: number | string;
  isMidYearScore: boolean;
  isKRA: boolean;
  isTarget: boolean;
  perfTypeId: {
    id: string;
    name: string;
    code: string;
  };
  perfMeasurementTempId: {
    id: string;
    templateName: string;
    templateCode: string;
    year: number | string;
  };
  isCategory: boolean;
  isCategoryWeightCalc: boolean;
  isKPIWeightCalc: boolean;
  dataCategory: DataPerfCategory[];
  order: number;
};

// category type
export type DataPerfCategory = {
  id: string;
  type: string;
  categoryWeight: string;
  perfCategory: {
    id: string;
    code: string;
    name: string;
  };
  dataKRA: DataKRA;
  dataKPI: DataKPI;
  dataTarget: DataTarget;
};

export type DataKRA = {
  id: string;
  isUserDefine: boolean;
  isSelection: boolean;
  isEditable: boolean;
  dataKRADetails:
    | {
        id: string;
        isPredefine: boolean;
        performanceKRA?: {
          id: string;
          code: string;
          name: string;
        };
      }[]
    | [];
};

export type DataKPI = {
  id: string;
  isUserDefine: boolean;
  isSelection: boolean;
  isEditable: boolean;
  typeMaxKPICount?: MaxKPICount;
  typeMaxKPIWeight?: MaxKPIWeight;
  minKPICountInput?: number | string;
  maxKPICountInput?: number | string;
  minKPIWeightInput?: number | string;
  maxKPIWeightInput?: number | string;
  dataKPIDetails:
    | {
        id: string;
        isPredefine: boolean;
        weight: number | string;
        performanceKPI?: {
          id: string;
          code: string;
          name: string;
          description: string;
          keyAction: string;
          behaviour: string;
        };
        performanceKRA?: {
          id: string;
          code: string;
          name: string;
        };
      }[]
    | [];
};

export type DataTarget = {
  id: string;
  isUserDefine?: boolean;
  isEditable?: boolean;
  dataTargetDetails:
    | {
        id: string;
        performanceKPI?: {
          id: string;
          code: string;
          name: string;
          description: string;
          keyAction: string;
          behaviour: string;
        };
        performanceTarget?: {
          id: string;
          code: string;
          name: string;
        };
      }[]
    | [];
};

export default usePerformanceFormId;
