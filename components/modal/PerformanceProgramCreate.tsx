import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import * as yup from 'yup';
import Input from '../Input';
import InputDropdownSimple from '../InputDropdownSimple';
import InputDropdownRemote from '../InputDropdownRemote';
import DatePicker, { dateStringFormat } from '../DatePicker';
import usePerformancesProgramCreate from '../../lib/data/performanceProgram/usePerformanceProgramCreate';
import {
  finalResultMethodEnumOptionsDropdown,
  formMemberEnumOptionsDropdown,
  formTermOptionsDropdown,
} from '../../helper/perfProgram';
import yupParseDate from '../../lib/util/yupParseDate';
import { getPerfMeasurementFinalResult } from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalResult';
import { PerfProgramRequestData } from '../../lib/data/performanceProgram/interfaces/perfProgramCreate';

interface ModalPerformanceProgramCreateProps {
  isOpen: boolean;
  closePress: () => void;
}

const validationSchema = yup.object().shape({
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

const ModalPerformanceProgramCreate: React.FC<ModalPerformanceProgramCreateProps> = ({
  isOpen,
  closePress,
}) => {
  const { performancesProgramCreatePosting, isPerformancesProgramCreateLoading } =
    usePerformancesProgramCreate({
      onSuccess: closePress,
    });

  const initialValues: PerfProgramRequestData = useMemo(() => ({
    code: '',
    name: '',
    formTerm: '',
    finalResultMethod: '',
    perfMeasurementFinalTemplateId: '',
    formMember: '',
    startDate: '',
    endDate: '',
  }), []);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => performancesProgramCreatePosting(values),
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as="h4" color="black">
          <Icon name="plus square outline" circular />
          <Header.Content>
            Create Form
            <Header.Subheader>Program Performance</Header.Subheader>
        </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form id="performance-create-form" loading={isPerformancesProgramCreateLoading}>
          <Input
            placeholder="Input Code Program"
            label="Code Program"
            formik={formik}
            name="code"
            type="text"
            fluid
          />
          <Input
            placeholder="Input Program Name"
            label="Program Name"
            formik={formik}
            name="name"
            type="text"
            fluid
          />
          <InputDropdownRemote
            formik={formik}
            name="perfMeasurementFinalTemplateId"
            label="Grade Final"
            placeholder="Grade Final"
            apiFetcher={getPerfMeasurementFinalResult}
            apiSearchKeys={['measurementName', 'date']}
            apiTextKey="measurementName"
            apiValueKey="id"
          />
          <InputDropdownSimple
            placeholder="Term Form"
            label="Term Form"
            formik={formik}
            name="formTerm"
            options={formTermOptionsDropdown}
          />
          <InputDropdownSimple
            placeholder="Method of Final Result"
            label="Method of Final Result"
            formik={formik}
            name="finalResultMethod"
            options={finalResultMethodEnumOptionsDropdown}
          />
          <InputDropdownSimple
            placeholder="Member Form"
            label="Member Form"
            formik={formik}
            name="formMember"
            options={formMemberEnumOptionsDropdown}
          />
          <DatePicker
            name="startDate"
            placeholder="31-01-2022"
            label="Start"
            formik={formik}
            dateOnly
          />
          <DatePicker
            name="endDate"
            placeholder="31-01-2022"
            label="End"
            formik={formik}
            dateOnly
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size="large" fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              secondary
              size="large"
              type="submit"
              form="performance-create-form"
              onClick={formik.handleSubmit as any}
              disabled={!formik.isValid}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceProgramCreate;
