import { MaxKPICount, MaxKPIWeight } from '../../../enums/PerfForm';
import { timelineEnum } from '../../../enums/PerformanceEnum';
import {
  PerfFormEnum,
  FormTermEnum,
  FinalResultMethodEnum,
  FormMemberEnum,
  PerfFormTypeEnum,
} from '../enum/perfForm.enum';

export type PerfFormProps = {
  id: string;
  finalResultCalc: PerfFormEnum;
  isCaptureSiloamValue: boolean;
  performanceFormCode: string;
  perfFormName: string;
  perfProgram: PerfProgramProps;
  perfFormTypes: PerfFormTypeProps[];
};

export interface PerfProgramProps extends DataProps {
  perfMeasurementFinalTemplateId: string;
  formTerm: FormTermEnum;
  finalResultMethod: FinalResultMethodEnum;
  formMember: FormMemberEnum;
  startDate: string;
  endDate: string;
  year: string;
}

export type PerfProgramTimelineSeqProps = {
  id: string;
  order: number;
  timeline: timelineEnum;
  startDate?: any;
  endDate?: any;
  isActive: boolean;
};

//----- form type / category
export type PerfFormTypeProps = {
  id: string;
  weight: number;
  isMidYearScore: boolean;
  isCategory: boolean;
  isKRA: boolean;
  isTarget: boolean;
  isCategoryWeightCalc: boolean;
  isKPIWeightCalc: boolean;
  perfType?: PerfTypeProps;
  perfMeasurement?: PerfMeasurementFormProps;
  items?: PerfFormTypeItemProps[];
};

export type PerfFormTypeItemProps = {
  maxKPICountInput: number;
  id: string;
  categoryWeight: number;
  type: PerfFormTypeEnum;
  perfCategory?: PerfCategoryProps;
  perfFormTypeKPI?: PerfFormTypeKPIProps;
  perfFormTypeKRA?: PerfFormTypeKRAProps;
  perfFormTypeTarget?: PerfFormTypeTargetProps;
};

//----- form KPI
export type PerfFormTypeKPIProps = {
  id: string;
  isUserDefine: boolean;
  isSelection: boolean;
  isEditable: boolean;
  typeMaxKPICount?: MaxKPICount;
  typeMaxKPIWeight?: MaxKPIWeight;
  minKPICountInput?: number;
  maxKPICountInput?: number;
  minKPIWeightInput?: number;
  maxKPIWeightInput?: number;
  details: PerfFormTypeKPIDetailProps[];
};

export type PerfFormTypeKPIDetailProps = {
  id: string;
  isPredefine: boolean;
  weight?: number;
  kra?: PerfKRAProps;
  kpi?: PerfKPIProps;
};

//----- form KRA
export type PerfFormTypeKRAProps = {
  id: string;
  isUserDefine: boolean;
  isSelection: boolean;
  isEditable: boolean;
  details: PerfFormTypeKRADetailProps[];
};

export type PerfFormTypeKRADetailProps = {
  id: string;
  isPredefine: boolean;
  kra?: PerfKRAProps;
};

//----- form Target
export type PerfFormTypeTargetProps = {
  id: string;
  isUserDefine: boolean;
  isEditable: boolean;
  details: PerfFormTypeTargetDetailProps[];
};

export type PerfFormTypeTargetDetailProps = {
  id: string;
  kpi?: PerfKPIProps;
  target?: PerfTargetProps;
};

// ----- Measurement
export type PerfMeasurementFormProps = {
  id: string;
  templateCode: string;
  templateName: string;
  year: string;
  grades: PerfMeasurementGradeProps[];
};

export type PerfMeasurementGradeProps = {
  id: string;
  gradeCode: string;
  gradeName: string;
  point: number;
};

export type PerfTypeProps = DataProps;
export type PerfCategoryProps = DataProps;
export type PerfKRAProps = DataProps;
export type PerfTargetProps = DataProps;
export interface PerfKPIProps extends DataProps {
  description: string;
  keyAction: string;
  behaviour: string;
}

export interface DataProps {
  id: string;
  code: string;
  name: string;
}
