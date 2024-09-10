import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Icon } from 'semantic-ui-react';
import axios from '../../lib/axios';
import { API_AUTH_LOGOUT, logout, setLoggingOut } from '../../lib/slice/auth';
import Modals from '../revamp/components/Modals';

const SessionExpired = ({ isOpen, onClose }: any) => {
  const dispatch = useDispatch();
  const handleConfirm = useCallback(async () => {
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

  return (
    <>
      {isOpen && (
        <Modals
          isOpen={isOpen}
          onClose={() => onClose(false)}
          size="tiny"
          closeIcon={false}
          closeOnDimmerClick={false}
          footer
          confirmMessage="OK"
          onClickConfirm={handleConfirm}
          title="Session Expired"
        >
          <div className="rvflexs column centers">
            <div className="rvtexts regular text-s">
              <Icon name="stopwatch" color="red" inverted /> Your session has
              expired
            </div>
            <div className="rvtexts regular text-s centered mt-075">
              You will be redirected to the Login Page.
            </div>
            <div className="rvtexts regular text-s centered mt-075">
              Please note that your progress has not been saved yet.
            </div>
          </div>
        </Modals>
      )}
    </>
  );
};

export default SessionExpired;
