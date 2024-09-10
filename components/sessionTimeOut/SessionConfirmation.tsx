import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Icon } from 'semantic-ui-react';
import axios from '../../lib/axios';
import {
  API_AUTH_CHALLENGE,
  API_AUTH_LOGOUT,
  fetchAuthMe,
  logout,
  setLoggingOut,
} from '../../lib/slice/auth';
import Modals from '../revamp/components/Modals';
import TimerTimeout from './TimerTimeout';

type SessionConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  tokenExpiration: number;
};

const SessionConfirmation = ({
  isOpen,
  onClose,
  tokenExpiration,
}: SessionConfirmationProps) => {
  const dispatch = useDispatch();

  const handleSignOut = useCallback(async () => {
    dispatch(setLoggingOut(true));
    onClose();
    try {
      await axios.get(API_AUTH_LOGOUT);
      dispatch(logout({}));
    } catch (err) {
      toast.error('Something went wrong. Please refresh the page.');
    } finally {
      dispatch(setLoggingOut(false));
    }
  }, [onClose, dispatch]);

  const handleContinue = useCallback(async () => {
    try {
      await axios.post(API_AUTH_CHALLENGE);
      dispatch(fetchAuthMe());
    } catch (err) {
      toast.error('Something went wrong. Please refresh the page.');
    } finally {
      onClose();
    }
  }, [dispatch, onClose]);

  return (
    <>
      {isOpen && (
        <Modals
          isOpen={isOpen}
          onClose={handleSignOut}
          onClickConfirm={handleContinue}
          size="tiny"
          title="Session Timeout"
          closeIcon={false}
          closeOnDimmerClick={false}
          footer
          confirmMessage="Continue"
          cancelMessage="Sign Out"
        >
          <div className="rvflexs column centers">
            <div className="rvtexts regular text-s">
              <Icon name="stopwatch" color="red" inverted /> Your session will
              expire in
            </div>
            <div className="rvtexts medium text-s mt-075 mb-075">
              {/* <h1>2 min 30 secs</h1> */}
              <TimerTimeout deadline={new Date(tokenExpiration).toString()} />
            </div>

            <div className="rvtexts regular text-s centered">
              Please click “Continue” to keep working or click “Sign Out” to end
              your session now (you will lose unsaved progress).
            </div>
          </div>
        </Modals>
      )}
    </>
  );
};

export default SessionConfirmation;
