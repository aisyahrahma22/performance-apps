import React from 'react';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { Provider, useSelector } from 'react-redux';
import { store, wrapper } from '../lib/store';
import SideMenuBar from '../components/SideMenuBar';
import { authStateSelector } from '../lib/slice/auth';
import { Container, Dimmer, Loader, Segment } from 'semantic-ui-react';
import TopMenu from '../components/TopMenu';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../semantic/dist/semantic.css';
import '../styles/global.scss';
import '../styles/revamp.scss';
import 'material-icons/iconfont/material-icons.css';
import 'rc-slider/assets/index.css';
import { GUEST } from '../helper/guest';
import LoadingAuthChecker from '../components/LoadingChecker';

const AuthChecker = () => {
  const authState = useSelector(authStateSelector);
  return (
    <Dimmer active={authState.isLoggingOut}>
      <Loader />
    </Dimmer>
  );
};

const Layout = ({ Component, pageProps }: any) => {
  const router = useRouter();

  if (
    router.pathname === '/login' ||
    pageProps.statusCode === 404 ||
    GUEST.includes(router.pathname)
  )
    return <Component {...pageProps} />;
  return (
    <Container fluid className="main-container">
      <SideMenuBar />
      <div className="content-container">
        <TopMenu />
        <Segment
          padded
          basic
          className="content-wrapper stylingscreen"
          style={
            router.pathname.includes('/idp/') && !router.pathname.includes('v1')
              ? { padding: 0 }
              : {}
          }
        >
          <LoadingAuthChecker />
          <Component {...pageProps} />
        </Segment>
      </div>
    </Container>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateIfStale: false,
        refreshWhenHidden: false,
        refreshWhenOffline: false,
      }}
    >
      <Provider store={store}>
        <AuthChecker />
        <ToastContainer hideProgressBar icon={false} theme={'colored'} />
        <Layout Component={Component} pageProps={pageProps} />
      </Provider>
    </SWRConfig>
  );
}

export default wrapper.withRedux(MyApp);
