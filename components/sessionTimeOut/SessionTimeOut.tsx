import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSystemConfiguration, {
  SystemConfigurationCodeEnum,
} from '../../lib/data/systemConfiguration/useSystemConfiguration';
import { currentTokenExpiration } from '../../lib/slice/auth';
import SessionConfirmation from './SessionConfirmation';
import SessionExpired from './SessionExpired';

const SessionTimeOut = () => {
  const tokenExpiration = useSelector(currentTokenExpiration);

  const [modalSessionConfirmation, setModalSessionConfirmation] =
    useState(false);
  const [modalTimeout, setModalTimeout] = useState(false);
  const { systemConfiguration: timeoutConfig } = useSystemConfiguration(
    SystemConfigurationCodeEnum.SESSION_TIMEOUT_WARNING_CONFIG,
  );

  useEffect(() => {
    const nearTimeout = tokenExpiration - new Date().getTime();
    const timeoutWarning = timeoutConfig?.value
      ? Number(timeoutConfig?.value)
      : 120;
    if (tokenExpiration == 0) return;
    if (nearTimeout < 0) {
      setModalSessionConfirmation(false);
      return setModalTimeout(true);
    }
    const timeout = setTimeout(() => {
      setModalSessionConfirmation(true);
    }, nearTimeout - timeoutWarning * 1000);

    const timeoutEnd = setTimeout(() => {
      setModalSessionConfirmation(false);
      setModalTimeout(true);
    }, nearTimeout);

    return () => {
      setModalSessionConfirmation(false);
      setModalTimeout(false);
      clearTimeout(timeout);
      clearTimeout(timeoutEnd);
    };
  }, [tokenExpiration, timeoutConfig]);

  return (
    <>
      <SessionConfirmation
        isOpen={modalSessionConfirmation}
        onClose={() => setModalSessionConfirmation(false)}
        tokenExpiration={tokenExpiration}
      />
      <SessionExpired
        isOpen={modalTimeout}
        onClose={() => setModalTimeout(false)}
      />
    </>
  );
};

export default SessionTimeOut;
