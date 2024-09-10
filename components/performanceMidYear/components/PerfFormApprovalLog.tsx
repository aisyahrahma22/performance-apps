import React, { useMemo, useState } from 'react';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import { RightEnum } from '../../../lib/enums/RightEnum';
import { RenderGuard } from '../../RenderGuard';
import TablePerfEmpNote from './TablePerfEmpNote';
import TablePerfEmpRevision from './TablePerfEmpRevisions';
import TablePerfEmpApprovalList from './TablePerfMidYearApprovalList';

interface PerfFormApprovalLogProps {
  id: string;
  level: PerfLevelEnum;
  isEndYear: boolean;
}

const timelineSelfMidYear = [
  timelineEnum.GOAL_SETTING_SELF,
  timelineEnum.MID_YEAR_COACHING_SELF,
];
const timelineDMMidYear = [
  timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
  timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
];
const timelineADMMidYear = [
  timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
  timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
];

const timelineSelfEndYear = [
  timelineEnum.GOAL_SETTING_SELF,
  timelineEnum.MID_YEAR_COACHING_SELF,
  timelineEnum.END_YEAR_APPRAISEE,
];
const timelineDMEndYear = [
  timelineEnum.GOAL_SETTING_DIRECT_MANAGER,
  timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER,
  timelineEnum.END_YEAR_DIRECT_MANAGER,
];
const timelineADMEndYear = [
  timelineEnum.GOAL_SETTING_ABOVE_DIRECT_MANAGER,
  timelineEnum.MID_YEAR_COACHING_ABOVE_DIRECT_MANAGER,
  timelineEnum.END_YEAR_ABOVE_DIRECT_MANAGER,
];

const PerfFormApprovalLog = ({
  id,
  level,
  isEndYear,
}: PerfFormApprovalLogProps) => {
  const [isHide, setIsHide] = useState(false);

  const timelines = useMemo(() => {
    const result: timelineEnum[] = [];

    switch (level) {
      case PerfLevelEnum.APPRAISEE:
        isEndYear
          ? result.push(...timelineSelfEndYear)
          : result.push(...timelineSelfMidYear);
        break;
      case PerfLevelEnum.DIRECT_MANAGER:
        isEndYear
          ? result.push(...timelineSelfEndYear, ...timelineDMEndYear)
          : result.push(...timelineSelfMidYear, ...timelineDMMidYear);
        break;
      case PerfLevelEnum.ABOVE_MANAGER:
        isEndYear
          ? result.push(
              ...timelineSelfEndYear,
              ...timelineDMEndYear,
              ...timelineADMEndYear,
            )
          : result.push(
              ...timelineSelfMidYear,
              ...timelineDMMidYear,
              ...timelineADMMidYear,
            );
        break;
      default:
        break;
    }

    return result;
  }, [level]);

  return (
    <Segment raised>
      <Grid>
        <Grid.Row verticalAlign={'middle'}>
          <Grid.Column width={'14'}>
            <Header as={'h4'} color={'violet'}>
              LOGS & APPROVAL
            </Header>
          </Grid.Column>
          <Grid.Column width={'2'} verticalAlign={'middle'}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                icon={isHide ? 'chevron down' : 'chevron up'}
                onClick={() => setIsHide(!isHide)}
                size="small"
                basic
                compact
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {!isHide && (
        <>
          <RenderGuard actionKey={RightEnum.PERF_NOTE_VIEW}>
            <TablePerfEmpNote
              id={id}
              defaultFilter={{ timelines }}
              isEndYear={isEndYear}
            />
          </RenderGuard>
          <RenderGuard actionKey={RightEnum.PERF_REVISION_NOTE_VIEW}>
            <TablePerfEmpRevision
              id={id}
              timelineNoteType={
                isEndYear
                  ? TimelineNoteType.END_YEAR
                  : TimelineNoteType.MID_YEAR
              }
            />
          </RenderGuard>
          <RenderGuard actionKey={RightEnum.PERF_LIST_APPROVAL_VIEW}>
            <TablePerfEmpApprovalList id={id} isEndYear={isEndYear} />
          </RenderGuard>
        </>
      )}
    </Segment>
  );
};

export default PerfFormApprovalLog;
