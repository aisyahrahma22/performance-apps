import React, { useCallback, useEffect, useState } from 'react';
import {
  Segment,
  Grid,
  Form,
  Header,
  Button,
} from 'semantic-ui-react';
import * as yup from 'yup';
import Input from '../components/Input';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  AuthLogin,
  authStateSelector,
  fetchAuthLogin,
} from '../lib/slice/auth';
import { useRouter } from 'next/router';
import ModalProfileForgotPassword from '../components/modal/ProfileForgotPassword';
import { toast } from 'react-toastify';
import { Encrypt } from '../lib/util/crypto';
import useInitialAuth from '../lib/hooks/useInitialAuth';

const formLoginSchema = yup.object({
  username: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter your password'),
});

const Login = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector(authStateSelector);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalForgotPassword, setIsModalForgotPassword] = useState(false);

  const formikLogin = useFormik<AuthLogin>({
    validationSchema: formLoginSchema,
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(
        fetchAuthLogin({
          username: Encrypt(values.username.trim()),
          password: Encrypt(values.password),
        }),
      );
    },
  });

  const modalForgotPasswordPress = useCallback(() => {
    formikLogin.resetForm();
    setIsModalForgotPassword((v) => !v);
  }, [formikLogin]);

  useEffect(() => {
    if (authState.isAuthorized) {
      toast.success('You have logged in successfully', {
        toastId: 'login-success',
      });
      router.push('/home');
    } 
  }, [authState.isAuthorized, authState.isAuthenticated, router]);

  const togglePasswordVisibility = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <>
      <Grid centered verticalAlign="middle" className="login-container">
        <Grid.Column width={6}>
          <Segment  loading={authState.isAuthenticating} className='custom-segment-style'>
            <Header as="h2" textAlign="center">Welcome to Our System</Header>
            <Form onSubmit={formikLogin.handleSubmit}>
              <Input
                label="Username"
                name="username"
                placeholder="Enter your username"
                formik={formikLogin}
              />
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={{
                  name: showPassword ? 'eye' : 'eye slash',
                  link: true,
                  onClick: togglePasswordVisibility,
                }}
                formik={formikLogin}
              />
              <Button type="submit" secondary circular fluid disabled={!formikLogin.isValid}>
                Login
              </Button>
              <div  onClick={modalForgotPasswordPress} style={{ cursor: 'pointer', textAlign: 'right', marginTop: '10px' }}>
                Forgot Password?
              </div>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
        <ModalProfileForgotPassword
          isOpen={isModalForgotPassword}
          closePress={modalForgotPasswordPress}
        />
    </>
  );
};

export default Login;
