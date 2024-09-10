import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceFormTypeCreate from '../../lib/data/performanceFormType/usePerformancesFormTypeCreate';

interface ModalPerformanceFormTypeCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceCreateSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .max(32, 'Code Maximum 32 Characters'),
  name: yup
    .string()
    .required('Name is required')
    .max(128, 'Name Maximum 128 Characters'),
});

const ModalPerformanceFormTypeCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceFormTypeCreateProps) => {
  const { performancesCreatePosting, isPerformancesCreateLoading } =
    usePerformanceFormTypeCreate({
      onSuccess: closePress,
    });

  const formikPerformanceFormTypeCreate = useFormik({
    initialValues: { code: '', name: '' },
    onSubmit: (values) => {
      performancesCreatePosting(values);
    },
    validationSchema: formPerformanceCreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceFormTypeCreate.values?.code &&
      formikPerformanceFormTypeCreate.values?.name
    );
  }, [formikPerformanceFormTypeCreate.values]);

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="tiny"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="black">
          <Icon name={'plus square outline'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>Performance Form Type</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesCreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Form Type Code'}
            label={'Code'}
            formik={formikPerformanceFormTypeCreate}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Form Type Name'}
            label={'Name'}
            formik={formikPerformanceFormTypeCreate}
            name={'name'}
            type={'text'}
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
              form={'performance-create-form'}
              onClick={formikPerformanceFormTypeCreate.handleSubmit as any}
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

export default ModalPerformanceFormTypeCreate;
