import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import { Sequences } from '../types/perfForm';

export const timelinesData: Sequences[] = [
  {
    order: 1,
    timeline: timelineEnum.GOAL_SETTING_SELF,
    text: `Goal Setting`,
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    order: 2,
    timeline: timelineEnum.MID_YEAR_COACHING_SELF,
    text: `Mid Year Coaching`,
    startDate: null,
    endDate: null,
    isActive: true,
  },
  {
    order: 3,
    timeline: timelineEnum.END_YEAR_APPRAISEE,
    text: `End Year Coaching`,
    startDate: null,
    endDate: null,
    isActive: true,
  },
];
