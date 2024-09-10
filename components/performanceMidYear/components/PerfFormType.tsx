import { FormikProps } from 'formik';
import { find } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfFormTypeProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import { RightEnum } from '../../../lib/enums/RightEnum';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import { RenderGuard } from '../../RenderGuard';
import ModalPerfEndYearHistory from '../../performanceEndYear/modals/ModalPerfEndYearHistory';
import ModalPerformanceHistory from './ModalPerformanceHistory';
import PerfFormTypeItem from './PerfFormTypeItem';
import PerfFormTypeTab from './PerfFormTypeTab';
import { calculatePerfTypeScore } from '../../../lib/data/perfMidYear/helpers/calculation';
import TotalWeightForAllCategory from './TotalWeightForAllCategory';

interface PerformanceFormTypeProps {
  data: PerfFormTypeProps[];
  activeFormTypeId: string;
  setActiveFormTypeId: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean;
  formik: FormikProps<PerfEmpProps>;
  name: string;
  level: PerfLevelEnum;
  perfTypeScoreName: string;
  isEndYear: boolean;
  perfEmployeeId: string;
  isView?: boolean;
  perfEmpItemPerKPIName: string;
}

const PerfFormType = ({
  data,
  activeFormTypeId,
  setActiveFormTypeId,
  editable,
  formik,
  name,
  level,
  perfEmployeeId,
  isEndYear,
  perfTypeScoreName,
  isView,
  perfEmpItemPerKPIName,
}: PerformanceFormTypeProps) => {
  const activeFormType = useMemo(() => {
    const type = find(data, (val) => val?.id === activeFormTypeId);
    return type;
  }, [data, activeFormTypeId]);

  const measurementOptions = useMemo(() => {
    const options =
      activeFormType?.perfMeasurement?.grades?.map((grade) => {
        return {
          key: grade?.id,
          value: grade?.id,
          text: `${grade?.point} - ${grade?.gradeName}`,
        } as DropdownOptions;
      }) || [];
    return options;
  }, [activeFormType]);

  const onChangeScore = useCallback(
    (
      levels: PerfLevelEnum[],
      perfEmpItems: PerfEmpItemProps[],
      perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
    ) => {
      // this function for calculate live score
      if (activeFormTypeId && activeFormType) {
        // const perfEmpItems: PerfEmpItemProps[] = get(formik.values, `${name}.[${activeFormTypeId}]`)
        /* Notes: if use from formik.values, there will be a bug because value delay
        so, one way is clone deep when value changed and it's required in params
        */
        const score = calculatePerfTypeScore({
          levels,
          perfEmpItems,
          perfType: activeFormType,
          term: isEndYear ? 'END_YEAR' : 'MID_YEAR',
          perfEmpItemPerKPI,
        });

        // MID YEAR
        if (levels.includes(PerfLevelEnum.APPRAISEE) && !isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].midScoreBySelf`,
            score.midScoreBySelf,
          );
        }
        if (levels.includes(PerfLevelEnum.DIRECT_MANAGER) && !isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].midScoreByDM`,
            score.midScoreByDM,
          );
        }
        if (levels.includes(PerfLevelEnum.ABOVE_MANAGER) && !isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].midScoreByAboveDM`,
            score.midScoreByAboveDM,
          );
        }

        // END YEAR
        if (levels.includes(PerfLevelEnum.APPRAISEE) && isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].endScoreBySelf`,
            score.endScoreBySelf,
          );
        }
        if (levels.includes(PerfLevelEnum.DIRECT_MANAGER) && isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].endScoreByDM`,
            score.endScoreByDM,
          );
        }
        if (levels.includes(PerfLevelEnum.ABOVE_MANAGER) && isEndYear) {
          formik.setFieldValue(
            `${perfTypeScoreName}.[${activeFormTypeId}].endScoreByAboveDM`,
            score.endScoreByAboveDM,
          );
        }
      }
    },
    [activeFormTypeId, perfTypeScoreName, formik, name, activeFormType],
  );

  // goal setting history state modal
  // const [isModalPerfMidYearHistory, setIsModalPerfMidYearHistory] =
  //   useState(false);
  // const [modalPerfMidYearData, setModalPerfMidYearData] = useState<any>(null);

  // const [isModalPerfEndYearHistory, setIsModalPerfEndYearHistory] =
  //   useState(false);
  // const [modalPerfEndYearData, setModalPerfEndYearData] = useState<any>(null);

  const [isModalPerformanceHistory, setIsModalPerformanceHistory] =
    useState(false);
  const [modalPerformanceData, setModalPerformanceData] = useState<any>(null);
  const [isData, setIsData] = useState<any>([]);
  const [isModalScoringGuidelineList, setIsModalScoringGuidelineList] =
    useState(false);

  const modalScoringGuidelineOpenPress = useCallback(() => {
    setIsModalScoringGuidelineList(true);
  }, [isModalScoringGuidelineList]);

  const modalScoringGuidelineClosePress = useCallback(() => {
    setIsModalScoringGuidelineList(false);
  }, [isModalScoringGuidelineList]);

  // open goal setting history modal
  const modalPerformanceHistoryOpenPress = useCallback(
    (id) => () => {
      setModalPerformanceData(id);
      setIsModalPerformanceHistory((prev) => !prev);
    },
    [],
  );

  // close goal setting modal
  const modalPerormanceHistoryClosePress = useCallback(() => {
    setIsModalPerformanceHistory((prev) => !prev);
  }, []);

  useEffect(() => {
    activeFormType?.items?.map((data) => {
      setIsData(data);
    });
  }, [isData, activeFormType]);

  return (
    <>
      <PerfFormTypeTab
        data={data}
        activeFormTypeId={activeFormTypeId}
        setActiveFormTypeId={setActiveFormTypeId}
      />
      {activeFormType?.items?.map((item) => (
        <PerfFormTypeItem
          key={`perf-form-type-item-${item?.id}`}
          data={item}
          editable={editable}
          formik={formik}
          name={`${name}.[${activeFormTypeId}]`}
          formType={activeFormType}
          level={level}
          measurementOptions={measurementOptions}
          isEndYear={isEndYear}
          onChangeScore={onChangeScore}
          isView={isView}
          perfEmpItemPerKPIName={perfEmpItemPerKPIName}
        />
      ))}
      {/* Component for Total Weight (isCategory: true, isCategoryWeightCalc: false) */}
      {activeFormType?.isCategory && !activeFormType?.isCategoryWeightCalc && (
        <TotalWeightForAllCategory
          formik={formik}
          perfEmpItemObjPath={`${name}.[${activeFormTypeId}]`}
          perfEmpItemPerKPIName={perfEmpItemPerKPIName}
        />
      )}
    </>
  );
};

export default PerfFormType;
