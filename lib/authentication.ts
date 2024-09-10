// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as setCookie from 'set-cookie-parser';
import * as cookie from 'cookie';
import axios from './axios';
import {
  API_AUTH_LOGOUT,
  API_AUTH_ME,
  updateAuthMe,
  API_AUTH_ACTIONS,
  updateAuthActions,
  updateAuthHasAccessMapping,
  API_AUTH_ROLE,
  updateAuthRole,
  logout,
  authorized,
  API_AUTH_CHALLENGE,
  API_CHECK_DATA_ACCESS_MAPPING,
} from './slice/auth';
import { API_DATA_ACCESS_MAPPING } from './slice/dataAccessMapping';
import { wrapper } from './store';
import { findIndex } from 'lodash';
import { updateAuthDataMapping } from './slice/dataAccessMapping';
import { thirdPartyLoginMenu } from './enums/HomeMenu';

const loginRedirect = {
  destination: '/login',
};
const dashboardRedirect = {
  destination: '/dashboard',
};

const unprotectedRoutes = ['/login'];

// this one is server side rendering
// axios instance is inside the server
// any returned value will pass to nextjs page
export const authentication = () =>
  wrapper.getServerSideProps((store) => async ({ req, res }): Promise<any> => {
    const { dispatch } = store;
    if (req) {
      const reqCookies = req.cookies || {};
      const reqRefreshToken = reqCookies['refresh_token'];
      const isUnProtectedRoute =
        findIndex(unprotectedRoutes, (r) => req.url?.includes(r) || false) > -1;
      // validating refresh_token and access_token from client request
      if (!reqRefreshToken) {
        const respLogout = await axios.get(API_AUTH_LOGOUT);
        await dispatch(logout({}));
        // remove cookies
        res.setHeader('set-cookie', respLogout.headers['set-cookie']);

        // if the user request the protectedRoutes, we need to redirect them to /login immediately
        if (!isUnProtectedRoute) {
          return {
            redirect: loginRedirect,
          };
        } else return {};
      }

      try {
        // make sure that the server has the new access_token
        const respChallenge = await axios.post(
          API_AUTH_CHALLENGE,
          {},
          {
            headers: {
              Cookie: req.headers.cookie || '',
            },
          },
        );
        const respCookies = setCookie.parse(
          respChallenge.headers['set-cookie'],
        );
        let newCookies = '';
        respCookies.map((val) => {
          newCookies += `${cookie.serialize(val.name, val.value)};`;
        });
        const newAxiosConfig = {
          headers: {
            Cookie: newCookies,
          },
        };

        // fetch logged user data and store them to server redux store
        await dispatch(authorized({}));

        const { data: role } = await axios.get(API_AUTH_ROLE, newAxiosConfig);
        await dispatch(updateAuthRole({ role }));

        const {
          data: { employee, ...user },
        } = await axios.get(API_AUTH_ME, newAxiosConfig);
        await dispatch(updateAuthMe({ employee, user }));

        const { data } = await axios.get(
          API_DATA_ACCESS_MAPPING,
          newAxiosConfig,
        );
        await dispatch(updateAuthDataMapping(data));

        const { data: actions } = await axios.get(
          API_AUTH_ACTIONS,
          newAxiosConfig,
        );
        await dispatch(updateAuthActions({ actions }));

        const { data: hasAccessMapping } = await axios.get(
          API_CHECK_DATA_ACCESS_MAPPING,
          newAxiosConfig,
        );
        await dispatch(updateAuthHasAccessMapping({ hasAccessMapping }));
        // if the user request the unprotectedRoutes, we need to redirect them to /dashboard immediately
        res.setHeader('set-cookie', respChallenge.headers['set-cookie']);
        if (isUnProtectedRoute && req.query['menu']) {
          return {
            redirect: {
              destination: thirdPartyLoginMenu(req.query['menu']),
            },
          };
        } else if (isUnProtectedRoute) {
          return {
            redirect: dashboardRedirect,
          };
        }
        return {};
      } catch (e) {
        // when generating new token encounters errors
        // or when fetching the current user data, it encounters an errors
        const respLogout = await axios.get(API_AUTH_LOGOUT);
        await dispatch(logout({}));

        // remove cookies
        res.setHeader('set-cookie', respLogout.headers['set-cookie']);

        // if the user request the protectedRoutes, we need to redirect them to /login immediately
        if (!isUnProtectedRoute) {
          return {
            redirect: loginRedirect,
          };
        } else return {};
      }
    } else return {};
  });
