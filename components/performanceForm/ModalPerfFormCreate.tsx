import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import usePerformancesCreateForm from '../../lib/data/performanceForm/usePerformanceFormCreate';
import usePerformanceProgram from '../../lib/data/performanceForm/usePerformanceProgram';
import { timelinesData } from './helpers/timelineData';
import { PerfFormStatusEnum } from '../../lib/enums/PerfForm';
import {
  PerfFormContextProvider,
  usePerfFormContext,
} from './contexts/PerfFormContext';
import useFormikPerfForm from './hooks/useFormikPerfForm';
import { PerfFromRequestDataFormProps } from './types/perfForm';
import useImmutableFormik from '../../lib/hooks/useImmutableFormik';
import BaseModalPerformanceFormTransaction from './components/BaseModalPerformanceFormTransaction';

interface ModalPerformanceCreateProps {
  isOpen: boolean;
  closePress: () => void;
}

const initialPerformanceFormValue: PerfFromRequestDataFormProps = {
  performanceFormCode: '',
  isCaptureSiloamValue: false,
  perfProgramId: '',
  perfFormName: '',
  dataPosition: [],
  dataEmployee: [],
  dataPerfType: [],
  sequences: timelinesData,
};

const ModalPerfFormCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceCreateProps) => {
  return (
    <PerfFormContextProvider>
      <ModalPerfFormCreateComponent isOpen={isOpen} closePress={closePress} />
    </PerfFormContextProvider>
  );
};

const ModalPerfFormCreateComponent = ({
  isOpen,
  closePress,
}: ModalPerformanceCreateProps) => {
  const { performanceFormCreatePosting, isPerformanceFormCreateLoading } =
    usePerformancesCreateForm({
      onSuccess: closePress,
    });

  const { programId, setProgramId } = usePerfFormContext();
  const { performanceProgram } = usePerformanceProgram(programId);

  const formikPerformanceCreate = useFormikPerfForm(
    initialPerformanceFormValue,
    (values) => {
      performanceFormCreatePosting(values);
    },
  );
  const { setFieldValue: immutableSetFieldValue } = useImmutableFormik(
    formikPerformanceCreate,
  );

  const submitForm = useCallback(
    async (status: PerfFormStatusEnum) => {
      await formikPerformanceCreate.setFieldValue('status', status);

      const validationResult = await formikPerformanceCreate.validateForm();
      if (Object.keys(validationResult).length > 0) {
        toast.error(
          'There is some invalid format from your form field. Please fill all of it with appropriate value/item length',
          { autoClose: false },
        );
      } else formikPerformanceCreate.handleSubmit();
    },
    [formikPerformanceCreate],
  );

  useEffect(() => {
    if (!programId || programId.split('').length <= 0) return;
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

  return (
    <BaseModalPerformanceFormTransaction
      formik={formikPerformanceCreate}
      isOpen={isOpen}
      closePress={closePress}
      isPerformanceFormTranscLoading={false}
      performanceProgram={performanceProgram}
      onChangePerfProgram={onChangePerfProgram}
      submitForm={submitForm}
      performanceFormResponse={undefined}
      isLoading={isPerformanceFormCreateLoading}
    />
  );
};

export default ModalPerfFormCreate;
