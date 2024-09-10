import { FormikProps } from 'formik';
import { cloneDeep, find, get, set } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { PerfEmpItemPerKPIScoreTypeEnum } from '../../../lib/data/perfMidYear/enum/perfEmp.enum';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { calculateWeightScorePerfKPI } from '../../../lib/data/perfMidYear/helpers/calculation';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemPerKPIScoreProps,
  PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfMeasurementGradeProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import InputDropdownSimple from '../../InputDropdownSimple';
import { Popup } from 'semantic-ui-react';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';

interface InputScorePerfMidProps {
  formik: FormikProps<PerfEmpProps>;
  name: string;
  scoreObj?: PerfEmpItemPerKPIScoreProps;
  keyScore: string;
  keyScoreId: string;
  keyWeightScore: string;
  label: string;
  formLevel: PerfLevelEnum;
  userLevel: PerfLevelEnum;
  editable?: boolean;
  measurementOptions: DropdownOptions[];
  measurementGrades: PerfMeasurementGradeProps[];
  weight: number;
  totalWeight: number;
  isKPIWeightCalc?: boolean;
  onChangeScore: (
    levels: PerfLevelEnum[],
    perfEmpItems: PerfEmpItemProps[],
    perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
  ) => void;
  indexEmpItem: number;
  indexEmpItemKPI: number;
  perfEmpItems: PerfEmpItemProps[];
  isView?: boolean;
  allKPI: any;
}

