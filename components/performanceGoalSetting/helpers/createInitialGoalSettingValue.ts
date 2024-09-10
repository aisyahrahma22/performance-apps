import { map } from 'lodash';
import { PerfEmpItemPerKPIScoreTypeEnum } from '../../../lib/data/perfMidYear/enum/perfEmp.enum';
import {
  PerfEmpItemPerKPI,
  PerfEmpItemType,
  PerformanceKPIDataType,
  PerformanceKRADataType,
} from '../types/goalSettingTypes';

// mutate and return PerfEmpItemPerKPI from perf employee / perf superior api into new value
export default function createInitialGoalSettingValue(
  perfEmpItemTypeArrObj: PerfEmpItemType[],
) {
  const newInitPerfGoalSetting: {
    [id: string]: PerfEmpItemPerKPI[];
  } = {};

  perfEmpItemTypeArrObj?.forEach((perfEmpItemTypeObj) => {
    const perfEmpItemObj = perfEmpItemTypeObj?.perfEmpItem;
    perfEmpItemObj?.forEach((perfEmpItemObj) => {
      newInitPerfGoalSetting[perfEmpItemObj?.id] =
        perfEmpItemObj?.perfEmpItemPerKPI?.map((item, mapIdx) => ({
          id: item?.id,
          idx: mapIdx,
          isKRA: perfEmpItemTypeObj?.perfFormType?.isKRA,
          isKRASelection: perfEmpItemObj?.perfFormTypeKRA?.isSelection,
          isKPISelection: perfEmpItemObj?.perfFormTypeKPI?.isSelection,
          isPredefined: !!perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
            (dataKPIDetails) =>
              dataKPIDetails?.performanceKPI?.id ===
                (item?.perfKPI as PerformanceKPIDataType)?.id &&
              dataKPIDetails?.performanceKRA?.id ===
                (item?.perfKRA as PerformanceKRADataType)?.id,
          )?.isPredefine,
          kra: item?.kra,
          kpi: item?.kpi,
          target: item?.target,
          perfKRA: (item?.perfKRA as PerformanceKRADataType)?.id || '',
          perfKPI: (item?.perfKPI as PerformanceKPIDataType)?.id || '',
          perfEmpItemType: perfEmpItemTypeObj?.id,
          perfEmpItem: perfEmpItemObj?.id,
          weight: item?.weight,
          achievement: item?.achievement,
          code: item?.code,
          scores: mapKPIScore(item?.scores),
        }));
    });
  });

  return newInitPerfGoalSetting;
}

const mapKPIScore = (kpiScore: any) => {
  const newItem: any = {};
  map(kpiScore, (scores) => {
    switch (scores.type) {
      case PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE:
        if (scores.isMidYear) {
          newItem.midBySelf = scores;
        } else {
          newItem.endBySelf = scores;
        }
        break;
      case PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER:
        if (scores.isMidYear) {
          newItem.midByDM = scores;
        } else {
          newItem.endByDM = scores;
        }
        break;
      case PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER:
        if (scores.isMidYear) {
          newItem.midByAboveDM = scores;
        } else {
          newItem.endByAboveDM = scores;
        }
        break;
      default:
        break;
    }
    return scores;
  });
  return newItem;
};
