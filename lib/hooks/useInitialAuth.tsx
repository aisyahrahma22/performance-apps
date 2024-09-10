// import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import {
  API_ACTIVITY_LOG,
  API_AUTH_CHALLENGE,
  API_AUTH_LOGOUT,
  authorized,
  // fetchAuthActions,
  fetchAuthHasAccessMapping,
  fetchAuthMe,
  fetchAuthRole,
  logout,
} from '../slice/auth';

function useInitialAuth(menu?: string) {
  const dispatch = useDispatch();
  const initialize = useCallback(async () => {
    try {
      await axios.post(API_AUTH_CHALLENGE, {});
      // fetch logged user data and store them to redux store
      dispatch(authorized({}));

      dispatch(fetchAuthRole());
      dispatch(fetchAuthMe());
      // dispatch(fetchAuthActions());
      dispatch(fetchAuthHasAccessMapping());
      axios.post(API_ACTIVITY_LOG, { endPoint: menu, type: 'MENU' });
    } catch (err) {
      await axios.get(API_AUTH_LOGOUT);
      dispatch(logout({}));
    }
  }, [menu]);

  useEffect(() => {
    initialize();
  }, []);
}

export default useInitialAuth;
