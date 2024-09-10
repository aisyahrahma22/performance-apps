import { mapValues } from 'lodash';
import * as yup from 'yup';
import { PerfEmployeeStatusEnum } from '../../../lib/enums/GoalSetting';

enum KPICount {
  KPI_COUNT_MAX = 'KPI_COUNT_MAX',
  KPI_COUNT_MIN = 'KPI_COUNT_MIN',
}

const formValidateWeight = (foundPerfEmpItem: any) => {
  return (value: any, testContext: any) => {
    const { perfEmpItem: perfEmpItemId } = testContext.from[0].value;

    const selectedPerfEmpItem = foundPerfEmpItem.find(
      (perfEmpItem: any) => perfEmpItem.id === perfEmpItemId,
    );

    if (!selectedPerfEmpItem || !perfEmpItemId) return false;

    const selectedPerfFormTypeKPI = selectedPerfEmpItem.perfFormTypeKPI;

    if (!selectedPerfFormTypeKPI) return false;

    const { maxKPIWeightInput, minKPIWeightInput, typeMaxKPIWeight } =
      selectedPerfFormTypeKPI;

    if (typeMaxKPIWeight !== 'LIMITED')
      return value > 0 && value <= 100
        ? true
        : testContext.createError({
            message: `Weight must between 1% to 100%`,
            path: testContext.path,
          });
    else
      return value >= minKPIWeightInput && value <= maxKPIWeightInput
        ? true
        : testContext.createError({
            message: `Weight must between ${minKPIWeightInput}% to ${maxKPIWeightInput}%.`,
            path: testContext.path,
          });
  };
};

const formValidateCount = (foundPerfEmpItem: any, kpi: KPICount, val: any) => {
  const selectedPerfEmpItem = foundPerfEmpItem?.find(
    (perfEmpItem: any) => perfEmpItem?.id === val[0]?.perfEmpItem,
  );

  if (!selectedPerfEmpItem) return null;

  const selectedPerfFormTypeKPI = selectedPerfEmpItem.perfFormTypeKPI;

  if (!selectedPerfFormTypeKPI) return null;

  const { minKPICountInput, maxKPICountInput, typeMaxKPICount } =
    selectedPerfFormTypeKPI;

  if (kpi === KPICount.KPI_COUNT_MIN) {
    if (typeMaxKPICount !== 'LIMITED') return 0;
    return minKPICountInput;
  } else {
    if (typeMaxKPICount !== 'LIMITED') return 100;
    return maxKPICountInput;
  }
};

const itemsPerKPIYupSchema = (foundPerfEmpItem: any[]) => {
  // because the id generated dynamically, we need to lazy load it
  return yup.lazy((obj) =>
    // this part is for schema { [perfEmpItemId: string]: ... }
    yup
      .object(
        mapValues(obj, (val) =>
          // this part is for the nested schema [perfEmpItemId: string]: [{...}, ...]
          yup
            .array()
            .min(
              formValidateCount(foundPerfEmpItem, KPICount.KPI_COUNT_MIN, val),
              'KPI Min Count is Invalid',
            )
            .max(
              formValidateCount(foundPerfEmpItem, KPICount.KPI_COUNT_MAX, val),
              'KPI Max Count is Invalid',
            )
            .of(
              yup.object({
                kpi: yup
                  .mixed()
                  .test(
                    'isKPIEmpy',
                    'KPI is empty',
                    (value: any, testContext: any) => {
                      const isKPISelection = testContext.parent.isKPISelection;
                      const { status } = testContext.from[2].value;
                      if (
                        status != PerfEmployeeStatusEnum.DRAFT &&
                        !value &&
                        isKPISelection == false
                      ) {
                        return false;
                      } else return true;
                    },
                  ),
                kra: yup
                  .mixed()
                  .test(
                    'isKRAEmpy',
                    'KRA is empty',
                    (value, testContext: any) => {
                      const isKRASelection = testContext.parent.isKRASelection;
                      const isKRA = testContext.parent.isKRA;
                      const { status } = testContext.from[2].value;
                      if (!isKRA) return true;
                      if (
                        status != PerfEmployeeStatusEnum.DRAFT &&
                        !value &&
                        isKRASelection == false
                      ) {
                        return false;
                      } else return true;
                    },
                  ),
                perfKPI: yup
                  .mixed()
                  .test(
                    'isKPIEmpy',
                    'KPI is empty',
                    (value, testContext: any) => {
                      const isKPISelection = testContext.parent.isKPISelection;
                      const { status } = testContext.from[2].value;
                      if (
                        status != PerfEmployeeStatusEnum.DRAFT &&
                        !value &&
                        isKPISelection == true
                      ) {
                        return false;
                      } else return true;
                    },
                  ),
                perfKRA: yup
                  .mixed()
                  .test(
                    'isKRAEmpy',
                    'KRA is empty',
                    (value, testContext: any) => {
                      const isKRASelection = testContext.parent.isKRASelection;
                      const { status } = testContext.from[2].value;
                      const isKRA = testContext.parent.isKRA;
                      if (!isKRA) return true;
                      if (
                        status != PerfEmployeeStatusEnum.DRAFT &&
                        !value &&
                        isKRASelection == true
                      ) {
                        return false;
                      } else return true;
                    },
                  ),
                weight: yup
                  .number()
                  .test('isWeightValid', formValidateWeight(foundPerfEmpItem)),
              }),
            ),
        ),
      )
      .required('goal setting cannot be null'),
  );
};

export const formGoalSettingValidation = (perfGoalSettingDetails: any) => {
  const foundPerfEmpItem: any[] = [];
  perfGoalSettingDetails?.perfEmpItemType?.forEach((perfEmpItemType: any) => {
    perfEmpItemType?.perfEmpItem?.forEach((perfEmpItem: any) => {
      foundPerfEmpItem.push(perfEmpItem);
    });
  });

  return yup.object({
    id: yup.string().optional(),
    status: yup.string(),
    itemsPerKPIs: itemsPerKPIYupSchema(foundPerfEmpItem),
  });
};
