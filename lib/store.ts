import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { authSlice } from './slice/auth';
import { dashboardSlice } from './slice/dashboard';
import { dashboardMenuSlice } from './slice/dashboardMenu';
import { dataAccessMappingSlice } from './slice/dataAccessMapping';
import { routerHistorySlice } from './slice/routerHistory';
import { footerSlice } from './slice/footer';

const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  dashboard: dashboardSlice.reducer,
  footer: footerSlice.reducer,
  dashboardMenu: dashboardMenuSlice.reducer,
  routerHistory: routerHistorySlice.reducer,
  dataAccessMapping: dataAccessMappingSlice.reducer,
});
export type OurStore = ReturnType<typeof combinedReducers>;

const rootReducer = (
  state: ReturnType<typeof combinedReducers> | undefined,
  action: AnyAction,
) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return combinedReducers(state, action);
};

export const store = configureStore<OurStore>({
  reducer: rootReducer,
});

export type OurState = {
  state: OurStore;
};

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

export type MyThunkDispatch = typeof store.dispatch;
