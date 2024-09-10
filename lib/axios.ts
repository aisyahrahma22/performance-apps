import axios from 'axios';
import delayAdapterEnhancer from 'axios-delay';
import createAuthRefreshInterceptor, {
  AxiosAuthRefreshRequestConfig,
} from 'axios-auth-refresh';
import { store } from './store';
import {
  API_ACTIVITY_LOG,
  API_AUTH,
  API_AUTH_ACTIONS,
  API_AUTH_AUTHORIZE,
  API_AUTH_CHALLENGE,
  API_AUTH_LOGOUT,
  API_AUTH_ME,
  API_AUTH_ROLE,
  API_AUTH_THIRD_PARTY,
  fetchAuthLogout,
  setTokenExpiration,
} from './slice/auth';
import { toNumber } from 'lodash';

export const isServer = typeof window === 'undefined';

// export let dashboardController = new AbortController();

const axiosInstance = axios.create({
  baseURL: isServer ? `http://localhost:${process.env.PORT}` : undefined,
  withCredentials: true,
  adapter: delayAdapterEnhancer(axios.defaults.adapter as any) as any,
  // signal: dashboardController.signal,
});

if (!isServer) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const url = new Set([
        API_AUTH,
        API_AUTH_AUTHORIZE,
        API_AUTH_THIRD_PARTY,
        API_ACTIVITY_LOG,
      ] as string[]);

      if (url.has(config?.url as string)) {
        try {
          const { data: ipAddress } = await axios.get(
            'https://api.ipify.org/',
            {
              timeout: 2000,
            },
          );
          if (ipAddress && config && config.headers) {
            config.headers.ipAddress = ipAddress;
          }
          if (config.url == API_ACTIVITY_LOG) {
            config.data.ipAddress = ipAddress;
          }
        } catch (err) {
          return config;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      const url = new Set([
        API_AUTH_LOGOUT,
        API_ACTIVITY_LOG,
        API_AUTH_CHALLENGE,
        API_AUTH,
        API_AUTH_AUTHORIZE,
        API_AUTH_ROLE,
        API_AUTH_ME,
        API_AUTH_ACTIONS,
        API_AUTH_THIRD_PARTY,
      ] as string[]);

      if (
        !url.has(response?.config?.url as string) &&
        response?.config?.method != 'get'
      ) {
        axios.get('https://api.ipify.org/').then(({ data }) => {
          axios.post(API_ACTIVITY_LOG, {
            endPoint: response?.config?.url,
            type: response?.config?.method,
            ipAddress: data,
          });
        });
      }
      const sessionExp = response.headers['x-session-idle-exp'];
      if (sessionExp) {
        const { dispatch, getState } = store;
        const tokenExpState = getState().auth?.tokenExpiration;
        const sessionExpFromHeader = toNumber(sessionExp);
        const isExpChanged = !(tokenExpState == sessionExpFromHeader);
        if (isExpChanged) {
          dispatch(setTokenExpiration(sessionExpFromHeader));
        }
      }
      return response;
    },
    (error) => {
      const { dispatch } = store;
      if (error?.response?.config?.url?.includes('/api/auth/challenge')) {
        dispatch(fetchAuthLogout());
      }
      return Promise.reject(error);
    },
  );
  createAuthRefreshInterceptor(axiosInstance, () => {
    return axiosInstance
      .post('/api/auth/challenge', {}, {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig)
      .then(() => {
        return Promise.resolve();
      });
  });
}

export default axiosInstance;
