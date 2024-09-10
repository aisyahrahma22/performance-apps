import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesTypeCreate from '../../lib/data/performanceType/usePerformancesTypeCreate';

interface ModalPerformanceTypeCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceTypeCreateSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .max(32, 'Code Maximum 32 Characters'),
  name: yup
    .string()
    .required('Name is required')
    .max(128, 'Name Maximum 128 Characters'),
});

const ModalPerformanceTypeCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceTypeCreateProps) => {
  const { performancesTypeCreatePosting, isPerformancesTypeCreateLoading } =
    usePerformancesTypeCreate({
      onSuccess: closePress,
    });

  const formikPerformanceTypeCreate = useFormik({
    initialValues: {
      code: '',
      name: '',
    },
    onSubmit: (values) => {
      performancesTypeCreatePosting(values);
    },
    validationSchema: formPerformanceTypeCreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceTypeCreate.values?.code &&
      formikPerformanceTypeCreate.values?.name
    );
  }, [formikPerformanceTypeCreate.values]);

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
            <Header.Subheader>PerformanceType</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesTypeCreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Insert Code Performance Type'}
            label={'Code'}
            formik={formikPerformanceTypeCreate}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Insert Performance Type Name'}
            label={'Name'}
            formik={formikPerformanceTypeCreate}
            name={'name'}
            type={'text'}
            fluid
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
              onClick={formikPerformanceTypeCreate.handleSubmit as any}
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

export default ModalPerformanceTypeCreate;
