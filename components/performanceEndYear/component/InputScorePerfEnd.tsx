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

interface InputScorePerfEndProps {
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

const InputScorePerfEnd = ({
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
}: InputScorePerfEndProps) => {
  const isCheckedView = useMemo(() => {
    let check = false;
    if (isView) {
      const status = get(formik?.values, 'status') || '';
      const timeline = get(formik?.values, 'timelineSeq.timeline') || '';
      if (
        status == 'DRAFT' &&
        userLevel.includes('MANAGER') &&
        timeline == timelineEnum.END_YEAR_APPRAISEE
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
        `${name}.scores.endBySelf.type`,
        PerfLevelEnum.APPRAISEE,
      );
      formik.setFieldValue(
        `${name}.scores.endByDM.type`,
        PerfLevelEnum.DIRECT_MANAGER,
      );
      formik.setFieldValue(
        `${name}.scores.endByAboveDM.type`,
        PerfLevelEnum.ABOVE_MANAGER,
      );

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
    /* BUGS : when viewing the modal details, the value of the exact level (ADM / DM) is still copied from previous level (e.g: ADM -> DM). Not getting ADM approved exact score */
    if (
      formLevel == 'APPRAISEE' &&
      userLevel == 'DIRECT_MANAGER' &&
      isView == false
    ) {
      const currVal = get(formik?.values, name) || [];
      const newOpt: PerfEmpItemPerKPIScoreProps = {
        note: currVal?.scores?.endByDM?.note || '',
        type: PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
        scoreId:
          currVal?.scores?.endByDM?.scoreId ||
          currVal?.scores?.endBySelf?.scoreId,
        isMidYear: false,
        weightScore:
          currVal?.scores?.endByDM?.weightScore ||
          currVal?.scores?.endBySelf?.weightScore,
        isAbsoluteScore:
          currVal?.scores?.endByDM?.isAbsoluteScore ||
          currVal?.scores?.endBySelf?.isAbsoluteScore,
        score:
          currVal?.scores?.endByDM?.score || currVal?.scores?.endBySelf?.score,
      };
      formik.setFieldValue(`${name}.scores.endByDM`, newOpt);

      /* TODO : if segment is closed, live calculated value still takes user selected value from dropdown (not reset following 1 layer below)*/
    }

    if (
      formLevel == 'DIRECT_MANAGER' &&
      userLevel == 'ABOVE_MANAGER' &&
      isView == false
    ) {
      const currVal = get(formik?.values, name) || [];
      const newOpt: PerfEmpItemPerKPIScoreProps = {
        note: currVal?.scores?.endByAboveDM?.note || '',
        type: PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
        scoreId:
          currVal?.scores?.endByAboveDM?.scoreId ||
          currVal?.scores?.endByDM?.scoreId,
        isMidYear: false,
        weightScore:
          currVal?.scores?.endByAboveDM?.weightScore ||
          currVal?.scores?.endByDM?.weightScore,
        isAbsoluteScore:
          currVal?.scores?.endByAboveDM?.isAbsoluteScore ||
          currVal?.scores?.endByDM?.isAbsoluteScore,
        score:
          currVal?.scores?.endByAboveDM?.score ||
          currVal?.scores?.endByDM?.score,
      };
      formik.setFieldValue(`${name}.scores.endByAboveDM`, newOpt);
      /* TODO : if segment is closed, live calculated value still takes user selected value from dropdown (not reset following 1 layer below)*/
    }

    if (isCheckedView) {
      const currVal = get(formik?.values, name) || [];
      if (!currVal?.scores?.endBySelf?.isAbsoluteScore) {
        const newOpt: PerfEmpItemPerKPIScoreProps = {
          note: '',
          type: PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
          scoreId: null || '',
          isMidYear: true,
          weightScore: 0,
          isAbsoluteScore: false,
          score: 0,
        };
        formik.setFieldValue(`${name}.scores.endByDM`, newOpt);
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

export default InputScorePerfEnd;
