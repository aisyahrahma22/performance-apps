import { FormikProps } from 'formik';
import { cloneDeep } from 'lodash';
import { PerfSuperior } from '../../performanceGoalSettingApproval/types/goalSettingApprovalTypes';
import { PerfEmpItemPerKPI, PerfEmployee } from '../types/goalSettingTypes';

interface ValidateTotalWeightCumulativeParams {
  formik: FormikProps<PerfEmployee> | FormikProps<PerfSuperior>;
  perfGoalSettingDetails: any;
}

export default function validateTotalWeightCumulative({
  formik,
  perfGoalSettingDetails,
}: ValidateTotalWeightCumulativeParams) {
  const BreakException = {};

  const clonedFormikItemPerKPI = cloneDeep(formik.values.itemsPerKPIs);

  try {
    if (!perfGoalSettingDetails) return false;

    perfGoalSettingDetails?.perfEmpItemType.forEach((perfEmpItemType: any) => {
      const isCategoryWeightCalc =
        perfEmpItemType?.perfFormType.isCategoryWeightCalc;

      if (isCategoryWeightCalc) {
        Object.values(clonedFormikItemPerKPI).forEach((itemsPerKPI) => {
          const selectedPerfItemPerKPI: PerfEmpItemPerKPI[] = [];
          itemsPerKPI.forEach((itemPerKPI) => {
            if (itemPerKPI.perfEmpItemType === perfEmpItemType.id)
              selectedPerfItemPerKPI.push(itemPerKPI);
          });

          const calcWeight = selectedPerfItemPerKPI.reduce(
            (prev, curr) => prev + curr.weight,
            0,
          );

          if (selectedPerfItemPerKPI.length > 0 && calcWeight !== 100)
            throw BreakException;
        });
      } else {
        const filteredPerfEmpItemPerKPI: PerfEmpItemPerKPI[] = [];

        Object.values(clonedFormikItemPerKPI).forEach((itemsPerKPI) => {
          const filteredItem = itemsPerKPI.filter(
            (item) => item?.perfEmpItemType === perfEmpItemType.id,
          );

          if (filteredItem.length > 0)
            filteredItem.forEach((item) =>
              filteredPerfEmpItemPerKPI.push(item),
            );
        });

        const calcWeight = filteredPerfEmpItemPerKPI.reduce(
          (prev, curr) => prev + curr.weight,
          0,
        );

        if (calcWeight !== 100) throw BreakException;
      }
    });

    return true;
  } catch (error) {
    if (error === BreakException) return false;
  }
}
