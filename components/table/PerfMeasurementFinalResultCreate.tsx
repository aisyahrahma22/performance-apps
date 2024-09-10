import { FormikProps } from 'formik';
import { cloneDeep, get } from 'lodash';
import React, { useCallback } from 'react';
import { Button, Grid, Header, Segment, Table } from 'semantic-ui-react';
import { PerfMeasurementFinalSec } from '../../lib/data/perfMeasurementFinalResult/perfMeasurementSectionFinal';
import Input from '../Input';
import TablePlaceholder from '../placeholder/TablePlaceholder';

interface TablePerfMeasurementProps {
  formik: FormikProps<any>;
  name?: string;
  isLoading?: boolean;
  data?: PerfMeasurementFinalSec[];
}

const TablePerfMeasurementFinalResultCreate = ({
  formik,
  name,
  data,
  isLoading,
}: TablePerfMeasurementProps) => {
  const _onAddGrade = useCallback(() => {
    const currGrades = get(formik.values, `${name}`) || [];
    const grade: PerfMeasurementFinalSec = {
      codeGrade: '',
      codeName: '',
      minimum: 0,
      maximum: currGrades[currGrades?.length - 1]?.minimum,
    };

    const newGrades = [...currGrades, grade];
    formik.setFieldValue(`${name}`, newGrades);
  }, [formik, name]);

  const _onRemoveGrade = useCallback(
    (idx) => () => {
      const currGrades = get(formik.values, `${name}`) || [];
      const clone = cloneDeep(currGrades);
      clone.splice(idx, 1);
      formik.setFieldValue(`${name}`, clone);

      if (idx == currGrades.length - 1) {
        const prevData = clone[idx - 1];
        const nextData = clone[idx - 2];
        const grade: PerfMeasurementFinalSec = {
          ...prevData,
          minimum: 0,
          maximum:
            nextData?.minimum == undefined
              ? prevData?.maximum
              : nextData?.minimum,
        };

        formik.setFieldValue(`dataGradeFinal[${idx - 1}]`, grade);
      } else if (idx == 0) {
        // nothing
      } else {
        const prevData = clone[idx - 1];
        const data = clone[idx];
        const grade: PerfMeasurementFinalSec = {
          ...data,
          minimum: data?.minimum,
          maximum: prevData?.minimum,
        };

        formik.setFieldValue(`dataGradeFinal[${idx}]`, grade);
      }
    },
    [formik, name],
  );

  const updateMaximum = useCallback(
    (data: any, index: number) => {
      const currGrades = get(formik.values, `${name}`) || [];
      const clone = cloneDeep(currGrades);
      const nextData = clone[index + 1];
      const grade: PerfMeasurementFinalSec = {
        ...nextData,
        maximum: data,
      };

      formik.setFieldValue(`dataGradeFinal[${index + 1}]`, grade);
    },
    [formik, name],
  );
  const headerTable = [
    { name: 'No.', width: 2 },
    { name: 'Code', width: 3 },
    { name: 'Name', width: 4 },
    { name: 'Min', width: 3 },
    { name: 'Max', width: 3 },
    { name: '', width: 1 },
  ];

  return (
    <div style={{ marginTop: '15px' }}>
      <Segment className={'nopadding hcms-table'} raised>
        <Segment basic className={'nomargin'}>
          <Grid columns="equal">
            {headerTable?.map((header: any) => {
              return (
                <>
                  <Grid.Column width={header?.width}>
                    <Header>{header?.name}</Header>
                  </Grid.Column>
                </>
              );
            })}
          </Grid>
        </Segment>
        <Table className={'nomargin'} color={'black'} singleLine compact>
          <Table.Body>
            {isLoading && <TablePlaceholder rowCount={5} colCount={4} />}
            {!isLoading &&
              data?.map((_ques, index) => {
                return (
                  <>
                    <Table.Row style={{ position: 'relative' }} key={index}>
                      <Table.Cell className="nopaddingh" width={2}>
                        <Segment basic style={{ width: '90%' }}>
                          {index + 1}
                        </Segment>
                      </Table.Cell>
                      <Table.Cell className="nopaddingh" width={3}>
                        <Input
                          name={`${name}[${index}].codeGrade`}
                          formik={formik}
                          placeholder={`${index + 1} Code`}
                          style={{ width: '90%' }}
                          className="codeGrade"
                        />
                      </Table.Cell>
                      <Table.Cell className="nopaddingh" width={4}>
                        <Input
                          name={`${name}[${index}].codeName`}
                          formik={formik}
                          placeholder={'Grade Name'}
                          style={{ width: '90%' }}
                          className="codeName"
                        />
                      </Table.Cell>
                      <Table.Cell className="nopaddingh" width={3}>
                        <Input
                          name={`${name}[${index}].minimum`}
                          formik={formik}
                          placeholder={`0`}
                          style={{ width: '90%' }}
                          type={'number'}
                          action={{ content: '≤' }}
                          onChange={(data) => {
                            updateMaximum(data, index);
                          }}
                          disabled={index == data.length - 1}
                        />
                      </Table.Cell>
                      <Table.Cell className="nopaddingh" width={3}>
                        <Input
                          name={`${name}[${index}].maximum`}
                          formik={formik}
                          placeholder={`0`}
                          style={{ width: '90%' }}
                          type={'number'}
                          action={{
                            content: `${index == 0 ? '≤' : '<'}`,
                          }}
                          actionPosition="left"
                          disabled={index != 0}
                        />
                      </Table.Cell>
                      <Table.Cell width={3}>
                        <Button
                          icon="trash"
                          basic
                          compact
                          size="small"
                          onClick={_onRemoveGrade(index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </>
                );
              })}
          </Table.Body>
        </Table>
        <Segment raised basic>
          <Button color={'blue'} circular onClick={_onAddGrade}>
            Create Data Grade
          </Button>
        </Segment>
      </Segment>
    </div>
  );
};

export default TablePerfMeasurementFinalResultCreate;
