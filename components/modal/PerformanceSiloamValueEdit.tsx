import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Popup,
} from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformanceSiloamValue from '../../lib/data/performanceSiloamValue/usePerformanceSiloamValue';
import usePerformancesSiloamValueEdit from '../../lib/data/performanceSiloamValue/usePerformancesSiloamValueEdit';

interface ModalPerformanceSiloamValueEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const formPerformanceSiloamValueEditSchema = yup.object({
  id: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const ModalSiloamValueEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceSiloamValueEditProps) => {
  const performanceSiloamValue = usePerformanceSiloamValue(id);
  const siloamValueEditPosting = usePerformancesSiloamValueEdit({
    onSuccess: closePress,
  });

  const initialPerformancesSiloamValue = useMemo(
    () => ({
      id: performanceSiloamValue?.performanceSiloamValue?.id,
      name: performanceSiloamValue?.performanceSiloamValue?.name,
      description: performanceSiloamValue?.performanceSiloamValue?.description,
    }),
    [performanceSiloamValue],
  );

  const formikPerformanceSiloamValueEdit = useFormik({
    initialValues: initialPerformancesSiloamValue,
    enableReinitialize: true,
    onSubmit: (values) => {
      siloamValueEditPosting.performancesSiloamValueEditPosting({
        ...values,
        id,
      });
    },
    validationSchema: formPerformanceSiloamValueEditSchema,
  });

  const isValid = useMemo(() => {
    return (
      formikPerformanceSiloamValueEdit.values?.id &&
      formikPerformanceSiloamValueEdit.values?.name &&
      formikPerformanceSiloamValueEdit.values?.description
    );
  }, [formikPerformanceSiloamValueEdit.values]);

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
            <Header.Subheader>Siloam Value</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-edit-form'}
          loading={
            siloamValueEditPosting?.isPerformancesSiloamValueEditLoading ||
            performanceSiloamValue?.isPerformanceSiloamValueLoading
          }
          style={{ marginBottom: '50px' }}
        >
          <Popup
            content="Can't be edited"
            trigger={
              <span>
                <Input
                  placeholder={'Code'}
                  label={'Code'}
                  formik={formikPerformanceSiloamValueEdit}
                  name={'id'}
                  type={'text'}
                  disabled
                />
              </span>
            }
          />
          <br />
          <Input
            placeholder={'Name'}
            label={'Name'}
            formik={formikPerformanceSiloamValueEdit}
            name={'name'}
            type={'text'}
          />
          <Input
            placeholder={'Description'}
            label={'Description'}
            formik={formikPerformanceSiloamValueEdit}
            name={'description'}
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
              primary
              size={'large'}
              type={'submit'}
              form={'performance-edit-form'}
              onClick={formikPerformanceSiloamValueEdit.handleSubmit as any}
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

export default ModalSiloamValueEdit;
