import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesKPICreate from '../../lib/data/performanceKPI/usePerformancesKPICreate';

interface ModalPerformanceKPICreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceKPICreateSchema = yup.object({
  code: yup
  .string()
  .required('Please enter a code')
  .max(32, 'Code can be at most 32 characters long'),

  name: yup
    .string()
    .required('Please enter a name'),

  description: yup
    .string()
    .required('Please provide a description'),

  keyAction: yup
    .string()
    .required('Please specify a key action'),

  behaviour: yup
    .string()
    .required('Please define a behaviour'),

});

const ModalPerformanceKPICreate = ({
  isOpen,
  closePress,
}: ModalPerformanceKPICreateProps) => {
  const { performancesKPICreatePosting, isPerformancesKPICreateLoading } =
    usePerformancesKPICreate({
      onSuccess: closePress,
    });

  const formikPerformanceKPICreate = useFormik({
    initialValues: {
      code: '',
      name: '',
      description: '',
      keyAction: '',
      behaviour: '',
    },
    onSubmit: (values) => {
      performancesKPICreatePosting(values);
    },
    validationSchema: formPerformanceKPICreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceKPICreate.values?.code &&
      formikPerformanceKPICreate.values?.name &&
      formikPerformanceKPICreate.values?.description &&
      formikPerformanceKPICreate.values?.keyAction &&
      formikPerformanceKPICreate.values?.behaviour
    );
  }, [formikPerformanceKPICreate.values]);

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="tiny"
      style={{ height: '80%', top: '10%' }}
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="black">
          <Icon name={'plus square outline'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>KPI</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: '78%' }}>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesKPICreateLoading}
          style={{ marginBottom: '25px' }}
        >
          <Input
            placeholder={'Insert Code KPI'}
            label={'Code'}
            formik={formikPerformanceKPICreate}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Insert KPI Name'}
            label={'Name'}
            formik={formikPerformanceKPICreate}
            name={'name'}
            type={'text'}
            fluid
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Description'}
            label={'Description'}
            formik={formikPerformanceKPICreate}
            name={'description'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Key Action'}
            label={'Key Action'}
            formik={formikPerformanceKPICreate}
            name={'keyAction'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Behaviour'}
            label={'Behaviour'}
            formik={formikPerformanceKPICreate}
            name={'behaviour'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
        </Form>
      </Modal.Content>
      <Modal.Actions
        style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}
      >
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
              form={'performance-create-form'}
              onClick={formikPerformanceKPICreate.handleSubmit as any}
              disabled={!isValid}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceKPICreate;
