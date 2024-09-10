import { FormikProps } from 'formik';
import React, { useState } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import {
  PerfEmployee,
  PerfGoalSettingRevisionNote,
} from '../types/goalSettingTypes';
import NotesPerformance from './NotesPerformance';
import Input from '../../Input';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import { PerfEmpProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import TablePerfEmpRevision from '../../performanceMidYear/components/TablePerfEmpRevisions';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';

interface NotesAndRevisionNotesProps {
  id: string;
  level: PerfLevelEnum;
  formik:
    | FormikProps<PerfEmployee>
    | FormikProps<PerfEmpProps>;
  onViewDetail: boolean;
  data?: PerfGoalSettingRevisionNote | any;
  timeline?: timelineEnum;
  timelineNoteType: TimelineNoteType;
}

const NotesAndRevisionNotes = ({
  id,
  formik,
  level,
  onViewDetail,
  data,
  timeline,
  timelineNoteType,
}: NotesAndRevisionNotesProps) => {
  const [isHide, setIsHide] = useState(false);
  const [isHideRev, setIsHideRev] = useState(true);

  return (
    <>
      <Grid>
          <Grid.Row verticalAlign={'middle'}>
            <Grid.Column width={'14'}>
              <Header as={'h4'} color={'blue'}>
                NOTES
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
            <NotesPerformance
              id={id}
              formik={formik}
              level={level}
              onViewDetail={onViewDetail}
              timeline={timeline}
            />
          </>
        )}
    </>
  );
};

export default NotesAndRevisionNotes;
