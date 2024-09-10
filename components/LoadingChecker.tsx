import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authStateSelector } from '../lib/slice/auth';
import { Dimmer, Progress } from 'semantic-ui-react';

const LoadingAuthChecker = () => {
  const [loader, setLoader] = useState({ value: 0, active: true });
  const authState = useSelector(authStateSelector);

  const {
    isFetchingUserProfile,
    isFetchingUserRole,
    isFetchingUserActions,
    isCheckingAccessMaping,
  } = authState;

  const loadingStates = [
    isFetchingUserProfile,
    isFetchingUserRole,
    isFetchingUserActions,
    isCheckingAccessMaping,
  ];

  useEffect(() => {
    const completedValue = loadingStates?.filter((loading) => !loading).length;
    const loaderValue = (completedValue / loadingStates?.length) * 100;
    setLoader({ value: loaderValue, active: loaderValue < 100 });
  }, [authState]);

  return (
    <>
      <Dimmer active={loader.active} inverted>
        <div
          data-percent={loader.value}
          data-total="100%"
          style={{ width: '30vw' }}
        >
          <div>
            <img
              src="/images/logo.png"
              style={{
                width: '20%',
                marginBottom: '1em',
              }}
            />
            <Progress
              percent={loader.value}
              size={'small'}
              indicating
              autoSuccess={false}
            />
          </div>
          <div className={`loading-checker`}>Please Wait...</div>
        </div>
      </Dimmer>
    </>
  );
};

export default LoadingAuthChecker;
