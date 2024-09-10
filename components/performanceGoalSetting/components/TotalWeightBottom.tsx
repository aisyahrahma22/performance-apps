import React, { useMemo } from 'react';
import { FormikProps } from 'formik';

import { Grid, Table } from 'semantic-ui-react';
import {
  PerfEmpItemPerKPI,
  PerfEmpItemType,
  PerfEmployee,
  PerformanceKPIDataType,
  PerformanceKRADataType,
} from '../types/goalSettingTypes';
import { cloneDeep } from 'lodash';

interface TotalWeightBottomProps {
  formik?: FormikProps<PerfEmployee>;
  activeIndex: string;
  perfEmpItemTypeObjArr: PerfEmpItemType[] | undefined;
}

export default function TotalWeightBottom({
  formik,
  activeIndex,
  perfEmpItemTypeObjArr,
}: TotalWeightBottomProps) {
  // get selected perf emp item type from side effects
  const selectedPerfEmpItemType = useMemo(
    () =>
      perfEmpItemTypeObjArr?.find(
        (perfEmpItemTypeObj) => perfEmpItemTypeObj.id === activeIndex,
      ),
    [activeIndex, perfEmpItemTypeObjArr],
  );

  // get isCategoryWeightCalc from perf emp item type
  const isDataPerfTypeHasCategoryWeightCalc = useMemo(() => {
    const isCategoryWeightCalc =
      selectedPerfEmpItemType?.perfFormType.isCategoryWeightCalc;

    return !!isCategoryWeightCalc;
  }, [selectedPerfEmpItemType]);

  // get perf emp items based on active tab/perf emp item type
  const currentActivePerfEmpItem = useMemo(() => {
    const filteredPerfEmpItemPerKPI: PerfEmpItemPerKPI[] = [];

    if (formik) {
      const clonedPerfEmpItemPerKPI = cloneDeep(formik.values.itemsPerKPIs);

      Object.values(clonedPerfEmpItemPerKPI).forEach((itemsPerKPI) => {
        const filteredItem = itemsPerKPI.filter(
          (item) => item?.perfEmpItemType === activeIndex,
        );

        if (filteredItem.length > 0)
          filteredItem.forEach((item) => filteredPerfEmpItemPerKPI.push(item));
      });
    } else {
      selectedPerfEmpItemType?.perfEmpItem?.forEach((perfEmpItem) => {
        perfEmpItem?.perfEmpItemPerKPI?.forEach((perfEmpItemPerKPI) => {
          filteredPerfEmpItemPerKPI.push({
            id: perfEmpItemPerKPI?.id,
            isPredefined: !!perfEmpItem?.perfFormTypeKPI?.dataKPIDetails?.find(
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
            perfEmpItemType: selectedPerfEmpItemType?.id,
            perfEmpItem: perfEmpItem?.id,
            perfKRA:
              (perfEmpItemPerKPI?.perfKRA as PerformanceKRADataType)?.id ||
              null,
            perfKPI:
              (perfEmpItemPerKPI?.perfKPI as PerformanceKPIDataType)?.id ||
              null,
            scores: perfEmpItemPerKPI?.scores || [],
          });
        });
      });
    }

    return filteredPerfEmpItemPerKPI;
  }, [
    activeIndex,
    formik,
    selectedPerfEmpItemType?.id,
    selectedPerfEmpItemType?.perfEmpItem,
  ]);

  // count total weight
  const totalWeight = useMemo(() => {
    const calcWeight = currentActivePerfEmpItem.reduce(
      (prev, curr) => prev + curr.weight,
      0,
    );

    return calcWeight;
  }, [currentActivePerfEmpItem]);

  return (
    <Grid
      className={
        !activeIndex || isDataPerfTypeHasCategoryWeightCalc
          ? 'display-none'
          : ''
      }
    >
      <Table color={'teal'} singleLine compact>
        <Table.Header>
          <Table.Row>
            <p className="nomargin" style={{ textAlign: 'end' }}>
              Total Weight
            </p>
            <h1 className="nomargin" style={{ textAlign: 'end' }}>
              {totalWeight}%
            </h1>
          </Table.Row>
        </Table.Header>
      </Table>
    </Grid>
  );
}
