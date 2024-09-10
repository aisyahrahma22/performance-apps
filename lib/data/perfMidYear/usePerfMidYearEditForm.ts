import { useFormik } from 'formik';
import { find, forEach, get } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import mapGoalSettingNotes from '../../../components/performanceGoalSetting/helpers/mapGoalSettingNotes';
import { PerfEmpNote } from '../../../components/performanceGoalSetting/types/goalSettingTypes';
import {
  PerfGoalSettingNoteType,
  TimelineNoteType,
} from '../../enums/GoalSetting';
import {
  PerfSuperiorStatusEnum,
  timelineEnum,
} from '../../enums/PerformanceEnum';
import { PerfEmployeeStatusEnum } from '../../enums/TimelineStatusEnum';
import { PerfLevelEnum } from './enum/perfForm.enum';
// import { calculatePerfTypeScoreAll } from './helpers/calculation';
import { generateInitialPerfEmp } from './helpers/generateInitialValuePerfEmp';
import {
  // validationMidYearFormWeightOnly,
  validationPerfMidYearForm,
} from './helpers/validation';
import { PerfEmpProps } from './interfaces/perfEmp.interface';
import usePerfMidYear from './usePerfMidYear';
import usePerfMidYearRecall from './usePerfMidYearRecall';
import usePerfEmpRecallValidation from './usePerfMidYearRecallValidation';
import { midYearYupSchema } from './hooks/schemaValidationMidYear';

type UsePerfMidYearEditFormProps = {
  id: string;
  isApproval?: boolean;
  onSubmit?: any;
  onClose?: any;
  isEndYear?: boolean;
};

