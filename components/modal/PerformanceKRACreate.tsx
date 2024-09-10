import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesKRACreate from '../../lib/data/performanceKRA/usePerformancesKRACreate';

interface ModalPerformanceKRACreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceKRACreateSchema = yup.object({
  code: yup
  .string()
  .required('Please enter a code')
  .max(32, 'Code can be at most 32 characters long'),
name: yup
  .string()
  .required('Please enter a name')
  .max(128, 'Name can be at most 128 characters long'),
});

const ModalPerformanceKRACreate = ({
  isOpen,
  closePress,
}: ModalPerformanceKRACreateProps) => {
  const { performancesKRACreatePosting, isPerformancesKRACreateLoading } =
    usePerformancesKRACreate({
      onSuccess: closePress,
    });

  const formikPerformanceKRACreate = useFormik({
    initialValues: { code: '', name: '' },
    onSubmit: (values) => {
      performancesKRACreatePosting(values);
    },
    validationSchema: formPerformanceKRACreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceKRACreate.values?.code &&
      formikPerformanceKRACreate.values?.name
    );
  }, [formikPerformanceKRACreate.values]);

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
            <Header.Subheader>KRA</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesKRACreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Insert Code KRA'}
            label={'Code'}
            formik={formikPerformanceKRACreate}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Insert KRA Name'}
            label={'Name'}
            formik={formikPerformanceKRACreate}
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
              onClick={formikPerformanceKRACreate.handleSubmit as any}
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

export default ModalPerformanceKRACreate;
