import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import useForgotPassword from '../../lib/data/auth/useForgotPassword';

interface ModalProfileForgotPasswordProps {
  isOpen: boolean;
  closePress: any;
}

const formProfileForgotPasswordSchema = yup.object({
  usernameOrEmail: yup.string().required('Please enter your Employee ID or Email'),
});

const ModalProfileForgotPassword = ({
  isOpen,
  closePress,
}: ModalProfileForgotPasswordProps) => {
  const { forgotPasswordPosting, isForgotPasswordLoading } = useForgotPassword({
    onSuccess: closePress,
  });

  const formikForgotPassword = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      forgotPasswordPosting(values);
    },
    validationSchema: formProfileForgotPasswordSchema,
  });

  return (
    <Modal open={isOpen} size="mini">
      <Header content="Forgot Password" />
      <Segment basic loading={isForgotPasswordLoading}>
        <Form id="forgot-password-form">
          <Input
            placeholder="Employee ID or Email"
            label="Employee ID or Email"
            formik={formikForgotPassword}
            name="usernameOrEmail"
            type="text"
          />
        </Form>
      </Segment>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size="large" fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              secondary
              size="large"
              type="submit"
              form="forgot-password-form"
              onClick={formikForgotPassword.handleSubmit as any}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalProfileForgotPassword;
