import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesTargetCreate from '../../lib/data/performanceTarget/usePerformancesTargetCreate';

interface ModalPerformanceTargetCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceTargetCreateSchema = yup.object({
  code: yup
  .string()
  .required('Please enter a code')
  .max(32, 'Code can be at most 32 characters long'),

name: yup
  .string()
  .required('Please enter a name'),
});

const ModalPerformanceTargetCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceTargetCreateProps) => {
  const { performancesTargetCreatePosting, isPerformancesTargetCreateLoading } =
    usePerformancesTargetCreate({
      onSuccess: closePress,
    });

  const formikPerformanceTargetCreate = useFormik({
    initialValues: { code: '', name: '' },
    onSubmit: (values) => {
      performancesTargetCreatePosting(values);
    },
    validationSchema: formPerformanceTargetCreateSchema,
  });
  const isValid = useMemo(() => {
    return (
      formikPerformanceTargetCreate.values?.code &&
      formikPerformanceTargetCreate.values?.name
    );
  }, [formikPerformanceTargetCreate.values]);

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
            <Header.Subheader>Target</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesTargetCreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Insert Code Target'}
            label={'Code'}
            formik={formikPerformanceTargetCreate}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Insert Target Name'}
            label={'Name'}
            formik={formikPerformanceTargetCreate}
            name={'name'}
            type={'text'}
            fluid
            textarea
            isTextAreaAutoHigh
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
              onClick={formikPerformanceTargetCreate.handleSubmit as any}
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

export default ModalPerformanceTargetCreate;
