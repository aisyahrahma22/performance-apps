import { PerfEmpNoteObj } from '../types/goalSettingTypes';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';

export default function mapGoalSettingNotes(
  perfEmpNotes: any,
  midYear?: boolean,
  endYear?: boolean,
) {
  if (!perfEmpNotes) return;
  const perfNote: PerfEmpNoteObj = {};

  if (!midYear || !endYear) {
    perfNote[TimelineNoteType.GOAL_SETTING] = { ...perfEmpNotes };
  }

  if (midYear) {
    perfNote[TimelineNoteType.GOAL_SETTING] = { ...perfEmpNotes.GOAL_SETTING };
    perfNote[TimelineNoteType.MID_YEAR] = { ...perfEmpNotes.MID_YEAR };
  }

  if (endYear) {
    perfNote[TimelineNoteType.GOAL_SETTING] = { ...perfEmpNotes.GOAL_SETTING };
    perfNote[TimelineNoteType.MID_YEAR] = { ...perfEmpNotes.MID_YEAR };
    perfNote[TimelineNoteType.END_YEAR] = { ...perfEmpNotes.END_YEAR };
  }

  return perfNote;
}
