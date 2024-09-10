import { find, forEach, isEmpty, map } from 'lodash';
import mapGoalSettingNotes from '../../../../components/performanceGoalSetting/helpers/mapGoalSettingNotes';
import { PerfEmployeeStatusEnum } from '../../../enums/TimelineStatusEnum';
import getGuid from '../../../util/getGuid';
import { PerfEmpItemPerKPIScoreTypeEnum } from '../enum/perfEmp.enum';
import {
  PerfEmpProps,
  PerfEmpItemProps,
  PerfEmpItemPerKPIProps,
  PerfTypeScoreProps,
  PerfEmpItemPerKPIScoreProps,
  EmployeeProps,
  DemostrateKPISiloamValueProps,
} from '../interfaces/perfEmp.interface';
import {
  PerfFormProps,
  PerfFormTypeItemProps,
} from '../interfaces/perfForm.interface';
import { generateInitialPerfForm } from './generateInitialValuePerfForm';
import { PerfFormFillProps, perfFormFillRule } from './perfFormFill';
import { PerfLevelEnum } from '../enum/perfForm.enum';
import { PerformanceStatusEnum } from '../../../enums/PerformanceEnum';

export const generateInitialPerfEmp = (
  perfEmp: any,
  perfSup?: any,
  endYear?: boolean,
  siloamValue?: any,
  demonstrateKPISiloamValue?: any,
) => {
  const perfEmpItemPerKPI = perfEmp?.perfEmpItemPerKPI;
  const timelineSeq = perfEmp?.timelineSeq || {};
  const perfForm = generateInitialPerfForm(perfEmp?.perfForm);
  const {
    data: perfEmpItems,
    perfTypeScores,
    itemPerKPI,
  } = generateInitialPerfEmpItem(perfEmp, perfForm, perfEmpItemPerKPI);

  const demonstrateKPISiloamValueDM =
    demonstrateKPISiloamValue?.filter(
      (val: any) => val.type === PerfLevelEnum.DIRECT_MANAGER,
    ) || [];

  const demonstrateKPISiloamValueADM =
    demonstrateKPISiloamValue?.filter(
      (val: any) => val.type === PerfLevelEnum.ABOVE_MANAGER,
    ) || [];

  const data: PerfEmpProps = {
    id: perfEmp?.id,
    perfForm,
    revise: perfEmp?.revise?.note,
    status: perfEmp?.status,
    timelineSeq: {
      id: timelineSeq?.id,
      order: timelineSeq?.order,
      timeline: timelineSeq?.timeline,
      startDate: timelineSeq?.startDate,
      endDate: timelineSeq?.endDate,
      isActive: timelineSeq?.isActive,
    },
    perfEmpItems,
    perfTypeScores,
    notes: endYear
      ? mapGoalSettingNotes(perfEmp?.notes, false, true)
      : mapGoalSettingNotes(perfEmp?.notes, true, false),
    deletedPerfEmpItemKPIs: [],
    employee: generateInitialEmp(perfEmp),
    perfSup: perfSup
      ? {
          id: perfSup?.id,
          status: perfSup?.status,
          level: perfSup?.level,
          type: perfSup?.type,
        }
      : undefined,
    siloamValue: siloamValue,
    demostrateKPISiloamValueDM: generateInitialDemonstrateKPIValueDM(
      demonstrateKPISiloamValueDM,
      perfSup?.id,
      perfEmp?.id,
      PerfLevelEnum.DIRECT_MANAGER,
      siloamValue,
    ),
    demostrateKPISiloamValueADM: generateInitialDemonstrateKPIValueADM(
      demonstrateKPISiloamValueADM,
      demonstrateKPISiloamValueDM,
      perfSup?.id,
      perfEmp?.id,
      PerfLevelEnum.ABOVE_MANAGER,
      perfSup?.level >= 2
        ? PerfLevelEnum.ABOVE_MANAGER
        : PerfLevelEnum.DIRECT_MANAGER,
      perfSup?.endYearStatus,
    ),
    perfEmpItemPerKPI: itemPerKPI,
  };

  return data;
};

