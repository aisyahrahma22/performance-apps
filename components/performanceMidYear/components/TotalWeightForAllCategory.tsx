import get from 'lodash/get';
import React, { useMemo } from 'react';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  // PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { FormikProps } from 'formik';
import { Segment, Grid } from 'semantic-ui-react';
import { reduce } from 'lodash';

interface TotalWeightForAllCategoryProps {
  formik: FormikProps<PerfEmpProps>;
  perfEmpItemObjPath: string;
  perfEmpItemPerKPIName: string;
}

function TotalWeightForAllCategory({
  formik,
  perfEmpItemObjPath,
  perfEmpItemPerKPIName,
}: TotalWeightForAllCategoryProps) {
  const perfEmpItems = useMemo(() => {
    const empItems: PerfEmpItemProps[] =
      get(formik.values, perfEmpItemObjPath) || [];
    return empItems;
  }, [formik.values, perfEmpItemObjPath]);

  const itemPerKPI = useMemo(() => {
    const dataKPI: PerfEmpItemPerKPIProps[] = [];
    perfEmpItems.map((item) => {
      const kpiItems: PerfEmpItemPerKPIProps[] =
        get(formik.values, `${perfEmpItemPerKPIName}[${item?.id}]`) || [];
      dataKPI.push(...kpiItems);
    });
    return dataKPI;
  }, [formik, perfEmpItemPerKPIName, perfEmpItems]);
  // const totalWeightAllCategory = perfEmpItems.reduce((prev, perfEmpItem) => {
  //   return (prev += perfEmpItem.perfEmpItemPerKPIs.reduce(
  //     (prev, currItemPerKPI) =>
  //       (prev += (currItemPerKPI.isDeleted ? 0 : currItemPerKPI.weight) || 0),
  //     0,
  //   ));
  // }, 0);
  const totalWeightAllCategory = reduce(
    itemPerKPI,
    (prev, currItemPerKPI) =>
      (prev +=
        Number(currItemPerKPI?.isDeleted ? 0 : currItemPerKPI?.weight) || 0),
    0,
  );

  return (
    <Segment className={'notes-soft-purple-bg'}>
      <Grid>
        <Grid.Column style={{ textAlign: 'right' }}>
          <h3>
            <span className="purple-color">Total Weight:</span>{' '}
            <span className={totalWeightAllCategory !== 100 ? 'text-red' : ''}>
              {totalWeightAllCategory}%
            </span>
          </h3>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default TotalWeightForAllCategory;
