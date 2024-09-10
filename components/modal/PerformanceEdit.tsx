import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformance from '../../lib/data/performance/usePerformance';
import usePerformancesEdit from '../../lib/data/performance/usePerformancesEdit';

interface ModalPerformanceEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceEditSchema = yup.object({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
});

const ModalPerformanceEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceEditProps) => {
  const { performance, isPerformanceLoading } = usePerformance(id);
  const { performancesEditPosting, isPerformancesEditLoading } =
    usePerformancesEdit({
      onSuccess: closePress,
    });

  const initialPerformances = useMemo(
    () => ({
      code: performance?.code,
      name: performance?.name,
      description: performance?.description,
    }),
    [performance],
  );

  const formikPerformanceEdit = useFormik({
    initialValues: initialPerformances,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceEditSchema,
  });

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'pencil'} circular />
          <Header.Content>
            Form Edit
            <Header.Subheader>PERFORMANCE ASSESSMENT</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={isPerformancesEditLoading || isPerformanceLoading}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceEdit}
            name={'name'}
            type={'text'}
          />
          <Input
            placeholder={'Description'}
            label={'Description'}
            formik={formikPerformanceEdit}
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
              form={'performance-edit-form'}
              onClick={formikPerformanceEdit.handleSubmit as any}
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

export default ModalPerformanceEdit;
