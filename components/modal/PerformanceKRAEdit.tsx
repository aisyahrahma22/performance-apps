import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceKRA from '../../lib/data/performanceKRA/usePerformanceKRA';
import usePerformancesKRAEdit from '../../lib/data/performanceKRA/usePerformancesKRAEdit';

interface ModalPerformanceKRAEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceKRAEditSchema = yup.object({
  code: yup
  .string()
  .required('Please enter a code')
  .max(32, 'Code can be at most 32 characters long'),
name: yup
  .string()
  .required('Please enter a name')
  .max(128, 'Name can be at most 128 characters long'),
});

const ModalPerformanceKRAEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceKRAEditProps) => {
  const { performanceKRA, isPerformanceKRALoading } = usePerformanceKRA(id);
  const { performancesKRAEditPosting, isPerformancesKRAEditLoading } =
    usePerformancesKRAEdit({
      onSuccess: closePress,
    });

  const initialPerformancesKRA = useMemo(
    () => ({
      code: performanceKRA?.code,
      name: performanceKRA?.name,
    }),
    [performanceKRA],
  );

  const formikPerformanceKRAEdit = useFormik({
    initialValues: initialPerformancesKRA,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesKRAEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceKRAEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceKRAEdit.values?.code &&
      formikPerformanceKRAEdit.values?.name
    );
  }, [formikPerformanceKRAEdit.values]);

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
            <Header.Subheader>KRA</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={isPerformancesKRAEditLoading || isPerformanceKRALoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceKRAEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceKRAEdit}
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
              onClick={formikPerformanceKRAEdit.handleSubmit as any}
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

export default ModalPerformanceKRAEdit;
