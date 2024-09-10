import {
  MaxKPICount,
  MaxKPIWeight,
  PerfFormEnum,
  PerfFormStatusEnum,
} from '../../../lib/enums/PerfForm';

export interface PerfFormSectionPageInfoProps {
  pageNumber: number;
  title: string;
  isFirst: boolean;
  isLast: boolean;
  requiredFields: string[];
}

export type KPIConfiguration = {
  isUserDefine?: boolean;
  isSelection?: boolean;
  isEditable?: boolean;
  typeMaxKPICount?: MaxKPICount;
  typeMaxKPIWeight?: MaxKPIWeight;
  minKPICountInput?: number | string;
  maxKPICountInput?: number | string;
  minKPIWeightInput?: number | string;
  maxKPIWeightInput?: number | string;
  dataKPIDetails: KPIDetailsConfiguration[];
};

export type KPIDetailsConfiguration = {
  localIsKRA?: boolean;
  isPredefine?: boolean;
  weight?: number | string;
  performanceKPI?: any;
  performanceKRA?: any;
};

export type KRAConfiguration = {
  localIsCategory?: boolean;
  localIsKRA?: boolean;
  isUserDefine?: boolean;
  isSelection?: boolean;
  isEditable?: boolean;
  dataKRADetails: KRADetailsConfiguration[];
};

export type KRADetailsConfiguration = {
  isPredefine?: boolean;
  performanceKRA?: any;
};

export type TargetConfiguration = {
  localIsCategory?: boolean;
  localIsTarget?: boolean;
  isUserDefine?: boolean;
  isEditable?: boolean;
  dataTargetDetails: TargetDetailsConfiguration[];
};

export type TargetDetailsConfiguration = {
  performanceKPI?: any;
  performanceTarget?: any;
};

export type CategoryConfiguration = {
  localIsCategory?: boolean;
  localIsKRA?: boolean;
  localIsTarget?: boolean;
  perfCategory?: any;
  categoryWeight: any;
  dataKPI?: KPIConfiguration;
  dataKRA?: KRAConfiguration;
  dataTarget?: TargetConfiguration;
};

export type positionConfiguration = {
  position: any;
};

export type employeeConfiguration = {
  employee: any;
};

export type PerfTypeConfiguration = {
  weight?: number | string;
  isMidYearScore?: boolean;
  isKRA: boolean;
  isTarget: boolean;
  perfTypeId?: any;
  perfMeasurementTempId?: any;
  isCategory: boolean;
  isCategoryWeightCalc: boolean;
  isKPIWeightCalc: boolean;
  order: number;
  dataCategory: CategoryConfiguration[];
};

export interface PerfFromRequestDataFormProps {
  id?: string;
  isCaptureSiloamValue: boolean;
  performanceFormCode: string;
  perfProgramId: string;
  perfFormName: string;
  dataPosition: positionConfiguration[];
  dataEmployee: employeeConfiguration[];
  finalResultCalc?: PerfFormEnum;
  status?: PerfFormStatusEnum;
  dataPerfType: PerfTypeConfiguration[];
  sequences: Sequences[];
}

export type SequenceOrder = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Sequences {
  order: SequenceOrder;
  timeline: string;
  text?: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export interface PerfFromEditDataProps {
  id?: string;
  performanceFormCode: string;
  perfFormName: string;
  dataPosition: any;
  dataEmployee: any;
  finalResultCalc?: PerfFormEnum;
  status?: PerfFormStatusEnum;
  dataPerfType: PerfTypeConfiguration[];
}
