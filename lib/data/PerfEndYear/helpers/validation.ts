import { find, forEach, reduce } from 'lodash';
import { PerfLevelEnum } from '../../perfMidYear/enum/perfForm.enum';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../../perfMidYear/interfaces/perfEmp.interface';

export const validationPerfEndYearForm = (
  perfEmp: PerfEmpProps,
  type: PerfLevelEnum,
) => {
  let typeKey: 'endBySelf' | 'endByDM' | 'endByAboveDM' = 'endBySelf';
  switch (type) {
    case PerfLevelEnum.APPRAISEE:
      typeKey = 'endBySelf';
      break;
    case PerfLevelEnum.DIRECT_MANAGER:
      typeKey = 'endByDM';
      break;
    case PerfLevelEnum.ABOVE_MANAGER:
      typeKey = 'endByAboveDM';
      break;
    default:
      break;
  }
  const isApproval = type !== PerfLevelEnum.APPRAISEE;
  // const ApprovalLevel1 = type == PerfLevelEnum.DIRECT_MANAGER;
  // const ApprovalLevel2 = type == PerfLevelEnum.ABOVE_MANAGER;

  const errorMessage: string[] = [];

  const perfFormTypes = perfEmp?.perfForm?.perfFormTypes;
  forEach(perfEmp?.perfEmpItems, (empItems, perfFormTypeId) => {
    const currPerfFormType = find(
      perfFormTypes,
      (type) => type?.id === perfFormTypeId,
    );

    const perfTypeName =
      currPerfFormType?.perfType?.name || 'each Performance Type';
    const preventCheckField =
      isApproval && currPerfFormType?.isMidYearScore === true;
    let isAnyErrorTotalWeight = preventCheckField;
    let isAnyErrorKPIWeightLimit = preventCheckField;
    let isAnyEmptyKPIWeight = preventCheckField;
    let isAnyEmptyKRA = preventCheckField;
    let isAnyEmptyKPI = preventCheckField;
    const isAnyEmptyTarget = preventCheckField;
    // const isAnyEmptyAchievement = preventCheckField;
    let isAnyEmptyScore = !currPerfFormType?.isMidYearScore;
    // const isAnyEmptyComment = false;
    const dataKPI = perfEmp?.perfEmpItemPerKPI;
    // new validation
    const allDataKPI: PerfEmpItemPerKPIProps[] = [];
    forEach(empItems, (empItem) => {
      const itemPerKPI = dataKPI[empItem?.id];
      allDataKPI.push(...itemPerKPI);
      const emptyScore = find(
        itemPerKPI,
        (item) =>
          (!item?.isDeleted && !item.scores[typeKey]?.scoreId) ||
          (!item?.isDeleted && !item?.scores.endBySelf),
      );

      if (emptyScore) {
        errorMessage.push(`One or more KPI Score is empty in ${perfTypeName}`);
        isAnyEmptyScore = true;
      }
      if (empItems)
        if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
          const totalWeight = reduce(
            itemPerKPI,
            (sum, item) =>
              sum + (Number(item?.isDeleted ? 0 : item?.weight) || 0),
            0,
          );
          if (totalWeight !== 100) {
            errorMessage.push(
              `Total weight for each category in ${perfTypeName} should be 100%!`,
            );
            isAnyErrorTotalWeight = true;
          }
        }

      if (!isAnyErrorKPIWeightLimit) {
        const findErrorWeight = find(
          itemPerKPI,
          (item) => !item?.isDeleted && item?.isErrorWeight,
        );
        if (findErrorWeight) {
          errorMessage.push(
            `The provided value for KPI Min & Max Weight are not valid in ${perfTypeName}`,
          );
          isAnyErrorKPIWeightLimit = true;
        }
      }

      if (!isAnyEmptyKPIWeight) {
        const findEmptyWeight = find(
          itemPerKPI,
          (item) => !item?.isDeleted && !item?.weight,
        );
        if (findEmptyWeight) {
          errorMessage.push(
            `One or more KPI Weight is empty in ${perfTypeName}`,
          );
          isAnyEmptyKPIWeight = true;
        }
      }

      if (!isAnyEmptyKRA && currPerfFormType?.isKRA) {
        const findEmptyKRA = find(
          itemPerKPI,
          (item) => !item?.isDeleted && !item.kra && !item.perfKRAId,
        );
        if (findEmptyKRA) {
          errorMessage.push(`One or more KRA is empty in ${perfTypeName}`);
          isAnyEmptyKRA = true;
        }
      }

      if (!isAnyEmptyKPI) {
        const findEmptyKPI = find(
          itemPerKPI,
          (item) => !item?.isDeleted && !item.kpi && !item.perfKPIId,
        );
        if (findEmptyKPI) {
          errorMessage.push(`One or more KPI is empty in ${perfTypeName}`);
          isAnyEmptyKPI = true;
        }
      }

      // if (!isAnyEmptyTarget && currPerfFormType?.isTarget) {
      //   const findEmptyTarget = find(
      //     itemPerKPI,
      //     (item) => !item.target && !item.perfTargetId,
      //   );
      //   if (findEmptyTarget) {
      //     errorMessage.push(`Any empty Target in ${perfTypeName}`);
      //     isAnyEmptyTarget = true;
      //   }
      // }

      // if (!isAnyEmptyAchievement) {
      //   const findEmptyKPI = find(
      //     itemPerKPI,
      //     (item) => !item.achievement,
      //   );
      //   if (findEmptyKPI) {
      //     errorMessage.push(`Any empty Achievement in ${perfTypeName}`);
      //     isAnyEmptyAchievement = true;
      //   }
      // }

      // if (isAnyEmptyScore) {
      //   const findEmptyScore = find(
      //     itemPerKPI,
      //     (item) => !item.scores[typeKey]?.scoreId,
      //   );
      //   if (findEmptyScore) {
      //     errorMessage.push(`Any empty End Year Scoring in ${perfTypeName}`);
      //     isAnyEmptyScore = true;
      //   }
      // }

      // if (!isAnyEmptyComment) {
      //   const findEmptyComment = find(
      //     itemPerKPI,
      //     (item) => !item.scores[typeKey]?.note,
      //   );
      //   if (findEmptyComment) {
      //     errorMessage.push(`Any empty Comment in ${perfTypeName}`);
      //     isAnyEmptyComment = true;
      //   }
      // }
      if (
        isAnyErrorTotalWeight &&
        isAnyErrorKPIWeightLimit &&
        isAnyEmptyKPIWeight &&
        isAnyEmptyKRA &&
        isAnyEmptyKPI &&
        isAnyEmptyTarget &&
        // isAnyEmptyAchievement &&
        isAnyEmptyScore
        // isAnyEmptyComment
      ) {
        return false;
      }
    });

    if (!currPerfFormType?.isCategoryWeightCalc) {
      const totalWeightForAllCategory = reduce(
        allDataKPI,
        (prev, currItemPerKPI) =>
          (prev +=
            Number(currItemPerKPI?.isDeleted ? 0 : currItemPerKPI?.weight) ||
            0),
        0,
      );

      if (totalWeightForAllCategory !== 100) {
        errorMessage.push(
          `Total weight for all category in ${perfTypeName} should be 100%!`,
        );
      }
    }

    // old validation
    // forEach(empItems, (empItem) => {
    //   const emptyScore = find(
    //     empItem.perfEmpItemPerKPIs,
    //     (item) =>
    //       (!item?.isDeleted && !item.scores[typeKey]?.scoreId) ||
    //       (!item?.isDeleted && !item?.scores.endBySelf),
    //   );

    //   if (emptyScore) {
    //     errorMessage.push(`One or more KPI Score is empty in ${perfTypeName}`);
    //     isAnyEmptyScore = true;
    //   }

    //   if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
    //     const totalWeight = reduce(
    //       empItem?.perfEmpItemPerKPIs,
    //       (sum, item) =>
    //         sum + (Number(item?.isDeleted ? 0 : item?.weight) || 0),
    //       0,
    //     );
    //     if (totalWeight !== 100) {
    //       errorMessage.push(
    //         `Total weight for each category in ${perfTypeName} should be 100%!`,
    //       );
    //       isAnyErrorTotalWeight = true;
    //     }
    //   }

    //   if (!isAnyErrorKPIWeightLimit) {
    //     const findErrorWeight = find(
    //       empItem?.perfEmpItemPerKPIs,
    //       (item) => !item?.isDeleted && item?.isErrorWeight,
    //     );
    //     if (findErrorWeight) {
    //       errorMessage.push(
    //         `The provided value for KPI Min & Max Weight are not valid in ${perfTypeName}`,
    //       );
    //       isAnyErrorKPIWeightLimit = true;
    //     }
    //   }

    //   if (!isAnyEmptyKPIWeight) {
    //     const findEmptyWeight = find(
    //       empItem?.perfEmpItemPerKPIs,
    //       (item) => !item?.isDeleted && !item?.weight,
    //     );
    //     if (findEmptyWeight) {
    //       errorMessage.push(
    //         `One or more KPI Weight is empty in ${perfTypeName}`,
    //       );
    //       isAnyEmptyKPIWeight = true;
    //     }
    //   }

    //   if (!isAnyEmptyKRA && currPerfFormType?.isKRA) {
    //     const findEmptyKRA = find(
    //       empItem?.perfEmpItemPerKPIs,
    //       (item) => !item?.isDeleted && !item.kra && !item.perfKRAId,
    //     );
    //     if (findEmptyKRA) {
    //       errorMessage.push(`One or more KRA is empty in ${perfTypeName}`);
    //       isAnyEmptyKRA = true;
    //     }
    //   }

    //   if (!isAnyEmptyKPI) {
    //     const findEmptyKPI = find(
    //       empItem?.perfEmpItemPerKPIs,
    //       (item) => !item?.isDeleted && !item.kpi && !item.perfKPIId,
    //     );
    //     if (findEmptyKPI) {
    //       errorMessage.push(`One or more KPI is empty in ${perfTypeName}`);
    //       isAnyEmptyKPI = true;
    //     }
    //   }

    //   // if (!isAnyEmptyTarget && currPerfFormType?.isTarget) {
    //   //   const findEmptyTarget = find(
    //   //     empItem?.perfEmpItemPerKPIs,
    //   //     (item) => !item.target && !item.perfTargetId,
    //   //   );
    //   //   if (findEmptyTarget) {
    //   //     errorMessage.push(`Any empty Target in ${perfTypeName}`);
    //   //     isAnyEmptyTarget = true;
    //   //   }
    //   // }

    //   // if (!isAnyEmptyAchievement) {
    //   //   const findEmptyKPI = find(
    //   //     empItem?.perfEmpItemPerKPIs,
    //   //     (item) => !item.achievement,
    //   //   );
    //   //   if (findEmptyKPI) {
    //   //     errorMessage.push(`Any empty Achievement in ${perfTypeName}`);
    //   //     isAnyEmptyAchievement = true;
    //   //   }
    //   // }

    //   // if (isAnyEmptyScore) {
    //   //   const findEmptyScore = find(
    //   //     empItem?.perfEmpItemPerKPIs,
    //   //     (item) => !item.scores[typeKey]?.scoreId,
    //   //   );
    //   //   if (findEmptyScore) {
    //   //     errorMessage.push(`Any empty End Year Scoring in ${perfTypeName}`);
    //   //     isAnyEmptyScore = true;
    //   //   }
    //   // }

    //   // if (!isAnyEmptyComment) {
    //   //   const findEmptyComment = find(
    //   //     empItem?.perfEmpItemPerKPIs,
    //   //     (item) => !item.scores[typeKey]?.note,
    //   //   );
    //   //   if (findEmptyComment) {
    //   //     errorMessage.push(`Any empty Comment in ${perfTypeName}`);
    //   //     isAnyEmptyComment = true;
    //   //   }
    //   // }

    //   if (
    //     isAnyErrorTotalWeight &&
    //     isAnyErrorKPIWeightLimit &&
    //     isAnyEmptyKPIWeight &&
    //     isAnyEmptyKRA &&
    //     isAnyEmptyKPI &&
    //     isAnyEmptyTarget &&
    //     // isAnyEmptyAchievement &&
    //     isAnyEmptyScore
    //     // isAnyEmptyComment
    //   ) {
    //     return false;
    //   }
    // });

    // if (!currPerfFormType?.isCategoryWeightCalc) {
    //   const totalWeightForAllCategory = empItems.reduce(
    //     (prev, currEmpItem) =>
    //       (prev += currEmpItem.perfEmpItemPerKPIs.reduce(
    //         (prev, currItemPerKPI) =>
    //           (prev +=
    //             Number(
    //               currItemPerKPI?.isDeleted ? 0 : currItemPerKPI?.weight,
    //             ) || 0),
    //         0,
    //       )),
    //     0,
    //   );

    //   if (totalWeightForAllCategory !== 100) {
    //     errorMessage.push(
    //       `Total weight for all category in ${perfTypeName} should be 100%!`,
    //     );
    //   }
    // }
  });

  // if (
  //   perfEmp?.notes?.END_YEAR?.APPRAISEE?.note == '' ||
  //   !perfEmp?.notes?.END_YEAR?.APPRAISEE ||
  //   (!perfEmp?.notes?.END_YEAR?.DIRECT_MANAGER && ApprovalLevel1) ||
  //   (perfEmp?.notes?.END_YEAR?.DIRECT_MANAGER?.note == '' && ApprovalLevel1) ||
  //   (!perfEmp?.notes?.END_YEAR?.ABOVE_MANAGER && ApprovalLevel2) ||
  //   (perfEmp?.notes?.END_YEAR?.ABOVE_MANAGER?.note == '' && ApprovalLevel2)
  // ) {
  //   errorMessage.push(`Notes is required`);
  // }

  return {
    isValid: !errorMessage?.length,
    errors: errorMessage,
  };
};
