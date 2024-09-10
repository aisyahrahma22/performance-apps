import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceKPI from '../../lib/data/performanceKPI/usePerformanceKPI';
import usePerformancesKPIEdit from '../../lib/data/performanceKPI/usePerformancesKPIEdit';

interface ModalPerformanceKPIEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceKPIEditSchema = yup.object({
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

const ModalPerformanceKPIEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceKPIEditProps) => {
  const { performanceKPI, isPerformanceKPILoading } = usePerformanceKPI(id);
  const { performancesKPIEditPosting, isPerformancesKPIEditLoading } =
    usePerformancesKPIEdit({
      onSuccess: closePress,
    });

  const initialPerformancesKPI = useMemo(
    () => ({
      code: performanceKPI?.code,
      name: performanceKPI?.name,
      description: performanceKPI?.description,
      keyAction: performanceKPI?.keyAction,
      behaviour: performanceKPI?.behaviour,
    }),
    [performanceKPI],
  );

  const formikPerformanceKPIEdit = useFormik({
    initialValues: initialPerformancesKPI,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesKPIEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceKPIEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceKPIEdit.values?.code &&
      formikPerformanceKPIEdit.values?.name &&
      formikPerformanceKPIEdit.values?.description &&
      formikPerformanceKPIEdit.values?.keyAction &&
      formikPerformanceKPIEdit.values?.behaviour
    );
  }, [formikPerformanceKPIEdit.values]);

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
          <Icon name={'edit'} circular />
          <Header.Content>
            Form Edit
            <Header.Subheader>KPI</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: '78%' }}>
        <Form
          id={'performance-edit-form'}
          loading={isPerformancesKPIEditLoading || isPerformanceKPILoading}
          style={{ marginBottom: '25px' }}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceKPIEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceKPIEdit}
            name={'name'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Description'}
            label={'Description'}
            formik={formikPerformanceKPIEdit}
            name={'description'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Key Action'}
            label={'Key Action'}
            formik={formikPerformanceKPIEdit}
            name={'keyAction'}
            type={'text'}
            textarea
            isTextAreaAutoHigh
          />
          <Input
            placeholder={'Insert Behaviour'}
            label={'Behaviour'}
            formik={formikPerformanceKPIEdit}
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
              form={'performance-edit-form'}
              onClick={formikPerformanceKPIEdit.handleSubmit as any}
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

export default ModalPerformanceKPIEdit;
