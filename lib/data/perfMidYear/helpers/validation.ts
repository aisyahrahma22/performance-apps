import { find, forEach, reduce } from 'lodash';
import { PerfLevelEnum } from '../enum/perfForm.enum';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../interfaces/perfEmp.interface';

export const validationPerfMidYearForm = (
  perfEmp: PerfEmpProps,
  type: PerfLevelEnum,
) => {
  let typeKey: 'midBySelf' | 'midByDM' | 'midByAboveDM' = 'midBySelf';
  switch (type) {
    case PerfLevelEnum.APPRAISEE:
      typeKey = 'midBySelf';
      break;
    case PerfLevelEnum.DIRECT_MANAGER:
      typeKey = 'midByDM';
      break;
    case PerfLevelEnum.ABOVE_MANAGER:
      typeKey = 'midByAboveDM';
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
    // let isAnyEmptyAchievement = preventCheckField;
    let isAnyEmptyScore = !currPerfFormType?.isMidYearScore;
    // let isAnyEmptyComment = false
    // new validation
    const dataKPI = perfEmp?.perfEmpItemPerKPI;
    const allDataKPI: PerfEmpItemPerKPIProps[] = [];
    forEach(empItems, (empItem) => {
      const itemPerKPI = dataKPI[empItem?.id];
      allDataKPI.push(...itemPerKPI);
      if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
        const totalWeight = reduce(
          itemPerKPI,
          (sum, item) =>
            sum + (Number(item?.isDeleted == true ? 0 : item?.weight) || 0),
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
          errorMessage.push(`One or more KPI is empty in  ${perfTypeName}`);
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
      //     errorMessage.push(
      //       `Any empty Result & Achievement in ${perfTypeName}`,
      //     );
      //     isAnyEmptyAchievement = true;
      //   }
      // }

      if (!isAnyEmptyScore && currPerfFormType?.isMidYearScore) {
        const findEmptyScore = find(
          itemPerKPI,
          (item) => !item?.isDeleted && !item.scores[typeKey]?.scoreId,
        );
        if (findEmptyScore) {
          errorMessage.push(
            `One or more KPI Score is empty in ${perfTypeName}`,
          );
          isAnyEmptyScore = true;
        }
      }

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
    //   if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
    //     const totalWeight = reduce(
    //       empItem?.perfEmpItemPerKPIs,
    //       (sum, item) =>
    //         sum + (Number(item?.isDeleted == true ? 0 : item?.weight) || 0),
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
    //       errorMessage.push(`One or more KPI is empty in  ${perfTypeName}`);
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
    //   //     errorMessage.push(
    //   //       `Any empty Result & Achievement in ${perfTypeName}`,
    //   //     );
    //   //     isAnyEmptyAchievement = true;
    //   //   }
    //   // }

    //   if (!isAnyEmptyScore && currPerfFormType?.isMidYearScore) {
    //     const findEmptyScore = find(
    //       empItem?.perfEmpItemPerKPIs,
    //       (item) => !item?.isDeleted && !item.scores[typeKey]?.scoreId,
    //     );
    //     if (findEmptyScore) {
    //       errorMessage.push(
    //         `One or more KPI Score is empty in ${perfTypeName}`,
    //       );
    //       isAnyEmptyScore = true;
    //     }
    //   }

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
  //   perfEmp?.notes?.MID_YEAR?.APPRAISEE?.note == '' ||
  //   !perfEmp?.notes?.MID_YEAR?.APPRAISEE ||
  //   (!perfEmp?.notes?.MID_YEAR?.DIRECT_MANAGER && ApprovalLevel1) ||
  //   (perfEmp?.notes?.MID_YEAR?.DIRECT_MANAGER?.note == '' && ApprovalLevel1) ||
  //   (!perfEmp?.notes?.MID_YEAR?.ABOVE_MANAGER && ApprovalLevel2) ||
  //   (perfEmp?.notes?.MID_YEAR?.ABOVE_MANAGER?.note == '' && ApprovalLevel2)
  // ) {
  //   errorMessage.push(`Notes is required`);
  // }

  return {
    isValid: !errorMessage?.length,
    errors: errorMessage,
  };
};

export const validationMidYearFormWeightOnly = (
  perfEmp: PerfEmpProps,
  type: PerfLevelEnum,
) => {
  const isApproval = type !== PerfLevelEnum.APPRAISEE;

  const errorMessage: string[] = [];
  const dataKPI = perfEmp?.perfEmpItemPerKPI;
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

    // new validation
    forEach(empItems, (empItem) => {
      const itemPerKPI = dataKPI[empItem?.id];
      if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
        const totalWeight = reduce(
          itemPerKPI,
          (sum, item) =>
            sum + (Number(item?.isDeleted == true ? 0 : item?.weight) || 0),
          0,
        );
        if (totalWeight !== 100) {
          errorMessage.push(
            `Total weight for each category in ${perfTypeName} should be 100%!`,
          );
          isAnyErrorTotalWeight = true;
        }
      }

      if (!currPerfFormType?.isCategoryWeightCalc) {
        const totalWeightForAllCategory = reduce(
          itemPerKPI,
          (sum, item) =>
            sum + (Number(item?.isDeleted == true ? 0 : item?.weight) || 0),
          0,
        );
        if (totalWeightForAllCategory !== 100) {
          errorMessage.push(
            `Total weight for all category in ${perfTypeName} should be 100%!`,
          );
        }
      }

      if (isAnyErrorTotalWeight) {
        return false;
      }
    });
    // old validation
    // forEach(empItems, (empItem) => {
    //   if (!isAnyErrorTotalWeight && currPerfFormType?.isCategoryWeightCalc) {
    //     const totalWeight = reduce(
    //       empItem?.perfEmpItemPerKPIs,
    //       (sum, item) =>
    //         sum + (Number(item?.isDeleted == true ? 0 : item?.weight) || 0),
    //       0,
    //     );
    //     if (totalWeight !== 100) {
    //       errorMessage.push(
    //         `Total weight for each category in ${perfTypeName} should be 100%!`,
    //       );
    //       isAnyErrorTotalWeight = true;
    //     }
    //   }

    //   if (isAnyErrorTotalWeight) {
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

  return {
    isValid: !errorMessage?.length,
    errors: errorMessage,
  };
};
