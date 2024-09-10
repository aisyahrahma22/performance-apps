import { find, forEach, sumBy } from 'lodash';
import { PerfLevelEnum } from '../enum/perfForm.enum';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  PerfEmpProps,
  PerfTypeScoreProps,
} from '../interfaces/perfEmp.interface';
import { PerfFormTypeProps } from '../interfaces/perfForm.interface';

type CalcWeightScorePerKPIProps = {
  score: number;
  weightKPI: number;
  totalWeight: number;
  isKPIWeightCalc?: boolean;
};

export const calculateWeightScorePerfKPI = ({
  score,
  weightKPI,
}: CalcWeightScorePerKPIProps) => {
  // Notes: weight score calculation below is for KPI calculation Weight === yes, if NO ?? need discussion
  return (score * weightKPI) / 100; // even if total weight is not 100
};

type CalcPerfTypeScoreProps = {
  levels: PerfLevelEnum[];
  perfEmpItems: PerfEmpItemProps[];
  perfType: PerfFormTypeProps;
  term?: 'MID_YEAR' | 'END_YEAR';
  lastPerfTypeScore?: PerfTypeScoreProps;
  perfEmpItemPerKPI: any;
};

export const calculatePerfTypeScore = ({
  levels,
  perfEmpItems,
  perfType,
  term,
  lastPerfTypeScore,
  perfEmpItemPerKPI,
}: CalcPerfTypeScoreProps) => {
  // Whats happened if KPI Weight Calculation Yes or No ???
  const score: PerfTypeScoreProps = {
    midScoreBySelf: lastPerfTypeScore?.midScoreBySelf || 0,
    midScoreByDM: lastPerfTypeScore?.midScoreByDM || 0,
    midScoreByAboveDM: lastPerfTypeScore?.midScoreByAboveDM || 0,
    endScoreBySelf: lastPerfTypeScore?.endScoreBySelf || 0,
    endScoreByDM: lastPerfTypeScore?.endScoreByDM || 0,
    endScoreByAboveDM: lastPerfTypeScore?.endScoreByAboveDM || 0,
  };
  if (!perfEmpItems?.length) return score;
  // console.log('perfEmpItemPerKPI', perfEmpItemPerKPI)
  let categoryScoreBySelf = 0;
  let categoryScoreByDM = 0;
  let categoryScoreByADM = 0;
  // const allDataKPI: PerfEmpItemPerKPIProps[] = []
  forEach(perfEmpItems, (empItem) => {
    const perfTypeItem = find(
      perfType?.items,
      (item) => item?.id === empItem?.perfFormTypeItemId,
    );
    const itemPerKPI = perfEmpItemPerKPI[empItem?.id];
    if (levels.includes(PerfLevelEnum.APPRAISEE) && term === 'MID_YEAR') {
      const sumWeightScoreSelf = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.midBySelf?.weightScore || 0
          : 0,
      );

      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreSelf =
          (sumWeightScoreSelf * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreBySelf += currCatScoreSelf;
      } else {
        // if no category weight calc, is auto sum to category score ?
        categoryScoreBySelf += sumWeightScoreSelf;
      }
    }

    if (levels.includes(PerfLevelEnum.APPRAISEE) && term === 'END_YEAR') {
      const sumWeightScoreSelf = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.endBySelf?.weightScore || 0
          : 0,
      );

      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreSelf =
          (sumWeightScoreSelf * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreBySelf += currCatScoreSelf;
      } else {
        // if no category weight calc, is auto sum to category score ?
        categoryScoreBySelf += sumWeightScoreSelf;
      }
    }

    if (levels.includes(PerfLevelEnum.DIRECT_MANAGER) && term === 'MID_YEAR') {
      const sumWeightScoreDM = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.midByDM?.weightScore || 0
          : 0,
      );
      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreDM =
          (sumWeightScoreDM * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreByDM += currCatScoreDM;
      } else {
        categoryScoreByDM += sumWeightScoreDM;
      }
    }

    if (levels.includes(PerfLevelEnum.DIRECT_MANAGER) && term === 'END_YEAR') {
      const sumWeightScoreDM = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.endByDM?.weightScore || 0
          : 0,
      );
      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreDM =
          (sumWeightScoreDM * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreByDM += currCatScoreDM;
      } else {
        categoryScoreByDM += sumWeightScoreDM;
      }
    }

    if (levels.includes(PerfLevelEnum.ABOVE_MANAGER) && term === 'MID_YEAR') {
      const sumWeightScoreADM = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.midByAboveDM?.weightScore || 0
          : 0,
      );
      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreADM =
          (sumWeightScoreADM * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreByADM += currCatScoreADM;
      } else {
        categoryScoreByADM += sumWeightScoreADM;
      }
    }

    if (levels.includes(PerfLevelEnum.ABOVE_MANAGER) && term === 'END_YEAR') {
      const sumWeightScoreADM = sumBy(itemPerKPI, (itemKPI: any) =>
        itemKPI?.isDeleted == false
          ? itemKPI?.scores?.endByAboveDM?.weightScore || 0
          : 0,
      );
      if (perfType?.isCategoryWeightCalc && perfType?.isCategory) {
        const currCatScoreADM =
          (sumWeightScoreADM * (perfTypeItem?.categoryWeight || 0)) / 100;
        categoryScoreByADM += currCatScoreADM;
      } else {
        categoryScoreByADM += sumWeightScoreADM;
      }
    }
  });

  if (term === 'MID_YEAR') {
    score.midScoreBySelf =
      (categoryScoreBySelf * (perfType?.weight || 0)) / 100;

    score.midScoreByDM = (categoryScoreByDM * (perfType?.weight || 0)) / 100;

    score.midScoreByAboveDM =
      (categoryScoreByADM * (perfType?.weight || 0)) / 100;
  } else {
    score.endScoreBySelf =
      (categoryScoreBySelf * (perfType?.weight || 0)) / 100;

    score.endScoreByDM = (categoryScoreByDM * (perfType?.weight || 0)) / 100;

    score.endScoreByAboveDM =
      (categoryScoreByADM * (perfType?.weight || 0)) / 100;
  }

  return score;
};