const generateInitialPerfEmpItem = (
  perfEmp: any,
  perfForm: PerfFormProps,
  perfEmpItemPerKPI: any,
) => {
  const data: {
    [perfFormTypeId: string]: PerfEmpItemProps[];
  } = {};

  const perfTypeScores: {
    [perfFormTypeId: string]: PerfTypeScoreProps;
  } = {};

  const itemPerKPI: {
    [empItemId: string]: PerfEmpItemPerKPIProps[];
  } = {};
  const status = perfEmp?.status;

  perfEmp?.perfEmpItemType?.forEach((val: any) => {
    const formTypeId = val?.perfFormTypeId;
    if (formTypeId) {
      const empItems: PerfEmpItemProps[] =
        val?.perfEmpItem?.map((item: any) => {
          const itemKPIs = generateInitialPerfEmpItemPerKPIs(
            perfEmpItemPerKPI,
            perfForm,
            formTypeId,
            item?.id,
          );
          itemPerKPI[item?.id] = itemKPIs;
          const empItem: PerfEmpItemProps = {
            id: item?.id,
            perfEmpItemTypeId: item?.perfEmpItemTypeId,
            perfFormTypeItemId: item?.perfFormTypeItemId,
            perfFormTypeKRAId: item?.perfFormTypeKRAId,
            perfFormTypeKPIId: item?.perfFormTypeKPIId,
            perfFormTypeTargetId: item?.perfFormTypeTargetId,
            perfEmpItemPerKPIs: itemKPIs,
          };

          if (
            status === PerfEmployeeStatusEnum.AVAILABLE &&
            !itemKPIs?.length
          ) {
            // generate predefine if form timeline start from mid year
            const formType = find(
              perfForm?.perfFormTypes,
              (type) => type?.id === formTypeId,
            );
            const formTypeItem = formType
              ? find(
                  formType?.items,
                  (item) =>
                    item?.id === empItem?.perfFormTypeItemId &&
                    item?.perfFormTypeKPI?.id === empItem?.perfFormTypeKPIId &&
                    item?.perfFormTypeKRA?.id === empItem?.perfFormTypeKRAId &&
                    item?.perfFormTypeTarget?.id ===
                      empItem?.perfFormTypeTargetId,
                )
              : undefined;
            if (formType && formTypeItem) {
              const rule = perfFormFillRule({ formType, formTypeItem });
              if (rule?.kpi?.isPredefine || rule?.kra?.isPredefine) {
                const currItemKPIs = generatePredefinePerfEmpItemKPIs({
                  formTypeItem,
                  type: rule?.kpi?.isPredefine ? 'KPI' : 'KRA',
                  ruleKPI: rule?.kpi,
                  ruleKRA: rule?.kra,
                  ruleTarget: rule?.target,
                  empItemId: empItem?.id,
                });
                empItem.perfEmpItemPerKPIs = currItemKPIs;
              }
            }
          }
          return empItem;
        }) || [];

      const existEmpItems = data[formTypeId] || [];
      data[formTypeId] = [...existEmpItems, ...empItems];

      perfTypeScores[formTypeId] = {
        midScoreBySelf: val?.midScoreBySelf,
        midScoreByDM: val?.midScoreByDM,
        midScoreByAboveDM: val?.midScoreByAboveDM,
        endScoreBySelf: val?.endScoreBySelf,
        endScoreByDM: val?.endScoreByDM,
        endScoreByAboveDM: val?.endScoreByAboveDM,
      };
    }
  });

  return {
    data,
    perfTypeScores,
    itemPerKPI,
  };
};

const generateInitialPerfEmpItemPerKPIs = (
  perfEmpItemPerKPI: any,
  perfForm: PerfFormProps,
  formTypeId: string,
  empItemId: string,
) => {
  const filterValues = perfEmpItemPerKPI?.filter(
    (val: any) => val.perfEmpItemId == empItemId,
  );
  const data: PerfEmpItemPerKPIProps[] =
    filterValues?.map((itemKPI: any) => {
      const scores = generateInitialPerfEmpItemPerKPIScore(
        itemKPI,
        perfForm,
        formTypeId,
      );

      return {
        id: itemKPI?.id,
        kra: itemKPI?.kra || null,
        kpi: itemKPI?.kpi || null,
        target: itemKPI?.target || itemKPI?.perfTarget?.name,
        weight: Number(itemKPI?.weight),
        achievement: itemKPI?.achievement || '',
        lastVersion: Number(itemKPI?.lastVersion) || 0,
        perfEmpItemId: itemKPI?.perfEmpItemId || empItemId || null,
        perfKRAId: isEmpty(itemKPI?.perfKRAId) ? null : itemKPI?.perfKRAId,
        perfKPIId: isEmpty(itemKPI?.perfKPIId) ? null : itemKPI?.perfKPIId,
        perfTargetId: isEmpty(itemKPI?.perfTargetId)
          ? null
          : itemKPI?.perfTargetId,
        isShowComment: true,
        code: itemKPI?.code,
        isDeleted: itemKPI?.isDeleted,
        scores: {
          midBySelf: scores?.['midBySelf'],
          midByDM: scores?.['midByDM'],
          midByAboveDM: scores?.['midByAboveDM'],
          endBySelf: scores?.['endBySelf'],
          endByDM: scores?.['endByDM'],
          endByAboveDM: scores?.['endByAboveDM'],
        },
      } as PerfEmpItemPerKPIProps;
    }) || [];

  return data;
};

