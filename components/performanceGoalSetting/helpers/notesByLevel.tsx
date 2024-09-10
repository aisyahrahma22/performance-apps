import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';

export const notesByLevels = [
  {
    level: PerfLevelEnum.APPRAISEE,
    name: 'goalsetting.appraise.note',
    label: 'Goal Setting',
    placeholder: 'Goal Setting Notes',
    timeline: timelineEnum.GOAL_SETTING_SELF,
    types: TimelineNoteType.GOAL_SETTING,
  },
  {
    level: PerfLevelEnum.DIRECT_MANAGER,
    name: 'goalsetting.manager.note',
    label: 'Goal Setting',
    placeholder: 'Goal Setting Notes',
    timeline: timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
    types: TimelineNoteType.GOAL_SETTING,
  },
  {
    level: PerfLevelEnum.ABOVE_MANAGER,
    name: 'goalsetting.aboveManager.note',
    label: 'Goal Setting',
    placeholder: 'Goal Setting Notes',
    timeline: timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
    types: TimelineNoteType.GOAL_SETTING,
  },
  {
    level: PerfLevelEnum.APPRAISEE,
    name: 'midyear.appraise.note',
    label: 'Mid Year',
    placeholder: 'Mid Year Notes',
    timeline: timelineEnum.MID_YEAR_COACHING_SELF,
    types: TimelineNoteType.MID_YEAR,
  },
  {
    level: PerfLevelEnum.DIRECT_MANAGER,
    name: 'midyear.manager.note',
    label: 'Mid Year',
    placeholder: 'Mid Year Notes',
    timeline: timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
    types: TimelineNoteType.MID_YEAR,
  },
  {
    level: PerfLevelEnum.ABOVE_MANAGER,
    name: 'midyear.aboveManager.note',
    label: 'Mid Year',
    placeholder: 'Mid Year Notes',
    timeline: timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
    types: TimelineNoteType.MID_YEAR,
  },
  {
    level: PerfLevelEnum.APPRAISEE,
    name: 'endyear.appraise.note',
    label: 'End Year',
    placeholder: 'End Year Notes',
    timeline: timelineEnum.END_YEAR_APPRAISEE,
    types: TimelineNoteType.END_YEAR,
  },
  {
    level: PerfLevelEnum.DIRECT_MANAGER,
    name: 'endyear.manager.note',
    label: 'End Year',
    placeholder: 'End Year Notes',
    timeline: timelineEnum.END_YEAR_DIRECT_MANAGER,
    types: TimelineNoteType.END_YEAR,
  },
  {
    level: PerfLevelEnum.ABOVE_MANAGER,
    name: 'endyear.aboveManager.note',
    label: 'End Year',
    placeholder: 'End Year Notes',
    timeline: timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
    types: TimelineNoteType.END_YEAR,
  },
];
