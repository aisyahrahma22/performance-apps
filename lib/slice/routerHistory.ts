import { createSlice } from '@reduxjs/toolkit';
import { OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';
import Router from 'next/router';

export interface DataHistoryProps {
  filter?: any;
  page?: number;
  sort?: any;
}

export interface RouterHistorySliceState {
  pathName: string;
  destinationPath: string;
  indexTabMenu: number;
  data: DataHistoryProps;
}

const initialState = {
  pathName: '',
  destinationPath: '',
  indexTabMenu: 0,
  data: {
    filter: {},
    page: 1,
    sort: {},
  },
};

export const routerHistorySlice = createSlice<
  RouterHistorySliceState,
  SliceCaseReducers<RouterHistorySliceState>
>({
  name: 'routerHistory',
  initialState,
  reducers: {
    updateRouterHistory: (state, { payload }) => {
      state.pathName = payload.pathName;
      state.destinationPath = payload.destinationPath;
      state.indexTabMenu = payload.indexTabMenu;
      state.data = payload.data;
      if (payload.destinationPath)
        Router.push(payload.destinationPath, undefined, { shallow: true });
    },
    resetHistory: (state) => {
      state.pathName = '';
      state.destinationPath = '';
      state.indexTabMenu = 0;
      state.data = {
        filter: {},
        page: 1,
        sort: {},
      };
    },
  },
});

export const { updateRouterHistory, resetHistory } = routerHistorySlice.actions;

export const routerHistorySelector = (state: OurStore) =>
  state.routerHistory || {};
