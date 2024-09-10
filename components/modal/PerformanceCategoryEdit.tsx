import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceCategory from '../../lib/data/performanceCategory/usePerformanceCategory';
import usePerformancesCategoryEdit from '../../lib/data/performanceCategory/usePerformancesCategoryEdit';

interface ModalPerformanceCategoryEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceCategoryEditSchema = yup.object({
  code: yup
        .string()
        .required('Please enter a code')
        .max(32, 'Code can be a maximum of 32 characters'),
  name: yup.string().required('Please enter a name'),
});

const ModalPerformanceCategoryEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceCategoryEditProps) => {
  const { performanceCategory, isPerformanceCategoryLoading } =
    usePerformanceCategory(id);
  const { performancesCategoryEditPosting, isPerformancesCategoryEditLoading } =
    usePerformancesCategoryEdit({
      onSuccess: closePress,
    });

  const initialPerformancesCategory = useMemo(
    () => ({
      code: performanceCategory?.code,
      name: performanceCategory?.name,
    }),
    [performanceCategory],
  );

  const formikPerformanceCategoryEdit = useFormik({
    initialValues: initialPerformancesCategory,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesCategoryEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceCategoryEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceCategoryEdit.values?.code &&
      formikPerformanceCategoryEdit.values?.name
    );
  }, [formikPerformanceCategoryEdit.values]);

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
            <Header.Subheader>Category</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={
            isPerformancesCategoryEditLoading || isPerformanceCategoryLoading
          }
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceCategoryEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceCategoryEdit}
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
              onClick={formikPerformanceCategoryEdit.handleSubmit as any}
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

export default ModalPerformanceCategoryEdit;
