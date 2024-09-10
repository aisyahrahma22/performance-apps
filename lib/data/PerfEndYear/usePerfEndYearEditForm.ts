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
import { PerfLevelEnum } from '../perfMidYear/enum/perfForm.enum';
// import { calculatePerfTypeScoreAll } from '../perfMidYear/helpers/calculation';
import { generateInitialPerfEmp } from '../perfMidYear/helpers/generateInitialValuePerfEmp';
import { PerfEmpProps } from '../perfMidYear/interfaces/perfEmp.interface';
import usePerfEmpRecall from '../perfMidYear/usePerfMidYearRecall';
import usePerfEmpRecallValidation from '../perfMidYear/usePerfMidYearRecallValidation';
import { validationPerfEndYearForm } from './helpers/validation';
import usePerfEndYear from './usePerfEndYear';
import { endYearYupSchema } from './hooks/schemaValidationEndYear';

type UsePerfEndYearEditFormProps = {
  id: string;
  isApproval?: boolean;
  onSubmit?: any;
  onClose?: any;
  isEndYear?: boolean;
};

const usePerfEndYearEditForm = ({
  id,
  isApproval = false,
  onSubmit,
  onClose,
  isEndYear = true,
}: UsePerfEndYearEditFormProps) => {
  const { perfEndYear, isPerfEndYearLoading, isPerfEndYearError } =
    usePerfEndYear(id, isApproval);

  const [activeFormTypeId, setActiveFormTypeId] = useState('');
  const initialValues = useMemo(() => {
    if (isApproval)
      return generateInitialPerfEmp(
        perfEndYear?.perfEmployee,
        perfEndYear,
        true,
        perfEndYear?.perfEmployee?.siloamValue,
        perfEndYear?.perfEmployee?.demonstrateKPISiloamValue,
      );
    return generateInitialPerfEmp(perfEndYear, null, true);
  }, [isApproval, perfEndYear]);

  useEffect(() => {
    const firstFormTypeId = initialValues?.perfForm?.perfFormTypes?.[0]?.id;
    if (!activeFormTypeId && firstFormTypeId) {
      setActiveFormTypeId(firstFormTypeId);
    }
  }, [activeFormTypeId, initialValues]);

  const formikEndYear = useFormik({
    initialValues,
    validationSchema: endYearYupSchema(perfEndYear, isApproval),
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const notesArr: PerfEmpNote[] = [];

      if (values?.notes) {
        Object.keys(values?.notes).forEach((key) => {
          if (key === TimelineNoteType.END_YEAR) {
            if (values.notes?.END_YEAR?.APPRAISEE != undefined) {
              values.notes.END_YEAR.APPRAISEE.type =
                PerfGoalSettingNoteType.APPRAISEE;
              notesArr.push(values.notes.END_YEAR.APPRAISEE);
            }

            if (values.notes?.END_YEAR?.DIRECT_MANAGER != undefined) {
              values.notes.END_YEAR.DIRECT_MANAGER.type =
                PerfGoalSettingNoteType.DIRECT_MANAGER;
              notesArr.push(values.notes.END_YEAR.DIRECT_MANAGER);
            }

            if (values.notes?.END_YEAR?.ABOVE_MANAGER != undefined) {
              values.notes.END_YEAR.ABOVE_MANAGER.type =
                PerfGoalSettingNoteType.ABOVE_MANAGER;
              notesArr.push(values.notes.END_YEAR.ABOVE_MANAGER);
            }
          }
        });
      }
      // const perfTypeScores = calculatePerfTypeScoreAll(values, isEndYear);

      const timeline: timelineEnum =
        values?.timelineSeq?.timeline ||
        (isApproval
          ? timelineEnum.END_YEAR_DIRECT_MANAGER
          : timelineEnum.END_YEAR_APPRAISEE);
      const perfEmp: PerfEmpProps & { timeline: timelineEnum; notes: any } = {
        ...values,
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
          notes: notesArr,
        };
        onSubmit?.(perfSup);
      } else {
        onSubmit?.(perfEmp);
      }
    },
  });

  const activePerfTypeScore = useMemo(() => {
    const perfForm = get(formikEndYear.values, 'perfForm');
    const perfType = find(
      perfForm?.perfFormTypes,
      (type) => type?.id === activeFormTypeId,
    );

    const perfTypeScores = get(formikEndYear.values, 'perfTypeScores');

    const perfDataGradeFinal =
      perfEndYear?.perfEmployee?.perfForm?.perfProgram
        ?.perfMeasurementFinalTemplate?.dataGradeFinal ||
      perfEndYear?.perfForm?.perfProgram?.perfMeasurementFinalTemplate
        ?.dataGradeFinal ||
      [];
    return {
      data: perfTypeScores?.[activeFormTypeId],
      grades: perfDataGradeFinal,
      isMidYearScore: perfType?.isMidYearScore || false,
      endYear: true,
    };
  }, [activeFormTypeId, formikEndYear]);

  const level = useMemo(() => {
    if (!isApproval) return PerfLevelEnum.APPRAISEE;
    if (perfEndYear?.level >= 2) return PerfLevelEnum.ABOVE_MANAGER;
    return PerfLevelEnum.DIRECT_MANAGER;
  }, [perfEndYear, isApproval]);

  const _onSaveDraftSelf = useCallback(async () => {
    // const perfEmp = formikEndYear.values;
    // const { isValid, errors } = validationPerfEndYearForm(perfEmp, level);
    // if (isValid) {
    //   formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.DRAFT);
    //   formikEndYear.handleSubmit();
    // } else {
    //   forEach(errors, (error) => {
    //     toast.error(error);
    //   });
    // }

    // bypass validation for saveAsDraftSelf
    await formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.DRAFT);
    formikEndYear.handleSubmit();
  }, [formikEndYear, level]);

  const _onSaveRequestSelf = useCallback(async () => {
    await formikEndYear.setFieldValue(
      'status',
      PerfEmployeeStatusEnum.IN_PROGRESS,
    );
    const perfEmp = formikEndYear.values;
    const { isValid, errors } = validationPerfEndYearForm(perfEmp, level);
    if (isValid) {
      formikEndYear.handleSubmit();
    } else {
      forEach(errors, (error) => {
        formikEndYear.validateForm();
        toast.error(error);
      });
    }
  }, [formikEndYear, level]);

  const _onSaveDraftManager = useCallback(async () => {
    // const perfEmp = formikEndYear.values;
    // const { isValid, errors } = validationPerfEndYearForm(perfEmp, level);
    // if (isValid) {
    //   formikEndYear.setFieldValue(
    //     'perfSup.status',
    //     PerfSuperiorStatusEnum.DRAFT,
    //   );
    //   formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.IN_PROGRESS);
    //   formikEndYear.handleSubmit();
    // } else {
    //   forEach(errors, (error) => {
    //     toast.error(error);
    //   });
    // }

    // bypass validation for saveAsDraftManager
    await formikEndYear.setFieldValue(
      'perfSup.status',
      PerfSuperiorStatusEnum.DRAFT,
    );
    formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.IN_PROGRESS);
    formikEndYear.handleSubmit();
  }, [formikEndYear, level]);

  const _onSaveReviseManager = useCallback(async () => {
    // const perfEmp = formikEndYear.values;
    // const { isValid, errors } = validationPerfEndYearForm(perfEmp, level);
    await formikEndYear.setFieldValue(
      'perfSup.status',
      PerfSuperiorStatusEnum.REVISED,
    );
    formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.REVISED);
    formikEndYear.handleSubmit();
    // if (isValid) {

    // } else {
    //   forEach(errors, (error) => {
    //     toast.error(error);
    //   });
    // }
  }, [formikEndYear, level]);

  const _onSaveApproveManager = useCallback(async () => {
    const perfEmp = formikEndYear.values;
    const { isValid, errors } = validationPerfEndYearForm(perfEmp, level);
    if (isValid) {
      await formikEndYear.setFieldValue(
        'perfSup.status',
        PerfSuperiorStatusEnum.APPROVED,
      );
      formikEndYear.setFieldValue('status', PerfEmployeeStatusEnum.IN_PROGRESS);
      formikEndYear.handleSubmit();
    } else {
      forEach(errors, (error) => {
        toast.error(error);
      });
    }
  }, [formikEndYear, level]);

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

  const { perfEmpRecallPosting, isPerfEmpRecallLoading } = usePerfEmpRecall(
    {
      onSuccess: onClose,
    },
    (isEndYear = true),
  );

  const isValidRecall = useMemo(() => {
    if (
      perfEndYear?.level >= 2 &&
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
  }, [isApproval, perfEmpRecallValidation, initialValues, perfEndYear]);

  const _onRecall = useCallback(() => {
    perfEmpRecallPosting(id, isApproval);
  }, [id, perfEmpRecallPosting, isApproval]);

  return {
    perfEndYear,
    level,
    perfEmp: initialValues,
    perfForm: initialValues?.perfForm,
    revise: perfEndYear?.revise,
    notes: mapGoalSettingNotes(perfEndYear?.notes, false, true),
    formikEndYear,
    isLoading: isPerfEndYearLoading || isPerfEmpRecallValidationLoading,
    errorMessage: isPerfEndYearError?.response?.data?.message || '',
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
    perfEndYearRecall: _onRecall,
    isPerfEmpRecallLoading,
  };
};

export default usePerfEndYearEditForm;
