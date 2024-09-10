import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { isServer } from '../axios';
import { OurState, OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Encrypt } from '../util/crypto';

export const API_AUTH_CHALLENGE = '/api/auth/challenge';
export const API_AUTH = '/api/auth';
export const API_AUTH_LOGOUT = '/api/auth/logout';
export const API_AUTH_AUTHORIZE = '/api/auth/authorize';
export const API_AUTH_AUTHORIZE_CHANGE_USER = '/api/auth/authorize-change-user';
export const API_AUTH_ROLE = '/api/auth/role';
export const API_AUTH_ME = '/api/auth/me';
export const API_AUTH_ACTIONS = '/api/auth/actions';
export const API_AUTH_THIRD_PARTY = '/api/third-party/auth';
export const API_CHECK_DATA_ACCESS_MAPPING =
  '/api/DataAccessMapping/check-access';
export const API_ACTIVITY_LOG = '/api/auth/log-activity';

const isAuthorized = (data: string) => data === 'Authorized';
const isAuthenticatedWl = (data: string) => data === 'AuthenticatedWl';

export type AuthLogin = { username: string; password: string };
export const fetchAuthLogin = createAsyncThunk<any, AuthLogin, OurState>(
  'login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(API_AUTH, credentials, {
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig);
      if (isAuthorized(data)) {
        dispatch(authorized({}));
        dispatch(fetchAuthMe());
        dispatch(fetchAuthActions());
        dispatch(fetchAuthHasAccessMapping());
      } else if (isAuthenticatedWl(data)) {
        dispatch(authenticatedWl({}));
      }
      return {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export type AuthThirdPartyLogin = { token: string; empNo: string };
export const fetchAuthThirdPartyLogin = createAsyncThunk<
  any,
  AuthThirdPartyLogin,
  OurState
>('login', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await axios.post(API_AUTH_THIRD_PARTY, credentials, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig);
    if (isAuthorized(data)) {
      dispatch(authorized({}));
      dispatch(fetchAuthMe());
      dispatch(fetchAuthActions());
      dispatch(fetchAuthHasAccessMapping());
    }
    return {};
  } catch (err: any) {
    let errMsg = err?.response?.data?.message;
    if (!errMsg?.includes('Your session') && err.response.status === 401) {
      errMsg = 'Invalid Token';
    }
    return rejectWithValue(errMsg);
  }
});

export const fetchAuthLogout = createAsyncThunk('logout', async () => {
  await axios.get(API_AUTH_LOGOUT, {
    skipAuthRefresh: true,
    delay: 2000,
  } as AxiosAuthRefreshRequestConfig);
  return {};
});

export type AuthAuthorize = {
  roleId: string;
  userId?: string;
  closePress?: any;
  isChangeUser?: boolean;
};
export const fetchAuthAuthorize = createAsyncThunk<
  any,
  AuthAuthorize,
  { state: OurStore }
>(
  'authorize',
  async (
    { roleId, userId, closePress, isChangeUser },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        !isChangeUser ? API_AUTH_AUTHORIZE : API_AUTH_AUTHORIZE_CHANGE_USER,
        {
          roleId: Encrypt(roleId),
          userId: userId ? Encrypt(userId) : null,
        },
        {
          skipAuthRefresh: true,
        } as AxiosAuthRefreshRequestConfig,
      );

      if (isChangeUser) return closePress();

      if (isAuthorized(data)) {
        dispatch(fetchAuthMe());
        dispatch(fetchAuthActions());
        dispatch(fetchAuthHasAccessMapping());
        return {};
      } else {
        return rejectWithValue('No access token has been generated');
      }
    } catch (err: any) {
      // Close Modal Profile Choose Role
      closePress();
      dispatch(fetchAuthLogout());
      return rejectWithValue(
        err.response?.status === 401
          ? 'Oops! Something when wrong, Please try again.'
          : err.response?.message || err.toString(),
      );
    }
  },
);

export type AuthRole = void;
export const fetchAuthRole = createAsyncThunk<any, AuthRole, OurState>(
  'role',
  async (_payload, { rejectWithValue }) => {
    try {
      const { data: role } = await axios.get(API_AUTH_ROLE);
      return {
        role,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.message || 'Error when fetching current role',
      );
    }
  },
);

export type AuthMe = void;
export const fetchAuthMe = createAsyncThunk<any, AuthMe, OurState>(
  'me',
  async (_payload, { rejectWithValue }) => {
    try {
      const {
        data: { exp, employee, ...user },
      } = await axios.get(API_AUTH_ME);
      return {
        user,
        employee,
        exp,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.message || err.toString());
    }
  },
);

export type AuthActions = void;
export const fetchAuthActions = createAsyncThunk<any, AuthActions, OurState>(
  'actions',
  async () => {
    const { data: actions } = await axios.get(API_AUTH_ACTIONS);
    return {
      actions,
    };
  },
);

export type AuthHasAccessMapping = void;
export const fetchAuthHasAccessMapping = createAsyncThunk<
  any,
  AuthHasAccessMapping,
  OurState
>('access-mapping', async () => {
  const { data: hasAccessMapping } = await axios.get(
    API_CHECK_DATA_ACCESS_MAPPING,
  );
  return {
    hasAccessMapping,
  };
});

export interface AuthSliceState {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  isAuthenticatingWl: boolean;
  isAuthenticatedWl: boolean;
  isAuthorizing: boolean;
  isAuthorized: boolean;
  isLoggingOut: boolean;
  isFetchingUserRole: boolean;
  isFetchingUserProfile: boolean;
  isFetchingUserActions: boolean;
  isCheckingAccessMaping: boolean;
  isLoadingAuth?: boolean;
  user?: any;
  employee?: any;
  role?: any;
  tokenExpiration?: number;
  actions?: string[];
  hasAccessMapping?: boolean;
}

