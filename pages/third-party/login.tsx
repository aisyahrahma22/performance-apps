import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Grid, Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Title from '../../components/Title';
// import { authentication } from '../../lib/authentication';
import {
  fetchAuthThirdPartyLogin,
  authStateSelector,
} from '../../lib/slice/auth';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ModalChooseRole from '../../components/modal/ProfileChooseRole';
import useCustomOneToken from '../../lib/data/customToken/useCustomOneToken';
import { thirdPartyLoginMenu } from '../../lib/enums/HomeMenu';
// import useInitialAuth from '../../lib/hooks/useInitialAuth';

const PAGE_TITLE = 'Performance Apps Login';

const ThirdPartyLogin: NextPage = () => {
  const [isModalChooseRoles, setIsModalChooseRoles] = useState(false);
  const router = useRouter();
  const { token, menu, empid } = router.query;
  const dispatch = useDispatch();
  const authState = useSelector(authStateSelector);
  const { customToken, isCustomTokenLoading, isCustomTokenError } =
    useCustomOneToken(token);

  useEffect(() => {
    if (token && customToken) {
      dispatch(
        fetchAuthThirdPartyLogin({
          token: token as string,
          empNo: empid as string,
        }),
      );
    } else if (isCustomTokenError == 'Token is Invalid') {
      toast.error(isCustomTokenError || 'invalid token');
    }
  }, [router, customToken, isCustomTokenError]);

  useEffect(() => {
    if (authState.isAuthorized) {
      toast.success('Successfully logged in', {
        toastId: 'login-success',
      });
      if (menu) {
        router.push(thirdPartyLoginMenu(menu));
      } else {
        router.push('/home');
      }
    } else if (authState.isAuthenticated && !authState.isAuthorized) {
      setIsModalChooseRoles(true);
    }
  }, [authState.isAuthorized, authState.isAuthenticated, router]);

  const modalChooseRolesClosePress = useCallback(() => {
    setIsModalChooseRoles(false);
  }, []);

  return (
    <>
      <Title title={PAGE_TITLE} />
      {/* <Button onClick={handleLogin}>Login</Button> */}
      {!isCustomTokenLoading && !customToken && (
        <Grid
          textAlign="center"
          className={'login-container'}
          style={{ height: '100vh' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header
              textAlign={'left'}
              size={'huge'}
              content="404"
              subheader="The URL has expired or invalid token"
              inverted
            />
          </Grid.Column>
        </Grid>
      )}
      {isModalChooseRoles && (
        <ModalChooseRole
          isOpen={isModalChooseRoles}
          closePress={modalChooseRolesClosePress}
        />
      )}
    </>
  );
};

// export const getServerSideProps = authentication();

export default ThirdPartyLogin;
