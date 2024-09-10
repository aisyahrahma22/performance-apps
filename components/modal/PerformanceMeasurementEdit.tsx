import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceFormTypeEdit from '../../lib/data/performanceFormType/usePerformanceFormTypeEdit';
import usePerformanceFormsType from '../../lib/data/performanceFormType/usePerformanceFormsType';

interface ModalMeasurementPerformanceEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceFormTypeEditSchema = yup.object({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
});

const ModalMeasurementPerformanceEdit = ({
  id,
  isOpen,
  closePress,
}: ModalMeasurementPerformanceEditProps) => {
  const { performance, isPerformanceLoading } = usePerformanceFormsType(id);
  const { performancesEditPosting, isPerformancesEditLoading } =
    usePerformanceFormTypeEdit({
      onSuccess: closePress,
    });

  const initialPerformances = useMemo(
    () => ({
      code: performance?.code,
      name: performance?.name,
    }),
    [performance],
  );

  const formikPerformanceFormTypeEdit = useFormik({
    initialValues: initialPerformances,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceFormTypeEditSchema,
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'pencil'} circular />
          <Header.Content>
            Form Edit
            <Header.Subheader>PERFORMANCE FORM TYPE</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'measurement-performance-edit-form'}
          loading={isPerformancesEditLoading || isPerformanceLoading}
          widths={'equal'}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceFormTypeEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceFormTypeEdit}
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
              primary
              size={'large'}
              type={'submit'}
              form={'performance-edit-form'}
              onClick={formikPerformanceFormTypeEdit.handleSubmit as any}
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

export default ModalMeasurementPerformanceEdit;