const initialState = {
  isAuthenticating: false,
  isAuthenticated: false,
  isAuthenticatingWl: false,
  isAuthenticatedWl: false,
  isAuthorizing: false,
  isAuthorized: false,
  isLoggingOut: false,
  isFetchingUserRole: false,
  isFetchingUserProfile: false,
  isFetchingUserActions: false,
  isCheckingAccessMaping: false,
  isLoadingAuth: false,
};

export const authSlice = createSlice<
  AuthSliceState,
  SliceCaseReducers<AuthSliceState>
>({
  name: 'auth',
  initialState: initialState,
  reducers: {
    updateAuthMe: (state, { payload }) => {
      state.isFetchingUserProfile = false;
      state.user = payload.user;
      state.employee = payload.employee;
      state.tokenExpiration = payload.exp;
    },
    updateAuthActions: (state, { payload }) => {
      state.isFetchingUserActions = false;
      state.actions = payload.actions;
    },
    updateAuthHasAccessMapping: (state, { payload }) => {
      state.isCheckingAccessMaping = false;
      state.hasAccessMapping = payload.hasAccessMapping;
    },
    updateAuthRole: (state, { payload }) => {
      state.isFetchingUserRole = false;
      state.role = payload.role;
    },
    setLoadingAuth: (state, { payload }) => {
      state.isLoadingAuth = payload;
    },
    setLoggingOut: (state, { payload }) => {
      state.isLoggingOut = payload;
    },
    setTokenExpiration: (state, { payload }) => {
      state.tokenExpiration = payload;
    },
    authorized: (state) => {
      state.isAuthorized = true;
    },
    authenticatedWl: (state) => {
      state.isAuthenticatedWl = true;
    },
    logout: () => {
      if (!isServer) Router.push('/login');
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthLogin.pending, (state) => {
        state.isAuthenticating = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchAuthLogin.fulfilled, (state: AuthSliceState) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthLogin.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        toast.error(action.payload as string, {
          toastId: 'error-login',
        });
      })
      .addCase(fetchAuthAuthorize.pending, (state) => {
        state.isAuthorizing = true;
      })
      .addCase(fetchAuthAuthorize.fulfilled, (state) => {
        state.isAuthorized = true;
      })
      .addCase(fetchAuthAuthorize.rejected, (state, action) => {
        state.isAuthorizing = false;
        state.isAuthorized = false;
        toast.error(action.payload as string, {
          toastId: 'error-authorize',
        });
      })
      .addCase(fetchAuthRole.pending, (state) => {
        state.isFetchingUserRole = true;
      })
      .addCase(fetchAuthRole.fulfilled, (state, { payload }) => {
        state.isFetchingUserRole = false;
        state.role = payload.role;
        state.actions = payload.role?.rights?.map((v: any) => v.code);
      })
      .addCase(fetchAuthRole.rejected, (state, action) => {
        state.isFetchingUserRole = false;
        toast.error(action.payload as string, {
          toastId: 'error-role',
        });
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.isFetchingUserProfile = true;
      })
      .addCase(fetchAuthMe.fulfilled, (state, { payload }) => {
        state.isFetchingUserProfile = false;
        state.user = payload.user;
        state.employee = payload.employee;
        state.tokenExpiration = payload.exp;
      })
      .addCase(fetchAuthMe.rejected, (state, action) => {
        state.isFetchingUserProfile = false;
        toast.error(action.payload as string, {
          toastId: 'error-me',
        });
      })
      .addCase(fetchAuthActions.pending, (state) => {
        state.isFetchingUserActions = true;
      })
      .addCase(fetchAuthActions.fulfilled, (state, { payload }) => {
        state.isFetchingUserActions = false;
        state.actions = payload.actions;
      })
      .addCase(fetchAuthActions.rejected, (state, action) => {
        state.isFetchingUserActions = false;
        toast.error(action.payload as string, {
          toastId: 'error-actions',
        });
      })
      .addCase(fetchAuthHasAccessMapping.pending, (state) => {
        state.isCheckingAccessMaping = true;
      })
      .addCase(fetchAuthHasAccessMapping.fulfilled, (state, { payload }) => {
        state.isCheckingAccessMaping = false;
        state.hasAccessMapping = payload.hasAccessMapping;
      })
      .addCase(fetchAuthHasAccessMapping.rejected, (state, action) => {
        state.isCheckingAccessMaping = false;
        toast.error(action.payload as string, {
          toastId: 'error-access-mapping',
        });
      })
      .addCase(fetchAuthLogout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(fetchAuthLogout.fulfilled, () => initialState);
  },
});

export const {
  updateAuthMe,
  updateAuthActions,
  updateAuthHasAccessMapping,
  updateAuthRole,
  authorized,
  authenticatedWl,
  logout,
  setLoadingAuth,
  setLoggingOut,
  setTokenExpiration,
} = authSlice.actions;

export const authStateSelector = (state: OurStore) => state.auth || {};
export const loadingAuthStateSelector = (state: OurStore) =>
  state.auth.isLoadingAuth;
export const currentUserSelector = (state: OurStore) => state.auth.user || {};
export const currentTokenExpiration = (state: OurStore) =>
  state.auth.tokenExpiration || 0;
export const currentEmployeeSelector = (state: OurStore) =>
  state.auth.employee || {};
export const currentRoleSelector = (state: OurStore) => state.auth.role || {};
export const currentActionsSelector = (state: OurStore) =>
  state.auth.actions || [];
export const currentHasAccessMappingSelector = (state: OurStore) =>
  state.auth.hasAccessMapping || false;
