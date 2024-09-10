import { SequenceOrder } from '../../../../components/performanceForm/types/perfForm';
import { timelineEnum } from '../../../enums/PerformanceEnum';

export const timelinesData: Sequences[] = [
  {
    key: `1`,
    order: 1,
    timeline: timelineEnum.GOAL_SETTING_SELF,
    text: `Goal Setting`,
    startDate: null,
    endDate: null,
    isActive: false,
  },
  {
    key: `2`,
    order: 2,
    timeline: timelineEnum.MID_YEAR_COACHING_SELF,
    text: `Mid Year Coaching`,
    startDate: null,
    endDate: null,
    isActive: false,
  },
  {
    key: `3`,
    order: 3,
    timeline: timelineEnum.END_YEAR_APPRAISEE,
    text: `End Year Coaching`,
    startDate: null,
    endDate: null,
    isActive: false,
  },
  {
    key: `4`,
    order: 4,
    timeline: timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED,
    text: `Performance Monitoring Completed`,
    startDate: null,
    endDate: null,
    isActive: false,
  },
];

export interface Sequences {
  key: number | string;
  order: SequenceOrder;
  timeline: string;
  text: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}
export interface PerfProgramTimelineRequestData {
  perfTypeId: string;
  sequences: Sequences[];
}
export interface PerfProgramRequestData {
  code: string;
  name: string;
  perfMeasurementFinalTemplateId?: string;
  formTerm?: string;
  finalResultMethod?: string;
  formMember?: string;
  startDate: string;
  endDate: string;
}