const generateInitialPerfEmpItemPerKPIScore = (
  perfEmpItemKPI: any,
  perfForm: PerfFormProps,
  formTypeId: string,
) => {
  const scores: {
    [type: string]: PerfEmpItemPerKPIScoreProps;
  } = {};

  const measurementGrades =
    find(perfForm?.perfFormTypes, (type) => type?.id === formTypeId)
      ?.perfMeasurement?.grades || [];

  forEach(perfEmpItemKPI?.scores, (sc) => {
    let key = '';
    let type = PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE;
    switch (sc?.type) {
      case PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE:
        if (sc?.isMidYear) {
          key = 'midBySelf';
        } else {
          key = 'endBySelf';
        }
        type = PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE;
        break;
      case PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER:
        if (sc?.isMidYear) {
          key = 'midByDM';
        } else {
          key = 'endByDM';
        }
        type = PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER;
        break;
      case PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER:
        if (sc?.isMidYear) {
          key = 'midByAboveDM';
        } else {
          key = 'endByAboveDM';
        }
        type = PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER;
        break;
      default:
        break;
    }
    const score = sc?.scoreId
      ? find(measurementGrades, (grade) => grade?.id === sc?.scoreId)?.point ||
        0
      : 0;

    // const absoluteScoreNote =
    //   '\n \nNote: Score Generated Using Absolute Score.';

    scores[key] = {
      id: sc?.id,
      scoreId: sc?.scoreId || '',
      score,
      isMidYear: sc?.isMidYear,
      weightScore: sc?.weightScore || 0,
      note: sc?.note || '',
      type,
      isAbsoluteScore: sc?.isAbsoluteScore,
    };
  });

  return scores;
};

export const generatePerfEmpItemPerKPIScore = (
  type: PerfEmpItemPerKPIScoreTypeEnum,
  isMidYear: boolean,
) => {
  return {
    id: getGuid(),
    scoreId: '',
    score: 0,
    isMidYear,
    weightScore: 0,
    note: '',
    type,
    isAbsoluteScore: false,
  } as PerfEmpItemPerKPIScoreProps;
};

type GeneratePredefinePerfEmpItemKPIProps = {
  formTypeItem: PerfFormTypeItemProps;
  type: 'KRA' | 'KPI';
  ruleKRA: PerfFormFillProps;
  ruleKPI: PerfFormFillProps;
  ruleTarget: PerfFormFillProps;
  empItemId: string;
};

const generatePredefinePerfEmpItemKPIs = ({
  formTypeItem,
  type,
  ruleKRA,
  ruleKPI,
  ruleTarget,
  empItemId,
}: GeneratePredefinePerfEmpItemKPIProps) => {
  const empItemKPIs: PerfEmpItemPerKPIProps[] = [];
  const isSelectKRA = ruleKRA?.type === 'DROPDOWN';
  const isSelectKPI = ruleKPI?.type === 'DROPDOWN';
  const isSelectTarget = ruleTarget?.type === 'DROPDOWN';
  const { perfFormTypeKPI, perfFormTypeKRA, perfFormTypeTarget } = formTypeItem;

  if (type === 'KPI') {
    perfFormTypeKPI?.details?.forEach((detail) => {
      const { isPredefine, kpi, kra, weight } = detail;
      if (isPredefine) {
        const target = find(
          perfFormTypeTarget?.details,
          (targetDetail) => targetDetail?.kpi?.id === kpi?.id,
        )?.target;

        empItemKPIs.push({
          id: getGuid(),
          weight: Number(weight) || 0,
          kra: isSelectKRA ? '' : kra?.name,
          perfKRAId: isSelectKRA ? kra?.id : null,
          kpi: isSelectKPI ? '' : kpi?.name,
          perfKPIId: isSelectKPI ? kpi?.id : null,
          target: isSelectTarget ? '' : target?.name,
          perfTargetId: isSelectTarget ? target?.id : null,
          isShowComment: true,
          perfEmpItemId: empItemId,
          scores: {
            midBySelf: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
              true,
            ),
            midByDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
              true,
            ),
            midByAboveDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
              true,
            ),
            endBySelf: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
              false,
            ),
            endByDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
              false,
            ),
            endByAboveDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
              false,
            ),
          },
        });
      }
    });
  } else if (type === 'KRA') {
    perfFormTypeKRA?.details?.forEach((detail) => {
      const { isPredefine, kra } = detail;
      if (isPredefine) {
        empItemKPIs.push({
          id: getGuid(),
          kra: isSelectKRA ? '' : kra?.name,
          perfKRAId: isSelectKRA ? kra?.id : null,
          isShowComment: true,
          perfEmpItemId: empItemId,
          scores: {
            midBySelf: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
              true,
            ),
            midByDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
              true,
            ),
            midByAboveDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
              true,
            ),
            endBySelf: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
              false,
            ),
            endByDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
              false,
            ),
            endByAboveDM: generatePerfEmpItemPerKPIScore(
              PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
              false,
            ),
          },
        });
      }
    });
  }

  return empItemKPIs;
};

