import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceTarget from '../../lib/data/performanceTarget/usePerformanceTarget';
import usePerformancesTargetEdit from '../../lib/data/performanceTarget/usePerformancesTargetEdit';

interface ModalPerformanceTargetEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceTargetEditSchema = yup.object({
  code: yup
  .string()
  .required('Please enter a code')
  .max(32, 'Code can be at most 32 characters long'),

name: yup
  .string()
  .required('Please enter a name'),
});

const ModalPerformanceTargetEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceTargetEditProps) => {
  const { performanceTarget, isPerformanceTargetLoading } =
    usePerformanceTarget(id);
  const { performancesTargetEditPosting, isPerformancesTargetEditLoading } =
    usePerformancesTargetEdit({
      onSuccess: closePress,
    });

  const initialPerformancesTarget = useMemo(
    () => ({
      code: performanceTarget?.code,
      name: performanceTarget?.name,
    }),
    [performanceTarget],
  );

  const formikPerformanceTargetEdit = useFormik({
    initialValues: initialPerformancesTarget,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesTargetEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceTargetEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceTargetEdit.values?.code &&
      formikPerformanceTargetEdit.values?.name
    );
  }, [formikPerformanceTargetEdit.values]);

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
            <Header.Subheader>Target</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={
            isPerformancesTargetEditLoading || isPerformanceTargetLoading
          }
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceTargetEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceTargetEdit}
            name={'name'}
            type={'text'}
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
              form={'performance-edit-form'}
              onClick={formikPerformanceTargetEdit.handleSubmit as any}
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

export default ModalPerformanceTargetEdit;
