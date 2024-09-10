import { Button, Icon, Popup, Table } from 'semantic-ui-react';
import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import { filter, find, forEach, get, map } from 'lodash';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import Input from '../Input';
import { PerfMeasurementSec } from '../../lib/data/performanceMeasurementForm/perfMeasurementSectionForm';
import renderHyphen from '../../lib/util/renderHyphen';

interface TablePerfMeasurementProps {
  formik?: FormikProps<any>;
  name?: string;
  isLoading?: boolean;
  dataConfigs?: PerfMeasurementSec[];
  editable?: boolean;
}

const TablePerformanceMeasurementEdit = ({
  dataConfigs = [],
  editable = false,
  isLoading = false,
  name = 'dataGrade',
  formik,
}: TablePerfMeasurementProps) => {
  const _onChange = useCallback(
    (val, configId, key) => {
      const configs = get(formik?.values, name);
      const configVals: {
        [index: number | string]: string;
      } = {};
      const configLabels: {
        [index: string]: string;
      } = {};

      forEach(configs, (cf) => {
        const { id, gradeCode, gradeName } = cf;
        if (gradeCode && !configVals[gradeCode] && id !== configId) {
          configVals[gradeCode] = id;
        }
        if (gradeName && !configLabels[gradeName] && id !== configId) {
          configLabels[gradeName] = id;
        }
      });
      if (key === 'gradeCode' && !configVals[val] && val) {
        configVals[val] = configId;
      } else if (key === 'gradeName' && !configLabels[val] && val) {
        configLabels[val] = configId;
      }

      const values = map(configs, (cf) => {
        const { id, gradeCode: _gradeCode, gradeName: _gradeName } = cf;
        let isValueDuplicated = false;
        let isLabelDuplicated = false;
        const gradeCode =
          configId === id && key === 'gradeCode' ? val : _gradeCode;

        const gradeName =
          configId === id && key === 'gradeName' ? val : _gradeName;

        if (
          gradeCode &&
          configVals[gradeCode] &&
          configVals[gradeCode] !== id
        ) {
          isValueDuplicated = true;
        }
        if (
          gradeName &&
          configLabels[gradeName] &&
          configLabels[gradeName] !== id
        ) {
          isLabelDuplicated = true;
        }
        return {
          ...cf,
          [key]: id === configId ? val : cf[key],
          isValueDuplicated,
          isLabelDuplicated,
        };
      });
      formik?.setFieldValue(name, values);
    },
    [name, formik?.values, formik?.setFieldValue],
  );

  const _onKeyDown = useCallback(
    (e) => {
      if (['Enter'].includes(e?.key) && editable) {
        const configs = get(formik?.values, name) || [];
        const findEmptyConfig = find(
          configs,
          (cf) => !cf?.gradeCode && !cf?.gradeName,
        );
        if (!findEmptyConfig) {
          const tempConfig: PerfMeasurementSec = {
            id: `new-perf-mess-grade-edit-${new Date().getTime()}-${
              configs?.length || 0
            }`,
            gradeCode: '',
            gradeName: '',
            point: '',
          };
          formik?.setFieldValue(name, [...configs, tempConfig]);
        }
        e?.preventDefault();
      }
    },
    [formik?.setFieldValue, formik?.values, editable, name],
  );

  const _onRemove = useCallback(
    (id) => () => {
      const configs = get(formik?.values, name) || [];
      if (configs?.length > 1) {
        const newConfigs = filter(configs, (cf) => cf?.id !== id);
        formik?.setFieldValue(name, newConfigs);
      }
    },
    [formik?.setFieldValue, formik?.values, name],
  );

  return (
    <section>
      GRADE
      <Table
        selectable={!isLoading}
        className={'nomargin'}
        color={'black'}
        singleLine
        compact
        fixed
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
            dataConfigs?.map((config, index: number) => (
              <Table.Row key={config?.id} style={{ position: 'relative' }}>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].gradeCode`}
                      formik={formik}
                      placeholder={`${index + 1}`}
                      // isNumber
                      style={{ width: '90%' }}
                      hideError
                      onChange={(val: any) =>
                        _onChange(val, config?.id, 'gradeCode')
                      }
                      action={
                        config?.isValueDuplicated ||
                        (config?.gradeCode && config?.gradeName === '') ? (
                          <Popup
                            content={
                              config?.isValueDuplicated
                                ? 'Grade Code is exist'
                                : 'Grade Code is required'
                            }
                            trigger={iconWarning()}
                          />
                        ) : undefined
                      }
                      className="gradeCode"
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.gradeCode)
                  )}
                </Table.Cell>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].gradeName`}
                      formik={formik}
                      placeholder={'Grade Name'}
                      style={{ width: '90%' }}
                      hideError
                      onChange={(val: any) =>
                        _onChange(val, config?.id, 'gradeName')
                      }
                      action={
                        config?.isLabelDuplicated ||
                        (!config?.gradeCode && config?.gradeName !== '') ? (
                          <Popup
                            content={
                              config?.isLabelDuplicated
                                ? 'Grade Name is exist'
                                : 'Grade Name is required'
                            }
                            trigger={iconWarning()}
                          />
                        ) : undefined
                      }
                      className="gradeName"
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.gradeName)
                  )}
                </Table.Cell>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].point`}
                      formik={formik}
                      placeholder={`${(index + 1) * 10}`}
                      style={{ width: '90%' }}
                      hideError
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.point)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editable && formik ? (
                    <Button
                      icon="trash"
                      basic
                      compact
                      size="small"
                      onClick={_onRemove(config?.id)}
                    />
                  ) : (
                    <></>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </section>
  );
};

const iconWarning = () => {
  return (
    <div style={{ position: 'absolute', right: '10px', bottom: '10px' }}>
      <Icon name="warning sign" color="red" />
    </div>
  );
};

export default TablePerformanceMeasurementEdit;