const generateInitialEmp = (perfEmp: any) => {
  const emp = perfEmp?.employee || {};

  return {
    id: emp?.id,
    fullName: emp?.fullName,
    positionId: emp?.position?.id,
    positionName: emp?.position?.name,
    profilePath: emp?.profilePath,
  } as EmployeeProps;
};

const generateInitialDemonstrateKPIValueDM = (
  demonstrateKPISiloamValueDM: any[],
  perfSuperiorId: string,
  perfEmployeeId: string,
  type: PerfLevelEnum.ABOVE_MANAGER | PerfLevelEnum.DIRECT_MANAGER,
  siloamValue: any[],
) => {
  const newData =
    map(siloamValue, (value: any) => {
      return {
        siloamValueId: value?.id,
        score: 0,
        perfSuperiorId: perfSuperiorId,
        perfEmployeeId: perfEmployeeId,
        type: type,
      };
    }) || [];

  const editData =
    demonstrateKPISiloamValueDM?.map<DemostrateKPISiloamValueProps>(
      (value: any) => {
        return {
          id: value?.id,
          siloamValueId: value?.siloamValueId,
          score: value?.score,
          perfSuperiorId: value?.perfSuperiorId,
          perfEmployeeId: value?.perfEmployeeId,
          type: value?.type,
          order: value?.order,
        };
      },
    ) || [];

  return demonstrateKPISiloamValueDM?.length != 0 ? editData : newData;
};

const generateInitialDemonstrateKPIValueADM = (
  demonstrateKPISiloamValueADM: any[],
  demonstrateKPISiloamValueDM: any[],
  perfSuperiorId: string,
  perfEmployeeId: string,
  type: PerfLevelEnum.ABOVE_MANAGER | PerfLevelEnum.DIRECT_MANAGER,
  level: PerfLevelEnum.ABOVE_MANAGER | PerfLevelEnum.DIRECT_MANAGER,
  endYearStatus: string,
) => {
  const newData =
    demonstrateKPISiloamValueDM?.map<DemostrateKPISiloamValueProps>((value) => {
      return {
        siloamValueId: value?.siloamValueId,
        score: value?.score,
        perfSuperiorId: perfSuperiorId,
        perfEmployeeId: perfEmployeeId,
        type: type,
        order: value?.order,
      };
    }) || [];

  const editData = demonstrateKPISiloamValueADM.map((value, index) => {
    return endYearStatus == PerformanceStatusEnum.REQUESTED
      ? {
          id: value?.id,
          siloamValueId: demonstrateKPISiloamValueDM[index]?.siloamValueId,
          score: demonstrateKPISiloamValueDM[index]?.score,
          perfSuperiorId: value?.perfSuperiorId,
          perfEmployeeId: value?.perfEmployeeId,
          type: value?.type,
          order: value?.order,
        }
      : {
          id: value?.id,
          siloamValueId: value?.siloamValueId,
          score: value?.score,
          perfSuperiorId: value?.perfSuperiorId,
          perfEmployeeId: value?.perfEmployeeId,
          type: value?.type,
          order: value?.order,
        };
  });

  return demonstrateKPISiloamValueADM?.length > 0
    ? editData
    : demonstrateKPISiloamValueADM?.length < 1 &&
      level == PerfLevelEnum.ABOVE_MANAGER
    ? newData
    : [];
};