const InputScorePerfMid = ({
  formik,
  name,
  scoreObj,
  keyScore,
  keyScoreId,
  keyWeightScore,
  label,
  formLevel,
  userLevel,
  editable,
  measurementOptions,
  measurementGrades,
  weight,
  totalWeight,
  isKPIWeightCalc,
  onChangeScore,
  indexEmpItem,
  indexEmpItemKPI,
  perfEmpItems,
  isView,
  allKPI,
}: InputScorePerfMidProps) => {
  const isCheckedView = useMemo(() => {
    let check = false;
    if (isView) {
      const status = get(formik?.values, 'status') || '';
      const timeline = get(formik?.values, 'timelineSeq.timeline') || '';
      if (
        status == 'DRAFT' &&
        userLevel.includes('MANAGER') &&
        timeline == timelineEnum.MID_YEAR_COACHING_SELF
      )
        check = true;
    }
    return check;
  }, [formik.values, formLevel, userLevel]);
  const onChange = useCallback(
    (value) => {
      const score =
        find(measurementGrades, (grade) => grade?.id === value)?.point || 0;
      const weightScore = calculateWeightScorePerfKPI({
        score,
        weightKPI: weight,
        totalWeight,
        isKPIWeightCalc,
      });

      formik.setFieldValue(`${name}.[${keyScoreId}]`, value);
      formik.setFieldValue(`${name}.[${keyScore}]`, score);
      formik.setFieldValue(`${name}.[${keyWeightScore}]`, weightScore);
      formik.setFieldValue(
        `${name}.scores.midBySelf.type`,
        PerfLevelEnum.APPRAISEE,
      );
      formik.setFieldValue(
        `${name}.scores.midByDM.type`,
        PerfLevelEnum.DIRECT_MANAGER,
      );
      formik.setFieldValue(
        `${name}.scores.midByAboveDM.type`,
        PerfLevelEnum.ABOVE_MANAGER,
      );
      formik.setFieldValue(`${name}.scores.midBySelf.isMidYear`, true);
      formik.setFieldValue(`${name}.scores.midByDM.isMidYear`, true);
      formik.setFieldValue(`${name}.scores.midByAboveDM.isMidYear`, true);

      const currPerfEmpItems = cloneDeep(perfEmpItems);
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[indexEmpItemKPI],
      //   keyScoreId,
      //   value,
      // );
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[indexEmpItemKPI],
      //   keyScore,
      //   score,
      // );
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[indexEmpItemKPI],
      //   keyWeightScore,
      //   weightScore,
      // );
      // const perfEmpItemPerKPI = cloneDeep(itemPerKPI);
      // set(perfEmpItemPerKPI[indexEmpItemKPI], keyScoreId, value);
      // set(perfEmpItemPerKPI[indexEmpItemKPI], keyScore, score);
      // set(perfEmpItemPerKPI[indexEmpItemKPI], keyWeightScore, weightScore);
      const kpiItems = cloneDeep(allKPI);
      const empItemIdx = currPerfEmpItems[indexEmpItem];
      const items = kpiItems[empItemIdx?.id];
      set(items[indexEmpItemKPI], keyScoreId, value);
      set(items[indexEmpItemKPI], keyScore, score);
      set(items[indexEmpItemKPI], keyWeightScore, weightScore);
      onChangeScore([formLevel], currPerfEmpItems, kpiItems);
    },
    [
      measurementGrades,
      weight,
      totalWeight,
      isKPIWeightCalc,
      formik,
      name,
      keyScoreId,
      keyScore,
      keyWeightScore,
      userLevel,
      onChangeScore,
      formLevel,
      indexEmpItem,
      indexEmpItemKPI,
      perfEmpItems,
    ],
  );

  const localIsAbsoluteScore = useMemo(
    () => scoreObj?.isAbsoluteScore,
    [scoreObj?.isAbsoluteScore],
  );

  useEffect(() => {
    if (
      formLevel == 'APPRAISEE' &&
      userLevel == 'DIRECT_MANAGER' &&
      isView == false
    ) {
      const currVal = get(formik?.values, name) || [];
      const newOpt: PerfEmpItemPerKPIScoreProps = {
        note: currVal?.scores?.midByDM?.note || '',
        type: PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
        scoreId:
          currVal?.scores?.midByDM?.scoreId ||
          currVal?.scores?.midBySelf?.scoreId,
        isMidYear: true,
        weightScore:
          currVal?.scores?.midByDM?.weightScore ||
          currVal?.scores?.midBySelf?.weightScore,
        isAbsoluteScore:
          currVal?.scores?.midByDM?.isAbsoluteScore ||
          currVal?.scores?.midBySelf?.isAbsoluteScore,
        score:
          currVal?.scores?.midByDM?.score || currVal?.scores?.midBySelf?.score,
      };
      formik.setFieldValue(`${name}.scores.midByDM`, newOpt);
    }

    if (
      formLevel == 'DIRECT_MANAGER' &&
      userLevel == 'ABOVE_MANAGER' &&
      isView == false
    ) {
      const currVal = get(formik?.values, name) || [];
      const newOpt: PerfEmpItemPerKPIScoreProps = {
        note: currVal?.scores?.midByAboveDM?.note || '',
        type: PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
        scoreId:
          currVal?.scores?.midByAboveDM?.scoreId ||
          currVal?.scores?.midByDM?.scoreId,
        isMidYear: true,
        weightScore:
          currVal?.scores?.midByAboveDM?.weightScore ||
          currVal?.scores?.midByDM?.weightScore,
        isAbsoluteScore:
          currVal?.scores?.midByAboveDM?.isAbsoluteScore ||
          currVal?.scores?.midByDM?.isAbsoluteScore,
        score:
          currVal?.scores?.midByAboveDM?.score ||
          currVal?.scores?.midByDM?.score,
      };
      formik.setFieldValue(`${name}.scores.midByAboveDM`, newOpt);
    }

    if (isCheckedView) {
      const currVal = get(formik?.values, name) || [];
      if (!currVal?.scores?.midBySelf?.isAbsoluteScore) {
        const newOpt: PerfEmpItemPerKPIScoreProps = {
          note: '',
          type: PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
          scoreId: null || '',
          isMidYear: true,
          weightScore: 0,
          isAbsoluteScore: false,
          score: 0,
        };
        formik.setFieldValue(`${name}.scores.midByDM`, newOpt);
      }
    }
  }, []);

  return (
    <>
      {localIsAbsoluteScore ? (
        <Popup
          content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
          trigger={
            <span>
              <InputDropdownSimple
                formik={formik}
                name={`${name}.[${keyScoreId}]`}
                options={measurementOptions}
                placeholder={'Score'}
                label={label}
                disabled={
                  !(
                    editable &&
                    formLevel === userLevel &&
                    !localIsAbsoluteScore
                  )
                }
                className={`bg-disable-input`}
                onChange={onChange}
                isExclamation
              />
            </span>
          }
        />
      ) : (
        <InputDropdownSimple
          formik={formik}
          name={`${name}.[${keyScoreId}]`}
          options={measurementOptions}
          placeholder={'Score'}
          label={label}
          disabled={
            !(editable && formLevel === userLevel && !localIsAbsoluteScore)
          }
          className={`bg-disable-input`}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default InputScorePerfMid;
