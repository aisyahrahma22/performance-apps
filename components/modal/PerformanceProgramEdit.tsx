import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceProgram from '../../lib/data/performanceProgram/usePerformanceProgram';
import usePerformancesProgramEdit from '../../lib/data/performanceProgram/usePerformanceProgramEdit';
import InputDropdownSimple from '../InputDropdownSimple';
import DatePicker, { dateStringFormat } from '../DatePicker';
import {
  finalResultMethodEnumOptionsDropdown,
  formMemberEnumOptionsDropdown,
  formTermOptionsDropdown,
} from '../../helper/perfProgram';
import yupParseDate from '../../lib/util/yupParseDate';
import renderDate from '../../lib/util/renderDate';
import { PerfProgramRequestData } from '../../lib/data/performanceProgram/interfaces/perfProgramCreate';
import { getPerfMeasurementFinalResult } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalResult';
import InputDropdownRemote from '../InputDropdownRemote';

interface ModalPerformanceProgramEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceProgramEditSchema = yup.object({
  code: yup
    .string()
    .trim()
    .max(32, 'Code cannot exceed 32 characters')
    .required('Please enter a valid code'),
  name: yup
    .string()
    .trim()
    .max(128, 'Name cannot exceed 128 characters')
    .required('Please enter a valid name'),
  startDate: yup
    .date()
    .transform(yupParseDate(dateStringFormat))
    .typeError('Please provide a valid date format for Start Date')
    .required('Start Date is required'),
  endDate: yup
    .date()
    .transform(yupParseDate(dateStringFormat))
    .typeError('Please provide a valid date format for End Date')
    .min(yup.ref('startDate'), 'End Date should be later than Start Date')
    .required('End Date is required'),
});

const ModalPerformanceProgramEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceProgramEditProps) => {
  const { performanceProgram, isPerformanceProgramLoading } =
    usePerformanceProgram(id);
  const { performanceProgramEdit, isPerformanceProgramEditLoading } =
    usePerformancesProgramEdit({
      onSuccess: closePress,
    });

  const initialPerProgram = useMemo(() => {
    const requestData: PerfProgramRequestData = {
      code: performanceProgram?.code,
      name: performanceProgram?.name,
      perfMeasurementFinalTemplateId:
        performanceProgram?.perfMeasurementFinalTemplateId,
      formTerm: performanceProgram?.formTerm,
      finalResultMethod: performanceProgram?.finalResultMethod,
      formMember: performanceProgram?.formMember,
      startDate: renderDate(performanceProgram?.startDate),
      endDate: renderDate(performanceProgram?.endDate),
    };
    return requestData;
  }, [performanceProgram]);

  const formikPerformanceProgramEdit = useFormik({
    initialValues: initialPerProgram,
    enableReinitialize: true,
    onSubmit: (values) => {
      performanceProgramEdit({ ...values, id });
    },
    validationSchema: formPerformanceProgramEditSchema,
  });

  const initFinalScoreDropdown = useMemo(() => {
    return performanceProgram?.perfMeasurementFinalTemplate
      ? [
          {
            key: performanceProgram?.perfMeasurementFinalTemplate?.id,
            value: performanceProgram?.perfMeasurementFinalTemplate?.id,
            text: performanceProgram?.perfMeasurementFinalTemplate
              ?.measurementName,
          },
        ]
      : [];
  }, [performanceProgram?.perfMeasurementFinalTemplate]);

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="black">
          <Icon name={'edit'} circular />
          <Header.Content>
            Edit Form
            <Header.Subheader>Program Performance</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-Edit-form'}
          loading={
            isPerformanceProgramEditLoading || isPerformanceProgramLoading
          }
        >
          <Input
            placeholder={'Input Code Program'}
            label={'Code Program'}
            formik={formikPerformanceProgramEdit}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Input Program Name'}
            label={'Program Name'}
            formik={formikPerformanceProgramEdit}
            name={'name'}
            type={'text'}
            fluid
          />
          <InputDropdownRemote
            formik={formikPerformanceProgramEdit}
            name={'perfMeasurementFinalTemplateId'}
            label={'Grade Final'}
            placeholder={'Grade Final'}
            apiFetcher={getPerfMeasurementFinalResult}
            apiSearchKeys={['measurementName', 'date']}
            apiTextKey={'measurementName'}
            apiValueKey={'id'}
            initialOptions={initFinalScoreDropdown}
          />
          <InputDropdownSimple
            placeholder={'Term Form'}
            label={'Term Form'}
            formik={formikPerformanceProgramEdit}
            name={'formTerm'}
            options={formTermOptionsDropdown}
          />
          <InputDropdownSimple
            placeholder={'Method of Final Result'}
            label={'Method of Final Result'}
            formik={formikPerformanceProgramEdit}
            name={'finalResultMethod'}
            options={finalResultMethodEnumOptionsDropdown}
          />
          <InputDropdownSimple
            placeholder={'Member Form'}
            label={'Member Form'}
            formik={formikPerformanceProgramEdit}
            name={'formMember'}
            options={formMemberEnumOptionsDropdown}
          />
          <DatePicker
            name={'startDate'}
            placeholder={'31-01-2022'}
            label={'Star'}
            formik={formikPerformanceProgramEdit}
            dateOnly
          />
          <DatePicker
            name={'endDate'}
            placeholder={'31-01-2022'}
            label={'End'}
            formik={formikPerformanceProgramEdit}
            dateOnly
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              secondary
              size={'large'}
              type={'submit'}
              form={'performance-Edit-form'}
              onClick={formikPerformanceProgramEdit.handleSubmit as any}
              disabled={!formikPerformanceProgramEdit.isValid}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceProgramEdit;