export const calculatePerfTypeScoreAll = (
  perfEmp: PerfEmpProps,
  isEndYear?: boolean,
) => {
  const perfTypeScores: {
    [perfFormTypeId: string]: PerfTypeScoreProps;
  } = {};
  const perfEmpItemPerKPI = perfEmp?.perfEmpItemPerKPI;
  const itemPerKPI: PerfEmpItemPerKPIProps[] = [];
  forEach(perfEmp?.perfEmpItems, (empItems, formTypeId) => {
    forEach(empItems, (empItem) => {
      const dataKPI = perfEmpItemPerKPI[empItem?.id];
      itemPerKPI.push(...dataKPI);
    });
    const perfType = find(
      perfEmp?.perfForm?.perfFormTypes,
      (formType) => formType?.id === formTypeId,
    );
    if (perfType) {
      const lastPerfTypeScore = perfEmp?.perfTypeScores?.[formTypeId];
      const {
        midScoreBySelf,
        midScoreByDM,
        midScoreByAboveDM,
        endScoreBySelf,
        endScoreByDM,
        endScoreByAboveDM,
      } = calculatePerfTypeScore({
        levels: Object.values(PerfLevelEnum),
        perfEmpItems: empItems,
        perfType,
        lastPerfTypeScore,
        term: isEndYear ? 'END_YEAR' : 'MID_YEAR',
        perfEmpItemPerKPI,
      });
      perfTypeScores[formTypeId] = {
        midScoreBySelf,
        midScoreByDM,
        midScoreByAboveDM,
        endScoreBySelf,
        endScoreByDM,
        endScoreByAboveDM,
      };
    }
  });

  return perfTypeScores;
};
