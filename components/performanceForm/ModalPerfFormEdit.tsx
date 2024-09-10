import React, { useCallback, useEffect } from 'react';
import { PerfFormStatusEnum } from '../../lib/enums/PerfForm';
import usePerformancesFormEdit from '../../lib/data/performanceForm/usePerformancesFormEdit';
import usePerformanceProgram from '../../lib/data/performanceForm/usePerformanceProgram';
import useImmutableFormik from '../../lib/hooks/useImmutableFormik';
import usePerfFormSelectedValue from './hooks/useFormikPerfForm';
import BaseModalPerformanceFormTransaction from './components/BaseModalPerformanceFormTransaction';
import {
  PerfFormContextProvider,
  usePerfFormContext,
} from './contexts/PerfFormContext';
import { toast } from 'react-toastify';

interface ModalPerformanceEditProps {
  id: string;
  isOpen: boolean;
  closePress: () => void;
  isPublish?: boolean;
  setIsValidatePublish?: any;
}

const ModalPerformanceFormEdit = ({
  id,
  isOpen,
  closePress,
  isPublish,
  setIsValidatePublish,
}: ModalPerformanceEditProps) => {
  return (
    <PerfFormContextProvider selectedPerfFormId={id}>
      <ModalPerformanceFormEditComponent
        id={id}
        isOpen={isOpen}
        closePress={closePress}
        isPublish={isPublish}
        setIsValidatePublish={setIsValidatePublish}
      />
    </PerfFormContextProvider>
  );
};

const ModalPerformanceFormEditComponent = ({
  id,
  isOpen,
  closePress,
  isPublish,
  setIsValidatePublish,
}: ModalPerformanceEditProps) => {
  const { programId, setProgramId, initialPerfFormValue, performanceForm } =
    usePerfFormContext();
  const { performanceProgram } = usePerformanceProgram(programId);
  const { performancesFormEditPosting, isPerformancesFormEditLoading } =
    usePerformancesFormEdit({
      onSuccess: closePress,
    });

  const formikPerformanceFormEdit = usePerfFormSelectedValue(
    initialPerfFormValue,
    (values) => {
      performancesFormEditPosting({ ...values, id });
    },
    { validateOnMount: true },
  );
  const { setFieldValue: immutableSetFieldValue } = useImmutableFormik(
    formikPerformanceFormEdit,
  );

  const submitForm = useCallback(
    async (status: PerfFormStatusEnum) => {
      await formikPerformanceFormEdit.setFieldValue('status', status);
      const validationResult = await formikPerformanceFormEdit.validateForm();
      if (Object.keys(validationResult).length > 0) {
        toast.error(
          'There is some invalid format from your form field. Please fill all of it with appropriate value/item length',
          { autoClose: false },
        );
      } else {
        formikPerformanceFormEdit.handleSubmit();
      }
    },
    [formikPerformanceFormEdit],
  );

  // update value that dependend from PrefProgram (in this case, dataEmployee & dataPosition)
  // TODO: Change entire logic below without useEffect
  useEffect(() => {
    if (!programId) return;
    if (!performanceProgram || Object.keys(performanceProgram).length <= 0)
      return;

    if (performanceProgram.id === programId) {
      switch (performanceProgram.formMember) {
        case 'POSITION':
          immutableSetFieldValue('dataEmployee', []);
          break;
        case 'EMPLOYEE':
          immutableSetFieldValue('dataPosition', []);
          break;
        default:
          break;
      }
    }
  }, [immutableSetFieldValue, performanceProgram, programId]);

  const onChangePerfProgram = useCallback(
    (value) => {
      setProgramId(value.id);
    },
    [setProgramId],
  );

  useEffect(() => {
    if (isPublish && performanceProgram) {
      (async () => {
        const validationResult = await formikPerformanceFormEdit.validateForm();
        if (Object.keys(validationResult).length > 0) {
          setIsValidatePublish(false);
          toast.error(
            'There is some invalid format from your form field. Please fill all of it with appropriate value/item length',
            { autoClose: 1500 },
          );
        } else {
          setIsValidatePublish(true);
        }
      })();
    }
  }, [
    formikPerformanceFormEdit,
    isPublish,
    performanceProgram,
    setIsValidatePublish,
  ]);

  return (
    <BaseModalPerformanceFormTransaction
      isModalEdit
      formik={formikPerformanceFormEdit}
      isOpen={isOpen}
      closePress={closePress}
      isPerformanceFormTranscLoading={isPerformancesFormEditLoading}
      performanceProgram={performanceProgram}
      onChangePerfProgram={onChangePerfProgram}
      submitForm={submitForm}
      performanceFormResponse={performanceForm}
      isLoading={isPerformancesFormEditLoading}
    />
  );
};

export default ModalPerformanceFormEdit;
