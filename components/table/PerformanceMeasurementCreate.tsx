import { FormikProps } from 'formik';
import { filter, get } from 'lodash';
import React, { useCallback } from 'react';
import { Button, Segment, Table } from 'semantic-ui-react';
import { PerfMeasurementSec } from '../../lib/data/performanceMeasurementForm/perfMeasurementSectionForm';
import Input from '../Input';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import TableHeaderCell from '../TableHeaderCell';

interface TablePerfMeasurementProps {
  formik: FormikProps<any>;
  name?: string;
  isLoading?: boolean;
  data?: PerfMeasurementSec[];
}

const TablePerformanceMeasurementCreate = ({
  formik,
  name,
  data,
  isLoading,
}: TablePerfMeasurementProps) => {
  const _onAddGrade = useCallback(() => {
    const currGrades = get(formik.values, `${name}`) || [];
    const grade: PerfMeasurementSec = {
      id: `new-perf-mess-grade-${new Date().getTime()}-${
        currGrades?.length + 1
      }`,
      gradeCode: '',
      gradeName: '',
      point: '',
    };
    const newGrades = [...currGrades, grade];
    formik.setFieldValue(`${name}`, newGrades);
  }, [formik.values, formik.setFieldValue, name]);

  const _onRemoveGrade = useCallback(
    (id) => () => {
      const currGrades = get(formik.values, `${name}`) || [];
      const newGrades = filter(currGrades, (q) => q?.id !== id);
      formik.setFieldValue(`${name}`, newGrades);
    },
    [formik.values, formik.setFieldValue, name],
  );

  return (
    <Segment>
      <section>
        GRADE
        <Table
          className={'nomargin'}
          color={'black'}
          singleLine
          compact
          // fixed
        >
          <Table.Header>
            <Table.Row>
              <TableHeaderCell
                width={4}
                attribute={'gradeCode'}
                name={'Code'}
              />
              <TableHeaderCell
                width={5}
                attribute={'gradeName'}
                name={'Name'}
              />
              <TableHeaderCell width={4} attribute={'point'} name={'Score'} />
              <Table.HeaderCell width={1} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && <TablePlaceholder rowCount={5} colCount={4} />}
            {!isLoading &&
              data?.map((ques, index) => (
                <>
                  <Table.Row style={{ position: 'relative' }}>
                    <Table.Cell className="nopaddingh">
                      <Input
                        name={`${name}[${index}].gradeCode`}
                        formik={formik}
                        placeholder={`${index + 1} Code`}
                        style={{ width: '90%' }}
                        className="gradeCode"
                      />
                    </Table.Cell>
                    <Table.Cell className="nopaddingh">
                      <Input
                        name={`${name}[${index}].gradeName`}
                        formik={formik}
                        placeholder={'Grade Name'}
                        style={{ width: '90%' }}
                        className="gradeName"
                      />
                    </Table.Cell>
                    <Table.Cell className="nopaddingh">
                      <Input
                        name={`${name}[${index}].point`}
                        formik={formik}
                        placeholder={`${(index + 1) * 1}`}
                        style={{ width: '90%' }}
                        type={'number'}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon="trash"
                        basic
                        compact
                        size="small"
                        onClick={_onRemoveGrade(ques?.id)}
                        // disabled={index == 0}
                      />
                    </Table.Cell>
                  </Table.Row>
                </>
              ))}
          </Table.Body>
        </Table>
        <Button
          fluid
          color={'blue'}
          circular
          onClick={_onAddGrade}
          style={{ marginTop: '20px' }}
        >
          Add Grade
        </Button>
      </section>
    </Segment>
  );
};

export default TablePerformanceMeasurementCreate;
