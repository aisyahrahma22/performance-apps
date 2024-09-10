import React, { useCallback, useState } from 'react';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { FormikProps } from 'formik';
import { Grid, Popup, Segment, Transition } from 'semantic-ui-react';
import Input from '../../Input';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { keyEmpMidItemPerKPIByLevels } from '../../../lib/data/perfMidYear/helpers/perfLevels';
import { PerfFormTypeProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';

interface CommentKPIProps {
  formik: FormikProps<PerfEmpProps>;
  editable?: boolean;
  name: string;
  level: PerfLevelEnum;
  expand: any;
  perfEmpItemKPI: PerfEmpItemPerKPIProps;
  formType: PerfFormTypeProps;
}

function CommentKPI({
  formik,
  editable,
  name,
  level,
  expand,
  perfEmpItemKPI,
  formType,
}: CommentKPIProps) {
  const [isHide, setIsHide] = useState(true);
  const onChangeComment = useCallback(
    (value) => {
      if (value) {
        formik.setFieldValue(`${name}.scores.midBySelf.isMidYear`, true);
        if (level.includes('DIRECT_MANAGER')) {
          formik.setFieldValue(`${name}.scores.midByDM.type`, level);
          formik.setFieldValue(`${name}.scores.midByDM.isMidYear`, true);
        }
        if (level.includes('ABOVE_MANAGER')) {
          formik.setFieldValue(`${name}.scores.midByAboveDM.type`, level);
          formik.setFieldValue(`${name}.scores.midByAboveDM.isMidYear`, true);
        }
      }
    },
    [formik, level, name],
  );

  const isAbsoluteScore = (scoreObj?: any): boolean => {
    return scoreObj?.isAbsoluteScore;
  };
  return (
    <>
      <Segment
        attached={isHide ? undefined : 'top'}
        compact
        onClick={() => setIsHide(!isHide)}
        style={{
          cursor: 'pointer',
        }}
      >
        <Grid>
          <Grid.Row verticalAlign={'middle'}>
            <Grid.Column
              width={1}
              verticalAlign={'middle'}
              className="nopaddingh"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              ></div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Transition visible={!isHide} animation="slide down" duration={500}>
        <Segment
          clearing
          basic
          style={{
            backgroundColor: 'white',
          }}
          attached={'bottom'}
        >
          <Grid columns={'equal'} divided>
            <Grid.Row className={`${formType?.isMidYearScore ? 'pt-0' : ''}`}>
              {keyEmpMidItemPerKPIByLevels?.map((keyLevel) => (
                <Grid.Column
                  key={`third-row-kpi-${perfEmpItemKPI?.id}-comment-${keyLevel?.level}`}
                >
                  {isAbsoluteScore(perfEmpItemKPI.scores?.[keyLevel.key]) ? (
                    <Popup
                      content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                      trigger={
                        <span>
                          <Input
                            formik={formik}
                            name={`${name}.[${keyLevel?.keyComment}]`}
                            placeholder={'Comment'}
                            label={keyLevel?.labelComment}
                            disabled={
                              editable === undefined ||
                              (editable === true && level != keyLevel?.level)
                                ? false
                                : !(
                                    editable &&
                                    level === keyLevel?.level &&
                                    !perfEmpItemKPI.scores?.[keyLevel.key]
                                      ?.isAbsoluteScore
                                  )
                            }
                            readOnly={!editable || level != keyLevel?.level}
                            className={`bg-disable-input`}
                            textarea
                            isPreventEnter
                            isTextAreaAutoHigh={expand}
                            onChange={onChangeComment}
                            isExclamation
                          />
                        </span>
                      }
                    />
                  ) : (
                    <Input
                      formik={formik}
                      name={`${name}.[${keyLevel?.keyComment}]`}
                      placeholder={'Comment'}
                      label={keyLevel?.labelComment}
                      disabled={
                        editable === undefined ||
                        (editable === true && level != keyLevel?.level)
                          ? false
                          : !(
                              editable &&
                              level === keyLevel?.level &&
                              !perfEmpItemKPI.scores?.[keyLevel.key]
                                ?.isAbsoluteScore
                            )
                      }
                      readOnly={!editable || level != keyLevel?.level}
                      className={`bg-disable-input`}
                      textarea
                      isPreventEnter
                      isTextAreaAutoHigh={expand}
                      onChange={onChangeComment}
                    />
                  )}
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </Segment>
      </Transition>
    </>
  );
}

export default CommentKPI;
