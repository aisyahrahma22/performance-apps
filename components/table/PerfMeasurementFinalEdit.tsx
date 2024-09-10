import { Button, Icon, Popup, Table } from 'semantic-ui-react';
import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import TableHeaderCell from '../TableHeaderCell';
import { filter, find, forEach, get, map } from 'lodash';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import Input from '../Input';
import renderHyphen from '../../lib/util/renderHyphen';
import { PerfMeasurementFinalEdit } from '../../lib/data/perfMeasurementFinalResult/perfMeasurementSectionFinal';

interface TablePerfMeasurementProps {
  formik?: FormikProps<any>;
  name?: string;
  isLoading?: boolean;
  dataConfigs?: PerfMeasurementFinalEdit[];
  editable?: boolean;
}

const TablePerformanceMeasurementFinalEdit = ({
  dataConfigs = [],
  editable = false,
  isLoading = false,
  name = 'dataGradeFinal',
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
        const { id, codeGrade, codeName } = cf;
        if (codeGrade && !configVals[codeName] && id !== configId) {
          configVals[codeGrade] = id;
        }
        if (codeName && !configLabels[codeName] && id !== configId) {
          configLabels[codeName] = id;
        }
      });
      if (key === 'codeGrade' && !configVals[val] && val) {
        configVals[val] = configId;
      } else if (key === 'codeName' && !configLabels[val] && val) {
        configLabels[val] = configId;
      }

      const values = map(configs, (cf) => {
        const { id, codeGrade: _codeGrade, codeName: _codeName } = cf;
        let isValueDuplicated = false;
        let isLabelDuplicated = false;
        const codeGrade =
          configId === id && key === 'codeGrade' ? val : _codeGrade;

        const codeName =
          configId === id && key === 'codeName' ? val : _codeName;

        if (
          codeGrade &&
          configVals[codeGrade] &&
          configVals[codeGrade] !== id
        ) {
          isValueDuplicated = true;
        }
        if (
          codeName &&
          configLabels[codeName] &&
          configLabels[codeName] !== id
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
          (cf) => !cf?.codeGrade && !cf?.codeName,
        );
        if (!findEmptyConfig) {
          const tempConfig: PerfMeasurementFinalEdit = {
            id: `new-perf-mess-final-grade-edit-${new Date().getTime()}-${
              configs?.length || 0
            }`,
            codeGrade: '',
            codeName: '',
            maximum: '',
            minimum: '',
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
      <Table
        selectable={!isLoading}
        className={'nomargin'}
        color={'teal'}
        singleLine
        compact
        fixed
      >
        <Table.Header>
          <Table.Row>
            <TableHeaderCell
              width={4}
              attribute={'codeGrade'}
              name={'Grade Code'}
            />
            <TableHeaderCell
              width={5}
              attribute={'codeName'}
              name={'Grade Name'}
            />
            <TableHeaderCell width={4} attribute={'minimum'} name={'Minimum'} />
            <TableHeaderCell width={4} attribute={'maximum'} name={'maximum'} />
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
                      name={`${name}[${index}].codeGrade`}
                      formik={formik}
                      placeholder={`${index + 1}`}
                      // isNumber
                      style={{ width: '90%' }}
                      hideError
                      onChange={(val: any) =>
                        _onChange(val, config?.id, 'codeGrade')
                      }
                      action={
                        config?.isValueDuplicated ||
                        (config?.codeGrade && config?.codeName === '') ? (
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
                      className="codeGrade"
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.codeGrade)
                  )}
                </Table.Cell>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].codeName`}
                      formik={formik}
                      placeholder={'Grade Name'}
                      style={{ width: '90%' }}
                      hideError
                      onChange={(val: any) =>
                        _onChange(val, config?.id, 'codeName')
                      }
                      action={
                        config?.isLabelDuplicated ||
                        (!config?.codeGrade && config?.codeName !== '') ? (
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
                      className="codeName"
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.codeName)
                  )}
                </Table.Cell>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].minimum`}
                      formik={formik}
                      placeholder={`${(index + 1) * 10}`}
                      style={{ width: '90%' }}
                      hideError
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.minimum)
                  )}
                </Table.Cell>
                <Table.Cell className="nopaddingh">
                  {editable && formik ? (
                    <Input
                      name={`${name}[${index}].maximum`}
                      formik={formik}
                      placeholder={`${(index + 1) * 10}`}
                      style={{ width: '90%' }}
                      hideError
                      onKeyDown={_onKeyDown}
                    />
                  ) : (
                    renderHyphen(config?.maximum)
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

export default TablePerformanceMeasurementFinalEdit;
