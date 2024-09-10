import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesCategoryCreate from '../../lib/data/performanceCategory/usePerformancesCategoryCreate';

interface ModalPerformanceCategoryCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceCategoryCreateSchema = yup.object({
  code: yup
        .string()
        .required('Please enter a code')
        .max(32, 'Code can be a maximum of 32 characters'),
  name: yup.string().required('Please enter a name'),
});

const ModalPerformanceCategoryCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceCategoryCreateProps) => {
  const {
    performancesCategoryCreatePosting,
    isPerformancesCategoryCreateLoading,
  } = usePerformancesCategoryCreate({
    onSuccess: closePress,
  });

  const formikPerformanceCategoryCreate = useFormik({
    initialValues: {
      code: '',
      name: '',
    },
    onSubmit: (values) => {
      performancesCategoryCreatePosting(values);
    },
    validationSchema: formPerformanceCategoryCreateSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceCategoryCreate.values?.code &&
      formikPerformanceCategoryCreate.values?.name
    );
  }, [formikPerformanceCategoryCreate.values]);

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
            <Header.Subheader>Category</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-create-form'}
          loading={isPerformancesCategoryCreateLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Insert Code Category'}
            label={'Code'}
            formik={formikPerformanceCategoryCreate}
            name={'code'}
            type={'text'}
            fluid
          />
          <Input
            placeholder={'Insert Category Name'}
            label={'Name'}
            formik={formikPerformanceCategoryCreate}
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
              onClick={formikPerformanceCategoryCreate.handleSubmit as any}
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

export default ModalPerformanceCategoryCreate;
