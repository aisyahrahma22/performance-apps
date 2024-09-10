import { FormikProps } from 'formik';
import React from 'react';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import Input from '../../Input';
import { notesByLevels } from '../helpers/notesByLevel';
import { PerfEmployee } from '../types/goalSettingTypes';
import { PerfLevelEnum } from '../../../lib/data//perfMidYear/enum/perfForm.enum';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import { PerfEmpProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';

interface NotesPerformanceProps {
  id: string;
  level?: PerfLevelEnum;
  formik:
    | FormikProps<PerfEmployee>
    | FormikProps<PerfEmpProps>;
  onViewDetail: boolean;
  timeline?: timelineEnum;
}

const styles = (level: any) => {
  return {
    apraisee: {
      height: '43px',
      borderRadius: '12px 12px 0px 0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: level == PerfLevelEnum.APPRAISEE ? '#a8bef7' : '#D9D9D9',
      marginBottom: '10px',
    },

    directManager: {
      height: '43px',
      borderRadius: '12px 12px 0px 0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: level == PerfLevelEnum.DIRECT_MANAGER ? '#a8bef7' : '#D9D9D9',
      marginBottom: '10px',
    },

    aboveDirectManager: {
      height: '43px',
      borderRadius: '12px 12px 0px 0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: level == PerfLevelEnum.ABOVE_MANAGER ? '#a8bef7' : '#D9D9D9',
      marginBottom: '10px',
    },
  };
};

const NotesPerformance = ({
  id,
  formik,
  level,
  onViewDetail,
  timeline,
}: NotesPerformanceProps) => {
  const _onChange = (value: any, note: any) => {
    if (value) {
      formik?.setFieldValue(
        `notes.[${note.types}].[${note?.level}].level`,
        level,
      );
      formik?.setFieldValue(
        `notes.[${note.types}].[${note?.level}].timeline`,
        timeline,
      );
    }
  };

  return (
    <>
      <Grid columns={'equal'}>
        <Grid.Row>
          <Grid.Column>
            <Segment
              className={
                level == PerfLevelEnum.APPRAISEE
                  ? '#a8bef7'
                  : 'soft-grey-bg'
              }
              style={{
                padding: '0px 0px 15px 0px',
              }}
            >
              <div style={styles(level).apraisee}>
                <Header
                  as={'h4'}
                  style={{
                    color:
                      level == PerfLevelEnum.APPRAISEE ? 'white' : 'black',
                  }}
                >
                  Employee
                </Header>
              </div>
              {notesByLevels.map((note) => (
                <>
                  {note.level == PerfLevelEnum.APPRAISEE ? (
                    <>
                      <Form
                        size={'large'}
                        key={`notes-${id}-${note.level}-${note.timeline}`}
                        style={{ width: '95%', padding: '0px 0px 5px 20px' }}
                      >
                        <Input
                          formik={formik}
                          name={`notes[${note?.types}].[${note?.level}].note`}
                          label={note.label}
                          placeholder={note.placeholder}
                          readOnly={
                            level != note.level ||
                            onViewDetail ||
                            timeline !== note.timeline
                          }
                          textarea
                          onChange={(value: any) => _onChange(value, note)}
                        />
                      </Form>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment
              className={
                level == PerfLevelEnum.DIRECT_MANAGER
                  ? '#a8bef7'
                  : 'soft-grey-bg'
              }
              style={{
                padding: '0px 0px 15px 0px',
              }}
            >
              <div style={styles(level).directManager}>
                <Header
                  as={'h4'}
                  style={{
                    color:
                      level == PerfLevelEnum.DIRECT_MANAGER
                        ? 'white'
                        : 'black',
                  }}
                >
                  Level 1
                </Header>
              </div>
              {notesByLevels.map((note) => (
                <>
                  {note.level == PerfLevelEnum.DIRECT_MANAGER ? (
                    <>
                      <Form
                        size={'large'}
                        key={`notes-${id}-${note.level}`}
                        style={{ width: '95%', padding: '0px 0px 5px 20px' }}
                      >
                        <Input
                          formik={formik}
                          name={`notes[${note.types}].[${note.level}].note`}
                          label={note.label}
                          placeholder={note.placeholder}
                          readOnly={
                            level != note.level ||
                            onViewDetail ||
                            timeline !== note.timeline
                          }
                          textarea
                          onChange={(value: any) => _onChange(value, note)}
                        />
                      </Form>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment
              className={
                level == PerfLevelEnum.ABOVE_MANAGER
                  ? '#a8bef7'
                  : 'soft-grey-bg'
              }
              style={{
                padding: '0px 0px 15px 0px',
              }}
            >
              <div style={styles(level).aboveDirectManager}>
                <Header
                  as={'h4'}
                  style={{
                    color:
                      level == PerfLevelEnum.ABOVE_MANAGER
                        ? 'white'
                        : 'black',
                  }}
                >
                 Level 2
                </Header>
              </div>
              {notesByLevels.map((note) => (
                <>
                  {note.level == PerfLevelEnum.ABOVE_MANAGER ? (
                    <>
                      <Form
                        size={'large'}
                        key={`notes-${id}-${note.level}`}
                        style={{ width: '95%', padding: '0px 0px 5px 20px' }}
                      >
                        <Input
                          formik={formik}
                          name={`notes[${note.types}].[${note.level}].note`}
                          label={note.label}
                          placeholder={note.placeholder}
                          readOnly={
                            level != note.level ||
                            onViewDetail ||
                            timeline !== note.timeline
                          }
                          textarea
                          onChange={(value: any) => _onChange(value, note)}
                        />
                      </Form>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default NotesPerformance;
