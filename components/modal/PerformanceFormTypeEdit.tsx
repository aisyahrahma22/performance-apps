import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceFormTypeEdit from '../../lib/data/performanceFormType/usePerformanceFormTypeEdit';
import usePerformanceFormsType from '../../lib/data/performanceFormType/usePerformanceFormsType';

interface ModalPerformanceFormTypeEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceFormTypeEditSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .max(32, 'Code Maximum 32 Characters'),
  name: yup
    .string()
    .required('Name is required')
    .max(128, 'Name Maximum 128 Characters'),
});

const ModalPerformanceFormTypeEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceFormTypeEditProps) => {
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

  const isValid = useMemo(() => {
    return (
      formikPerformanceFormTypeEdit.values?.code &&
      formikPerformanceFormTypeEdit.values?.name
    );
  }, [formikPerformanceFormTypeEdit.values]);

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="tiny"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="black">
          <Icon name={'edit'} circular />
          <Header.Content>
            Form Edit
            <Header.Subheader>Performance Form Type</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={isPerformancesEditLoading || isPerformanceLoading}
          style={{ marginBottom: '50px' }}
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
              secondary
              size={'large'}
              type={'submit'}
              form={'performance-edit-form'}
              onClick={formikPerformanceFormTypeEdit.handleSubmit as any}
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

export default ModalPerformanceFormTypeEdit;
