import { mapValues } from 'lodash';
import * as yup from 'yup';
import { PerfEmployeeStatusEnum } from '../../../enums/GoalSetting';

const formValidateWeight = (foundPerfEmpItem: any, val: any) => {
  return (value: any, testContext: any) => {
    const { isDeleted } = testContext.from[0].value;
    if (isDeleted) {
      return true;
    }
    const perfEmpItemId = val[0]?.perfEmpItemId;

    const selectedPerfEmpItem = foundPerfEmpItem.find(
      (item: any) => item?.perfEmpItem?.id === perfEmpItemId,
    );

    if (!selectedPerfEmpItem || !perfEmpItemId) return false;

    const selectedPerfFormTypeKPI =
      selectedPerfEmpItem?.perfEmpItem?.perfFormTypeKPI;

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

const isKPISelection = (foundPerfEmpItem: any, val: any) => {
  const selectedPerfEmpItem = foundPerfEmpItem?.find(
    (item: any) => item?.perfEmpItem?.id === val[0]?.perfEmpItemId,
  );
  return (
    selectedPerfEmpItem?.perfEmpItem?.perfFormTypeKPI?.isSelection || false
  );
};

const isKRASelection = (foundPerfEmpItem: any, val: any) => {
  const selectedPerfEmpItem = foundPerfEmpItem?.find(
    (item: any) => item?.perfEmpItem?.id === val[0]?.perfEmpItemId,
  );

  return (
    selectedPerfEmpItem?.perfEmpItem?.perfFormTypeKRA?.isSelection || false
  );
};
const isKRA = (foundPerfEmpItem: any, val: any) => {
  const selectedPerfEmpItem = foundPerfEmpItem?.find(
    (item: any) => item?.perfEmpItem?.id === val[0]?.perfEmpItemId,
  );

  return selectedPerfEmpItem?.perfFormType?.isKRA || false;
};
const isMidYearScore = (foundPerfEmpItem: any, val: any) => {
  const selectedPerfEmpItem = foundPerfEmpItem?.find(
    (item: any) => item?.perfEmpItem?.id === val[0]?.perfEmpItemId,
  );

  return selectedPerfEmpItem?.perfFormType?.isMidYearScore || false;
};

export const itemsPerKPIYupSchema = (foundPerfEmpItem: any[]) => {
  return yup.lazy((obj) =>
    yup
      .object(
        mapValues(obj, (val) =>
          yup.array().of(
            yup.object({
              kpi: yup
                .mixed()
                .test(
                  'isKPIEmpy',
                  'KPI is empty',
                  (value: any, testContext: any) => {
                    const { status } = testContext.from[2].value;
                    const isSelection = isKPISelection(foundPerfEmpItem, val);
                    const { isDeleted } = testContext.from[0].value;
                    if (isDeleted) {
                      return true;
                    }
                    if (
                      status != PerfEmployeeStatusEnum.DRAFT &&
                      !value &&
                      isSelection == false
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
                    const isSelection = isKRASelection(foundPerfEmpItem, val);
                    const { status } = testContext.from[2].value;
                    const { isDeleted } = testContext.from[0].value;

                    if (isDeleted) {
                      return true;
                    }
                    if (!isKRA(foundPerfEmpItem, val)) return true;
                    if (
                      status != PerfEmployeeStatusEnum.DRAFT &&
                      !value &&
                      isSelection == false
                    ) {
                      return false;
                    } else return true;
                  },
                ),
              perfKPIId: yup
                .mixed()
                .test(
                  'isKPIEmpy',
                  'KPI is empty',
                  (value, testContext: any) => {
                    const isSelection = isKPISelection(foundPerfEmpItem, val);
                    const { status } = testContext.from[2].value;
                    const { isDeleted } = testContext.from[0].value;
                    if (isDeleted) {
                      return true;
                    }
                    if (
                      status != PerfEmployeeStatusEnum.DRAFT &&
                      !value &&
                      isSelection == true
                    ) {
                      return false;
                    } else return true;
                  },
                ),
              perfKRAId: yup
                .mixed()
                .test(
                  'isKRAEmpty',
                  'KRA is empty',
                  (value, testContext: any) => {
                    const isSelection = isKRASelection(foundPerfEmpItem, val);
                    const { status } = testContext.from[2].value;
                    const { isDeleted } = testContext.from[0].value;
                    if (isDeleted) {
                      return true;
                    }

                    if (!isKRA(foundPerfEmpItem, val)) return true;
                    if (
                      status != PerfEmployeeStatusEnum.DRAFT &&
                      !value &&
                      isSelection == true
                    ) {
                      return false;
                    } else return true;
                  },
                ),
              weight: yup
                .number()
                .test(
                  'isWeightValid',
                  formValidateWeight(foundPerfEmpItem, val),
                ),
              scores: yup.object().shape({
                midBySelf: yup.object().shape({
                  scoreId: yup
                    .string()
                    .test(
                      'isScoreEmpty',
                      'KPI score is empty',
                      (value, testContext: any) => {
                        const { status } = testContext.from[4].value;
                        const { isDeleted } = testContext.from[2].value;
                        if (isDeleted) {
                          return true;
                        }
                        if (!isMidYearScore(foundPerfEmpItem, val)) return true;
                        if (status != PerfEmployeeStatusEnum.DRAFT && !value) {
                          return false;
                        } else return true;
                      },
                    ),
                }),
              }),
            }),
          ),
        ),
      )
      .required('cannot be null'),
  );
};
export const midYearYupSchema = (item: any, isApproval: boolean) => {
  const foundPerfEmpItem: any[] = [];
  const items = isApproval
    ? item?.perfEmployee?.perfEmpItemType
    : item?.perfEmpItemType;
  items?.forEach((perfEmpItemType: any) => {
    perfEmpItemType?.perfEmpItem?.forEach((perfEmpItem: any) => {
      foundPerfEmpItem.push({
        perfEmpItem,
        perfFormType: perfEmpItemType?.perfFormType,
      });
    });
  });

  return yup.object({
    perfEmpItemPerKPI: itemsPerKPIYupSchema(foundPerfEmpItem),
  });
};
