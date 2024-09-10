import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesSiloamValueCreate from '../../lib/data/performanceSiloamValue/usePerformanceSiloamValueCreate';

interface ModalSiloamValueCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formSiloamValueCreateSchema = yup.object({
  id: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const ModalSiloamValueCreate = ({
  isOpen,
  closePress,
}: ModalSiloamValueCreateProps) => {
  const siloamValueCreate = usePerformancesSiloamValueCreate({
    onSuccess: closePress,
  });

  const formikSiloamValueCreate = useFormik({
    initialValues: { id: '', name: '', description: '' },
    onSubmit: (values) => {
      siloamValueCreate.performancesSiloamValueCreatePosting(values);
    },
    validationSchema: formSiloamValueCreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikSiloamValueCreate.values?.id &&
      formikSiloamValueCreate.values?.name &&
      formikSiloamValueCreate.values?.description
    );
  }, [formikSiloamValueCreate]);

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'add'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>Siloam Value</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={siloamValueCreate.isPerformancesSiloamValueCreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Input Code'}
            label={'Code'}
            formik={formikSiloamValueCreate}
            name={'id'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Input Name'}
            label={'Name'}
            formik={formikSiloamValueCreate}
            name={'name'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Input Description'}
            label={'Description'}
            formik={formikSiloamValueCreate}
            name={'description'}
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
              primary
              size={'large'}
              type={'submit'}
              form={'performance-create-form'}
              onClick={formikSiloamValueCreate.handleSubmit as any}
              disabled={!isValid}
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

export default ModalSiloamValueCreate;
