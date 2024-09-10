import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesCreate from '../../lib/data/performance/usePerformancesCreate';

interface ModalPerformanceCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceCreateSchema = yup.object({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
});

const ModalPerformanceCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceCreateProps) => {
  const { performancesCreatePosting, isPerformancesCreateLoading } =
    usePerformancesCreate({
      onSuccess: closePress,
    });

  const formikPerformanceCreate = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      performancesCreatePosting(values);
    },
    validationSchema: formPerformanceCreateSchema,
  });

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'add'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>PERFORMANCE ASSESSMENT</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesCreateLoading}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceCreate}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceCreate}
            name={'name'}
            type={'text'}
          />
          <Input
            placeholder={'Description'}
            label={'Description'}
            formik={formikPerformanceCreate}
            name={'description'}
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
              primary
              size={'large'}
              type={'submit'}
              form={'performance-create-form'}
              onClick={formikPerformanceCreate.handleSubmit as any}
            >
              <Icon name={'save'} />
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceCreate;
