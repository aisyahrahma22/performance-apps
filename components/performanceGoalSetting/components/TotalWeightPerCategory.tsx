import React, { useMemo } from 'react';
import { FormikProps } from 'formik';

import { Input, Table } from 'semantic-ui-react';
import {
  PerfEmpItem,
  PerfEmpItemPerKPI,
  PerfEmployee,
  PerformanceKPIDataType,
  PerformanceKRADataType,
} from '../types/goalSettingTypes';
import { cloneDeep } from 'lodash';

interface TotalWeightPerCategoryProps {
  formik?: FormikProps<PerfEmployee>;
  perfEmpItemObj: PerfEmpItem;
  isKRA: boolean | undefined;
  isTarget: boolean | undefined;
  totalGoalSettingItem: number;
  isCategoryHasCategoryWeightCalc: boolean | undefined;
  onViewDetail: boolean;
}

export default function TotalWeightPerCategory({
  formik,
  perfEmpItemObj,
  isKRA,
  isTarget,
  totalGoalSettingItem,
  isCategoryHasCategoryWeightCalc,
  onViewDetail = true,
}: TotalWeightPerCategoryProps) {
  // get selected perf emp item from side effects
  const selectedPerfEmpItem = useMemo(() => {
    let returnedPerfItemPerKPI: PerfEmpItemPerKPI[] = [];

    if (formik) {
      const clonedFormikItemPerKPI = cloneDeep(formik.values.itemsPerKPIs);

      Object.keys(clonedFormikItemPerKPI).forEach((id) => {
        if (id === perfEmpItemObj.id)
          returnedPerfItemPerKPI = clonedFormikItemPerKPI[id];
      });
    } else {
      perfEmpItemObj.perfEmpItemPerKPI.forEach((perfEmpItemPerKPI) => {
        returnedPerfItemPerKPI.push({
          id: perfEmpItemPerKPI?.id,
          isPredefined: !!perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
            (dataKPIDetails) =>
              dataKPIDetails?.performanceKPI?.id ===
                (perfEmpItemPerKPI?.perfKPI as PerformanceKPIDataType)?.id &&
              dataKPIDetails?.performanceKRA?.id ===
                (perfEmpItemPerKPI?.perfKRA as PerformanceKRADataType)?.id,
          )?.isPredefine,
          kra: perfEmpItemPerKPI?.kra,
          kpi: perfEmpItemPerKPI?.kpi,
          target: perfEmpItemPerKPI?.target,
          weight: perfEmpItemPerKPI?.weight,
          achievement: perfEmpItemPerKPI?.achievement,
          perfEmpItemType: perfEmpItemObj?.perfEmpItemTypeId,
          perfEmpItem: perfEmpItemObj?.id,
          perfKRA:
            (perfEmpItemPerKPI?.perfKRA as PerformanceKRADataType)?.id || null,
          perfKPI:
            (perfEmpItemPerKPI?.perfKPI as PerformanceKPIDataType)?.id || null,
          scores: perfEmpItemPerKPI?.scores || [],
        });
      });
    }

    return returnedPerfItemPerKPI;
  }, [
    formik,
    perfEmpItemObj.id,
    perfEmpItemObj.perfEmpItemPerKPI,
    perfEmpItemObj?.perfEmpItemTypeId,
    perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails,
  ]);

  // count total weight
  const totalWeight = useMemo(() => {
    const calcWeight = selectedPerfEmpItem.reduce(
      (prev, curr) => prev + curr.weight,
      0,
    );

    return calcWeight;
  }, [selectedPerfEmpItem]);

  // count total cell for footer
  const countCell = useMemo(() => {
    let cell = 1;
    if (isKRA) cell += 1;
    if (isTarget) cell += 1;
    if (!onViewDetail) cell += 1;

    return cell;
  }, [isKRA, isTarget, onViewDetail]);

  return (
    <>
      {isCategoryHasCategoryWeightCalc && totalGoalSettingItem > 0 && (
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan={countCell} textAlign={'right'}>
              Total KPI Weight Input
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Input
                size="mini"
                icon={'percent'}
                fluid
                disabled
                value={totalWeight}
                error={totalWeight !== 100}
              />
            </Table.HeaderCell>
            {!onViewDetail && <Table.HeaderCell></Table.HeaderCell>}
          </Table.Row>
        </Table.Footer>
      )}
    </>
  );
}
