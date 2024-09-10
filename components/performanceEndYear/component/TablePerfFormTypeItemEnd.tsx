import { FormikProps } from 'formik';
import { cloneDeep, filter, get, reduce } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Input, Segment, Table, TableHeaderCell } from 'semantic-ui-react';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { perfFormFillRule } from '../../../lib/data/perfMidYear/helpers/perfFormFill';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import {
  PerfFormTypeItemProps,
  PerfFormTypeProps,
} from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import TablePerfFormTypeItemRowEnd from './TablePerfFormTypeItemRowEnd';

interface TablePerfFormTypeItemEndProps {
  formType: PerfFormTypeProps;
  formTypeItem: PerfFormTypeItemProps;
  formik: FormikProps<PerfEmpProps>;
  editable?: boolean;
  name: string;
  perfEmpItemIndex: number;
  perfEmpItem?: PerfEmpItemProps;
  level: PerfLevelEnum;
  measurementOptions: DropdownOptions[];
  expand: any;
  isView: any;
  onChangeScore: (
    levels: PerfLevelEnum[],
    perfEmpItems: PerfEmpItemProps[],
    perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
  ) => void;
  perfEmpItems: PerfEmpItemProps[];
  countEmpItemKPIs: any;
  itemPerKPI: PerfEmpItemPerKPIProps[];
  perfEmpItemPerKPIName: string;
  allKPI: any;
}

const TablePerfFormTypeItemEnd = ({
  formTypeItem,
  formik,
  editable,
  name,
  perfEmpItemIndex,
  perfEmpItem,
  formType,
  level,
  measurementOptions,
  expand,
  onChangeScore,
  perfEmpItems,
  isView,
  countEmpItemKPIs,
  itemPerKPI,
  perfEmpItemPerKPIName,
  allKPI,
}: TablePerfFormTypeItemEndProps) => {
  const ruleFormFill = useMemo(() => {
    return perfFormFillRule({ formType, formTypeItem });
  }, [formType, formTypeItem]);

  const onRemoveItemKPI = useCallback(
    (itemKPIId) => () => {
      if (perfEmpItem) {
        const currDeletedItemKPI = get(formik.values, 'deletedPerfEmpItemKPIs');
        const perfEmpItemPerKPI = cloneDeep(allKPI);
        // const currDeletedItems =
        //   filter(
        //     perfEmpItem?.perfEmpItemPerKPIs,
        //     (itemKPI) => itemKPI?.id === itemKPIId,
        //   ) || [];
        const itemPerKPI = perfEmpItemPerKPI[perfEmpItem?.id];

        const currDeletedItems =
          filter(itemPerKPI, (itemKPI) => itemKPI?.id === itemKPIId) || [];

        currDeletedItems.map((item) => {
          item.isDeleted = true;
        });
        const currItems = itemPerKPI;
        formik.setFieldValue(
          `${perfEmpItemPerKPIName}[${perfEmpItem?.id}]`,
          currItems,
        );
        // formik.setFieldValue(
        //   `${name}[${perfEmpItemIndex}].perfEmpItemPerKPIs`,
        //   currItems,
        // );
        formik.setFieldValue('deletedPerfEmpItemKPIs', [
          ...currDeletedItemKPI,
          itemKPIId,
        ]);

        const currPerfEmpItems = cloneDeep(perfEmpItems);
        // set(
        //   currPerfEmpItems[perfEmpItemIndex],
        //   'perfEmpItemPerKPIs',
        //   currItems,
        // );
        onChangeScore(
          Object.values(PerfLevelEnum),
          currPerfEmpItems,
          perfEmpItemPerKPI,
        );
      }
    },
    [formik, name, perfEmpItem, perfEmpItemIndex, onChangeScore, perfEmpItems],
  );

  const countCell = useMemo(() => {
    let count = 4;
    if (formType?.isKRA) count++;
    if (formType?.isTarget) count++;

    return count;
  }, [formType]);

  const totalWeight = useMemo(() => {
    if (!perfEmpItem) return 0;

    const total = reduce(
      itemPerKPI,
      (sum, item) => sum + (Number(item?.isDeleted ? 0 : item?.weight) || 0),
      0,
    );
    return total;
  }, [perfEmpItem, formik]);

  return (
    <Segment className={'nopadding'}>
      <Table basic className={'nomargin sticky arc'}>
        <Table.Header style={{ top: '-23px' }}>
          <Table.Row>
            {formType?.isKRA && (
              <TableHeaderCell width={4}>
                Key Responsibility Area (KRA)
              </TableHeaderCell>
            )}
            <TableHeaderCell width={4}>
              Key Performance Indicator (KPI)
            </TableHeaderCell>
            {formType?.isTarget && (
              <TableHeaderCell width={3}>Target</TableHeaderCell>
            )}
            <TableHeaderCell width={3}>Result & Achievement</TableHeaderCell>
            <TableHeaderCell width={2}>Weight</TableHeaderCell>
            <TableHeaderCell width={2}></TableHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {itemPerKPI?.map((itemKPI, index) =>
            !itemKPI?.isDeleted ? (
              <TablePerfFormTypeItemRowEnd
                expand={expand}
                key={`row-kpi-${itemKPI?.id}`}
                index={index}
                formik={formik}
                name={`${perfEmpItemPerKPIName}[${perfEmpItem?.id}][${index}]`}
                perfEmpItemKPI={itemKPI}
                editable={editable}
                formType={formType}
                onRemoveItemKPI={onRemoveItemKPI}
                countCell={countCell}
                level={level}
                measurementOptions={measurementOptions}
                totalWeight={totalWeight}
                ruleFormFillKRA={ruleFormFill?.kra}
                ruleFormFillKPI={ruleFormFill?.kpi}
                ruleFormFillTarget={ruleFormFill?.target}
                formTypeItem={formTypeItem}
                onChangeScore={onChangeScore}
                indexEmpItem={perfEmpItemIndex}
                perfEmpItems={perfEmpItems}
                isView={isView}
                countEmpItemKPIs={countEmpItemKPIs}
                itemPerKPI={itemPerKPI}
                allKPI={allKPI}
              />
            ) : (
              ''
            ),
          )}
        </Table.Body>
        <Table.Footer>
          {!formType.isCategory ||
          (formType?.isCategory && formType?.isCategoryWeightCalc) ? (
            <Table.Row>
              <Table.Cell colSpan={countCell - 2} textAlign={'right'}>
                Total KPI Weight Input
              </Table.Cell>
              <Table.Cell>
                <Input
                  disabled
                  value={totalWeight}
                  icon={'percent'}
                  style={{ width: '100%' }}
                  error={totalWeight !== 100 && editable}
                />
                {totalWeight !== 100 && editable && (
                  <p className="kpi-error">Total KPI Weight should be 100%!</p>
                )}
              </Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          ) : (
            ''
          )}
        </Table.Footer>
      </Table>
    </Segment>
  );
};

export default TablePerfFormTypeItemEnd;
