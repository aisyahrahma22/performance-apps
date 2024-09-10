import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import useChangePassword from '../../lib/data/auth/useChangePassword';
import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

interface ModalProfileChangePasswordProps {
  isOpen: boolean;
  closePress: any;
}

const formChangePasswordSchema = yup.object({
  oldPassword: yup.string().required('Old Password is required'),
  newPassword: yup.string().password().required('New Password is required'),
});

const ModalProfileChangePassword = ({
  isOpen,
  closePress,
}: ModalProfileChangePasswordProps) => {
  const [oldPasswordVisibility, setOldPasswordVisibility] = useState(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);

  const { changePasswordPosting, isChangePasswordLoading } = useChangePassword({
    onSuccess: closePress,
  });

  const formikChangePassword = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      changePasswordPosting(values);
    },
    validationSchema: formChangePasswordSchema,
  });

  const oldPasswordVisibilityPress = useCallback(
    () => setOldPasswordVisibility((v) => !v),
    [],
  );
  const newPasswordVisibilityPress = useCallback(
    () => setNewPasswordVisibility((v) => !v),
    [],
  );

  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Header content={'Change Password'} />
      <Segment basic loading={isChangePasswordLoading}>
        <Form id={'change-password-form'}>
          <Input
            placeholder={'Old Password'}
            label={'Old Password'}
            formik={formikChangePassword}
            name={'oldPassword'}
            icon={{
              name: !oldPasswordVisibility ? 'eye' : 'eye slash',
              circular: true,
              link: true,
              onClick: oldPasswordVisibilityPress,
            }}
            type={oldPasswordVisibility ? 'text' : 'password'}
          />

          <Input
            placeholder={'New Password'}
            label={'New Password'}
            formik={formikChangePassword}
            name={'newPassword'}
            icon={{
              name: !newPasswordVisibility ? 'eye' : 'eye slash',
              circular: true,
              link: true,
              onClick: newPasswordVisibilityPress,
            }}
            type={newPasswordVisibility ? 'text' : 'password'}
          />
        </Form>
      </Segment>
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
              form={'change-password-form'}
              onClick={formikChangePassword.handleSubmit as any}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalProfileChangePassword;