const usePerfMidYearEditForm = ({
  id,
  isApproval = false,
  onSubmit,
  onClose,
  isEndYear = false,
}: UsePerfMidYearEditFormProps) => {
  const { perfMidYear, isPerfMidYearLoading, isPerfMidYearError } =
    usePerfMidYear(id, isApproval);
  const [activeFormTypeId, setActiveFormTypeId] = useState('');
  const initialValues = useMemo(() => {
    if (isApproval)
      return generateInitialPerfEmp(
        perfMidYear?.perfEmployee,
        perfMidYear,
        false,
        null,
        null,
      );
    return generateInitialPerfEmp(perfMidYear, null, false, null, null);
  }, [perfMidYear, isApproval]);

  useEffect(() => {
    const firstFormTypeId = initialValues?.perfForm?.perfFormTypes?.[0]?.id;
    if (!activeFormTypeId && firstFormTypeId) {
      setActiveFormTypeId(firstFormTypeId);
    }
  }, [activeFormTypeId, initialValues, perfMidYear]);

  const formikMidYear = useFormik({
    initialValues,
    validationSchema: midYearYupSchema(perfMidYear, isApproval),
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const notesArr: PerfEmpNote[] = [];
      if (values?.notes) {
        Object.keys(values?.notes).forEach((key) => {
          if (key === TimelineNoteType.MID_YEAR) {
            if (values.notes?.MID_YEAR?.APPRAISEE != undefined) {
              values.notes.MID_YEAR.APPRAISEE.type =
                PerfGoalSettingNoteType.APPRAISEE;
              notesArr.push(values.notes.MID_YEAR.APPRAISEE);
            }

            if (values.notes?.MID_YEAR?.DIRECT_MANAGER != undefined) {
              values.notes.MID_YEAR.DIRECT_MANAGER.type =
                PerfGoalSettingNoteType.DIRECT_MANAGER;
              notesArr.push(values.notes.MID_YEAR.DIRECT_MANAGER);
            }

            if (values.notes?.MID_YEAR?.ABOVE_MANAGER != undefined) {
              values.notes.MID_YEAR.ABOVE_MANAGER.type =
                PerfGoalSettingNoteType.ABOVE_MANAGER;
              notesArr.push(values.notes.MID_YEAR.ABOVE_MANAGER);
            }
          }
        });
      }
      // const perfTypeScores = calculatePerfTypeScoreAll(values, isEndYear);
      const timeline: timelineEnum =
        values?.timelineSeq?.timeline ||
        (isApproval
          ? timelineEnum.MID_YEAR_COACHING_DIRECT_MANAGER
          : timelineEnum.MID_YEAR_COACHING_SELF);
      const perfEmp: PerfEmpProps & { timeline: timelineEnum; notes: any } = {
        ...values,
        // itemsPerKPIs: itemPerKPIArr,
        // perfTypeScores,
        timeline,
        notes: notesArr,
      };

      if (isApproval) {
        const perfSup = {
          id,
          status: values?.perfSup?.status,
          level: values?.perfSup?.level,
          type: values?.perfSup?.type,
          perfEmp,
          // itemsPerKPIs: itemPerKPIArr,
          notes: notesArr,
        };
        onSubmit?.(perfSup);
      } else {
        onSubmit?.(perfEmp);
      }
    },
  });

  const activePerfTypeScore = useMemo(() => {
    const perfForm = get(formikMidYear.values, 'perfForm');
    const perfType = find(
      perfForm?.perfFormTypes,
      (type) => type?.id === activeFormTypeId,
    );
    const perfTypeScores = get(formikMidYear.values, 'perfTypeScores');

    const perfDataGradeFinal =
      perfMidYear?.perfEmployee?.perfForm?.perfProgram
        ?.perfMeasurementFinalTemplate?.dataGradeFinal ||
      perfMidYear?.perfForm?.perfProgram?.perfMeasurementFinalTemplate
        ?.dataGradeFinal ||
      [];

    return {
      data: perfTypeScores?.[activeFormTypeId],
      grades: perfDataGradeFinal,
      isMidYearScore: perfType?.isMidYearScore || false,
      endYear: false,
    };
  }, [activeFormTypeId, formikMidYear]);

  const level = useMemo(() => {
    if (!isApproval) return PerfLevelEnum.APPRAISEE;
    if (perfMidYear?.level >= 2) return PerfLevelEnum.ABOVE_MANAGER;
    return PerfLevelEnum.DIRECT_MANAGER;
  }, [perfMidYear, isApproval]);

  const _onSaveDraftSelf = useCallback(async () => {
    await formikMidYear.setFieldValue('status', PerfEmployeeStatusEnum.DRAFT);
    formikMidYear.handleSubmit();
  }, [formikMidYear]);

  const _onSaveRequestSelf = useCallback(async () => {
    await formikMidYear.setFieldValue(
      'status',
      PerfEmployeeStatusEnum.IN_PROGRESS,
    );
    const perfEmp = formikMidYear.values;
    const { isValid, errors } = validationPerfMidYearForm(perfEmp, level);
    if (isValid) {
      formikMidYear.handleSubmit();
    } else {
      formikMidYear.validateForm();
      forEach(errors, (error) => {
        toast.error(error);
      });
    }
  }, [formikMidYear, level]);

  const _onSaveDraftManager = useCallback(async () => {
    // bypass validation for saveAsDraftManager
    await formikMidYear.setFieldValue(
      'perfSup.status',
      PerfSuperiorStatusEnum.DRAFT,
    );
    formikMidYear.setFieldValue('status', PerfEmployeeStatusEnum.IN_PROGRESS);
    formikMidYear.handleSubmit();
  }, [formikMidYear, level]);

  const _onSaveReviseManager = useCallback(async () => {
    /**
     * Ticket HCMS-2839 error on validation height 100% on ADM/DM midyear, Request To Revise form will be not validated
     */
    await formikMidYear.setFieldValue(
      'perfSup.status',
      PerfSuperiorStatusEnum.REVISED,
    );
    formikMidYear.setFieldValue('status', PerfEmployeeStatusEnum.REVISED);
    formikMidYear.handleSubmit();

    // const perfEmp = formikMidYear.values;
    // const { isValid, errors } = validationMidYearFormWeightOnly(perfEmp, level);
    // if (isValid) {
    //   await formikMidYear.setFieldValue(
    //     'perfSup.status',
    //     PerfSuperiorStatusEnum.REVISED,
    //   );
    //   formikMidYear.setFieldValue('status', PerfEmployeeStatusEnum.REVISED);
    //   formikMidYear.handleSubmit();
    // } else {
    //   forEach(errors, (error) => {
    //     toast.error(error);
    //   });
    // }
  }, [formikMidYear, level]);

  const _onSaveApproveManager = useCallback(async () => {
    const perfEmp = formikMidYear.values;
    const { isValid, errors } = validationPerfMidYearForm(perfEmp, level);
    if (isValid) {
      await formikMidYear.setFieldValue(
        'perfSup.status',
        PerfSuperiorStatusEnum.APPROVED,
      );
      formikMidYear.setFieldValue('status', PerfEmployeeStatusEnum.IN_PROGRESS);
      formikMidYear.handleSubmit();
    } else {
      forEach(errors, (error) => {
        toast.error(error);
      });
    }
  }, [formikMidYear, level]);

  // Modal Exit Confirmation
  const [isModalExit, setIsModalExit] = useState(false);

  const modalExitOpenPress = useCallback(() => {
    setIsModalExit(true);
  }, []);

  const modalExitClosePress = useCallback(() => {
    setIsModalExit(false);
  }, []);

  const modalExitActionPress = useCallback(() => {
    onClose?.();
    setIsModalExit(false);
  }, [onClose]);

  // Recall
  const { perfEmpRecallValidation, isPerfEmpRecallValidationLoading } =
    usePerfEmpRecallValidation(id, isApproval, isEndYear);

  const { perfEmpRecallPosting, isPerfEmpRecallLoading } = usePerfMidYearRecall(
    {
      onSuccess: onClose,
    },
    (isEndYear = false),
  );

  const isValidRecall = useMemo(() => {
    if (
      perfMidYear?.level >= 2 &&
      perfEmpRecallValidation?.isMultipleLevelManager
    ) {
      return { multipleLevel: perfEmpRecallValidation?.isMultipleLevelManager };
    } else {
      return perfEmpRecallValidation?.isValid || (false as boolean);
    }

    // const isValid: boolean = perfEmpRecallValidation?.isValid || false;
    // if (!isApproval) return isValid;

    // const currApprovalStatus = initialValues?.perfSup?.status;
    // if (!currApprovalStatus) return false;
    // if (
    //   [
    //     PerfSuperiorStatusEnum.PENDING,
    //     PerfSuperiorStatusEnum.NO_APPROVAL,
    //   ].includes(currApprovalStatus)
    // ) {
    //   return false;
    // }

    // return isValid;
  }, [
    perfEmpRecallValidation,
    perfMidYear,
    // isApproval, initialValues
  ]);

  const _onRecall = useCallback(() => {
    perfEmpRecallPosting(id, isApproval);
  }, [id, perfEmpRecallPosting, isApproval]);

  return {
    perfMidYear,
    level,
    notes: mapGoalSettingNotes(perfMidYear?.notes, true, false),
    perfEmp: initialValues,
    perfForm: initialValues?.perfForm,
    revise: perfMidYear?.revise,
    formikMidYear,
    isLoading: isPerfMidYearLoading || isPerfEmpRecallValidationLoading,
    errorMessage: isPerfMidYearError?.response?.data?.message || '',
    activeFormTypeId,
    setActiveFormTypeId,
    activePerfTypeScore,
    onSaveDraftSelf: _onSaveDraftSelf,
    onSaveRequestSelf: _onSaveRequestSelf,
    onSaveDraftManager: _onSaveDraftManager,
    onSaveReviseManager: _onSaveReviseManager,
    onSaveApproveManager: _onSaveApproveManager,
    isModalExit,
    modalExitOpenPress,
    modalExitClosePress,
    modalExitActionPress,
    isValidRecall,
    perfMidYearRecall: _onRecall,
    isPerfEmpRecallLoading,
  };
};

export default usePerfMidYearEditForm;
