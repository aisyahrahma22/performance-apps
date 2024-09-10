import {
  PerfEmployeeStatusEnum,
  PerfEmpRevisionNoteTypeEnum,
  PerfGoalSettingNoteType,
  TimelineNoteType,
} from '../../../lib/enums/GoalSetting';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';

// type for counting cumulative weight per kpi
export interface cumulativeWeight {
  [id: string]: cumulativeWeightItem | number;
}

export interface cumulativeWeightItem {
  [id: string]: number;
}

export interface PerfEmployee {
  id: string;
  // notes: string;
  itemsPerKPIs: {
    [perfEmpItemId: string]: PerfEmpItemPerKPI[];
  };
  // note: {
  //   [id: string]: PerfEmpItemTypeNoteObj;
  // };
  revise: PerfGoalSettingRevisionNote | null;
  status?: PerfEmployeeStatusEnum;
  deletedItemPerKPIs: PerfEmpItemPerKPI[];
  notes?: PerfEmpNoteObj;
}

export interface PerfEmpNoteObj {
  [TimelineNoteType.GOAL_SETTING]?: {
    [PerfGoalSettingNoteType.APPRAISEE]?: PerfEmpNote;
    [PerfGoalSettingNoteType.DIRECT_MANAGER]?: PerfEmpNote;
    [PerfGoalSettingNoteType.ABOVE_MANAGER]?: PerfEmpNote;
  };
  [TimelineNoteType.MID_YEAR]?: {
    [PerfGoalSettingNoteType.APPRAISEE]?: PerfEmpNote;
    [PerfGoalSettingNoteType.DIRECT_MANAGER]?: PerfEmpNote;
    [PerfGoalSettingNoteType.ABOVE_MANAGER]?: PerfEmpNote;
  };
  [TimelineNoteType.END_YEAR]?: {
    [PerfGoalSettingNoteType.APPRAISEE]?: PerfEmpNote;
    [PerfGoalSettingNoteType.DIRECT_MANAGER]?: PerfEmpNote;
    [PerfGoalSettingNoteType.ABOVE_MANAGER]?: PerfEmpNote;
  };
}

export interface PerfEmpNote {
  id?: string;
  note: string;
  type:
    | PerfGoalSettingNoteType.APPRAISEE
    | PerfGoalSettingNoteType.DIRECT_MANAGER
    | PerfGoalSettingNoteType.ABOVE_MANAGER;
  timeline:
    | timelineEnum.GOAL_SETTING_SELF
    | timelineEnum.GOAL_SETTING_DIRECT_MANAGER
    | timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER
    | timelineEnum.MID_YEAR_COACHING_SELF
    | timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER
    | timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER
    | timelineEnum.END_YEAR_APPRAISEE
    | timelineEnum.END_YEAR_DIRECT_MANAGER
    | timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER;
}

// export interface PerfEmpNotes {
//   id?: string;
//   type: string;
//   note: string;
// }

export interface PerfGoalSettingRevisionNote {
  id?: string;
  note: string;
  type: PerfEmpRevisionNoteTypeEnum;
  updaterEmp?: any;
}

export interface PerfEmpItemPerKPI {
  id?: string;
  idx?: number;
  isKRASelection?: boolean;
  isKPISelection?: boolean;
  isPredefined: boolean;
  kra: string | null;
  kpi: string | null;
  target: string | null;
  weight: number;
  achievement: string;
  lastVersion?: string;
  perfEmpItemType: string | PerfEmpItemType | null;
  perfEmpItem: string | PerfEmpItem | null;
  perfKRA: string | PerformanceKRADataType | null;
  perfKPI: string | PerformanceKPIDataType | null;
  code?: string | null;
  scores: any;
}

export interface PerfEmpDetails {
  id: string;
  status: string;
  timeline: any;
  perfEmpItemType: PerfEmpItemType[];
}

export interface PerfEmpItemType {
  id: string;
  perfFormType: PerfFormType;
  perfEmpItem: PerfEmpItem[];
  // perfEmpItemTypeNote: PerfEmpItemTypeNoteObj;
}

// export interface PerfEmpItemTypeNoteObj {
//   [PerfGoalSettingNoteType.APPRAISEE]?: PerfEmpItemTypeNote;
//   [PerfGoalSettingNoteType.DIRECT_MANAGER]?: PerfEmpItemTypeNote;
//   [PerfGoalSettingNoteType.ABOVE_MANAGER]?: PerfEmpItemTypeNote;
// }

/**
 * This is type for 'perfFormType' data in goal setting api. This data are joins from 'Perf Form' and 'Perf Employee'.
 * Can be represented into 'Perf Type' sub feature inside goal setting form
 */
export interface PerfFormType {
  id: string;
  isCategory: boolean;
  isKRA: boolean;
  isTarget: boolean;
  isCategoryWeightCalc: boolean;
  isKPIWeightCalc: boolean;
  isMidYearScore: boolean;
  weight: string;
  perfTypeId: {
    id: string;
    code: string;
    name: string;
  };
}

/**
 * This is typing for "perfEmpItem" data in goal setting api. This data are joins from 'Perf Form' and 'Perf Employee'.
 * Contains 'Category', 'KRA', 'KPI', and 'Target' data that can be used for defining 'Category' sub feature in goal setting form.
 */
export interface PerfEmpItem {
  id: string;
  perfEmpItemTypeId: string;
  perfEmpItemPerKPI: PerfEmpItemPerKPI[];
  perfFormTypeItem: {
    id: string;
    type: 'CATEGORY' | 'NON_CATEGORY';
    categoryWeight: string | null;
    perfCategory: {
      id: string;
      name: string;
      code: string;
    };
  };
  perfFormTypeKRA: {
    isEditable: boolean;
    isSelection: boolean;
    isUserDefine: boolean;
    dataKRADetails: PerfDataKRADetailsDataType[];
  };
  perfFormTypeKPI: {
    id: string;
    isEditable: boolean;
    isSelection: boolean;
    isUserDefine: boolean;
    maxKPICountInput: string | number | null;
    maxKPIWeightInput: string | number | null;
    minKPICountInput: string | number | null;
    minKPIWeightInput: string | number | null;
    typeMaxKPICount: 'LIMITED' | 'UNLIMITED' | null;
    typeMaxKPIWeight: 'LIMITED' | 'UNLIMITED' | null;
    dataKPIDetails: PerfDataKPIDetailsDataType[];
  };
  perfFormTypeTarget: {
    isEditable: boolean;
    isUserDefine: boolean;
    dataTargetDetails: PerfDataTargetDetailsDataType[];
  };
}

// ========================================================

// data kpi details data structure for perf goal setting
export interface PerfDataKPIDetailsDataType {
  id: string;
  isPredefine: boolean;
  performanceKPI: PerformanceKPIDataType;
  performanceKRA: PerformanceKRADataType;
  weight: string | number;
}

// data kra details data structure for perf goal setting
export interface PerfDataKRADetailsDataType {
  id: string;
  isPredefine: boolean;
  performanceKRA: {
    id: string;
    name: string;
    code: string;
  };
}

// data target details data structure for perf goal setting
export interface PerfDataTargetDetailsDataType {
  id: string;
  performanceKPI: PerformanceKPIDataType;
  performanceTarget: PerformanceTargetDataType;
}

// ========================================================

export interface PerformanceKRADataType {
  id: string;
  name: string;
  code: string;
}

export interface PerformanceKPIDataType {
  id: string;
  name: string;
  code: string;
  description: string;
  keyAction: string;
  behaviour: string;
}

export interface PerformanceTargetDataType {
  id: string;
  name: string;
  code: string;
}
