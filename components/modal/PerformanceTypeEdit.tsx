import { Button, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceType from '../../lib/data/performanceType/usePerformanceType';
import usePerformancesTypeEdit from '../../lib/data/performanceType/usePerformancesTypeEdit';

interface ModalPerformanceTypeEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceTypeEditSchema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .max(32, 'Code Maximum 32 Characters'),
  name: yup
    .string()
    .required('Name is required')
    .max(128, 'Name Maximum 128 Characters'),
});

const ModalPerformanceTypeEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceTypeEditProps) => {
  const { performanceType, isPerformanceTypeLoading } = usePerformanceType(id);
  const { performancesTypeEditPosting, isPerformancesTypeEditLoading } =
    usePerformancesTypeEdit({
      onSuccess: closePress,
    });

  const initialPerformancesType = useMemo(
    () => ({
      code: performanceType?.code,
      name: performanceType?.name,
    }),
    [performanceType],
  );

  const formikPerformanceTypeEdit = useFormik({
    initialValues: initialPerformancesType,
    enableReinitialize: true,
    onSubmit: (values) => {
      performancesTypeEditPosting({ ...values, id });
    },
    validationSchema: formPerformanceTypeEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceTypeEdit.values?.code &&
      formikPerformanceTypeEdit.values?.name
    );
  }, [formikPerformanceTypeEdit.values]);

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
            <Header.Subheader>Performance Type</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={isPerformancesTypeEditLoading || isPerformanceTypeLoading}
          style={{ marginBottom: '50px' }}
        >
          <Input
            placeholder={'Code'}
            label={'Code'}
            formik={formikPerformanceTypeEdit}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceTypeEdit}
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
              onClick={formikPerformanceTypeEdit.handleSubmit as any}
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

export default ModalPerformanceTypeEdit;
