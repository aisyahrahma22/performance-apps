import { createSlice } from '@reduxjs/toolkit';
import { OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';
import { RightEnum } from '../enums/RightEnum';

export interface DashboardMenuState {
  menu: string;
}

const initialState = {
  menu: RightEnum.DASHBOARD_TALENT_VIEW,
};

export const dashboardMenuSlice = createSlice<
  DashboardMenuState,
  SliceCaseReducers<DashboardMenuState>
>({
  name: 'dashboard-menu',
  initialState,
  reducers: {
    updateSlicer: (state, { payload }) => {
      state.menu = payload.menu;
    },
  },
});

export const { updateSlicer } = dashboardMenuSlice.actions;

export const menuStateSelector = (state: OurStore) => {
  const { menu } = state.dashboardMenu;

  return {
    menu,
  };
};
