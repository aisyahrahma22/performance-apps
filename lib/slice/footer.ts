import { createSlice } from '@reduxjs/toolkit';
import { OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';

export interface FooterState {
  isFooter: boolean;
  footerContent?: JSX.Element;
}

const initialState = {
  isFooter: false,
};

export const footerSlice = createSlice<
  FooterState,
  SliceCaseReducers<FooterState>
>({
  name: 'dashboard-footer',
  initialState,
  reducers: {
    updateSlicer: (state, { payload }) => {
      state.isFooter = payload.isFooter;
      state.footerContent = payload.footerContent;
    },
  },
});

export const { updateSlicer } = footerSlice.actions;

export const footerStateSelector = (state: OurStore) => {
  const { isFooter, footerContent } = state.footer;

  return {
    isFooter,
    footerContent,
  };
};
