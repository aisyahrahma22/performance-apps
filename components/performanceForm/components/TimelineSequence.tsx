import React, { useMemo, useState } from 'react';
import { FormikProps } from 'formik';

import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';

import DatePicker from '../../DatePicker';
import { timelinesData } from '../helpers/timelineData';
import TableHeaderCell from '../../TableHeaderCell';
import InputCheckbox2 from '../../InputCheckbox2';
import { PerfFromRequestDataFormProps, Sequences } from '../types/perfForm';
import { DataSequence } from '../../../lib/data/performanceForm/usePerformanceForm';
import renderEnum from '../../../lib/util/renderEnum';
import renderDate from '../../../lib/util/renderDate';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import dateLabeling from '../../../lib/util/dateLabeling';

interface ModalPerformanceProgramCreateProps {
  isModalView: boolean;
  formik?: FormikProps<PerfFromRequestDataFormProps>;
  sequencesResponse: DataSequence[] | undefined;
}

const TableTimelineSequence = ({
  isModalView,
  formik = undefined,
  sequencesResponse = undefined,
}: ModalPerformanceProgramCreateProps) => {
  const [isShow, setIsShow] = useState(true);
  const mappedSequenceResponse = useMemo(
    () =>
      sequencesResponse
        ? (sequencesResponse.map((sequence) => ({
            ...sequence,
            text: renderEnum(sequence.timeline),
          })) as Sequences[])
        : [],
    [sequencesResponse],
  );

  const timelineSequence = useMemo(
    () =>
      (mappedSequenceResponse.length > 0 && mappedSequenceResponse) ||
      timelinesData,
    [mappedSequenceResponse],
  );

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header color={'blue'} floated={'left'}>
              TIMELINE & SEQUENCE
            </Header>
            <Button
              size={'tiny'}
              floated="right"
              onClick={() => setIsShow(!isShow)}
              basic
              icon
            >
              <Icon name={isShow ? 'angle down' : 'angle up'} />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {isShow && (
        <Segment className={'nopaddingh '}>
          <Table className={'nomargin'} color={'black'} singleLine compact fixed>
            <Table.Header>
              <Table.Row>
                <TableHeaderCell
                  width={1}
                  attribute={'order'}
                  name={'No. '}
                  className={'margin'}
                  textAlign="center"
                />
                <TableHeaderCell
                  width={4}
                  attribute={'timeLine'}
                  name={'TimeLine'}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={3}
                  attribute={'startDate'}
                  name={'Start'}
                  className={'margin'}
                />
                <TableHeaderCell
                  width={3}
                  attribute={'endDate'}
                  name={'End'}
                  className={'margin'}
                />
                <Table.HeaderCell width={2} attribute={'option'} name={'..'} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {timelineSequence.map((sequence) => (
                <Table.Row key={`sequence-${sequence.order}`}>
                  <Table.Cell width={1} textAlign="center">
                    {sequence.order}
                  </Table.Cell>
                  <Table.Cell width={4}>{sequence.text}</Table.Cell>
                  <Table.Cell width={3}>
                    {isModalView &&
                    sequence?.timeline !==
                      timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED ? (
                      renderDate(sequence.startDate)
                    ) : (
                      <>
                        {formik &&
                        sequence?.timeline !==
                          timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED ? (
                          <Form>
                            <DatePicker
                              name={`sequences[${
                                sequence.order - 1
                              }].startDate`}
                              placeholder={'31-01-2022'}
                              label={''}
                              formik={formik}
                              dateOnly
                            />
                          </Form>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell width={3}>
                    {isModalView &&
                    sequence?.timeline !==
                      timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED ? (
                      <>{dateLabeling(sequence?.endDate)}</>
                    ) : (
                      <>
                        {formik &&
                        sequence?.timeline !==
                          timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED ? (
                          <Form>
                            <DatePicker
                              name={`sequences[${sequence.order - 1}].endDate`}
                              placeholder={'31-01-2022'}
                              label={''}
                              formik={formik}
                              dateOnly
                            />
                          </Form>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell
                    width={2}
                    className="nopaddingh"
                    textAlign={'center'}
                  >
                    {isModalView ? (
                      <Checkbox checked={sequence.isActive} fitted />
                    ) : (
                      <>
                        {formik ? (
                          <InputCheckbox2
                            name={`sequences[${sequence.order - 1}].isActive`}
                            formik={formik}
                            disabled={isModalView}
                          />
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      )}
    </div>
  );
};

export default TableTimelineSequence;
